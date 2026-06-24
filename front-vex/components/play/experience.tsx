"use client";

import { useGLTF, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import Booth from "./booth";
import Player from "./player";

import url from "@/lib/axios";

type RemotePlayer = {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  updatedAt: number;
};

type Props = {
  exhibitionId: string;
  mobile: boolean;
  playerId: string;
  playerName: string;
  openPoster: (src: string, booth: string) => void;
  openTautan: (url: string, booth: string) => void;
  controlsLocked: boolean;
  soundOn: boolean;
  currentFloor: number;
  mobileMove?: { w: boolean; a: boolean; s: boolean; d: boolean };
  lookDelta?: React.MutableRefObject<{ x: number; y: number }>;
};

/* ===================== */
/* WRAPPER — fetch dulu  */
/* ===================== */

export default function Experience(props: Props) {
  const [hallModel, setHallModel] = useState<string | null>(null);
  const [karyaList, setKaryaList] = useState<any[]>([]);
  const [folder, setFolder] = useState<string | null>(null); // ← null dulu

  useEffect(() => {
    url.get(`/api/experience/3d-models/${props.exhibitionId}`)
      .then((res) => setHallModel(res.data.model_hall))
      .catch((err) => console.error("Failed to load hall model", err));

    url.get(`/api/experience/karya/pameran/${props.exhibitionId}`)
      .then((res) => setKaryaList(res.data.karya ?? res.data))
      .catch((err) => console.error("Failed to load karya list", err));

    url.get(`/api/pameran/${props.exhibitionId}`)
      .then((res) => {
        const kategori = res.data.pameran?.kode_prodi ?? "default"; // ← kode_prodi bukan kategori
        setFolder(kategori.toLowerCase().replaceAll(" ", "-"));
      })
      .catch(() => setFolder("default")); // fallback kalau gagal
  }, [props.exhibitionId]);

  // ← tunggu keduanya sebelum render
  if (!hallModel || !folder) return null;

  return (
    <ExperienceInner
      {...props}
      hallModel={hallModel}
      karyaList={karyaList}
      folder={folder}
    />
  );
}

/* ===================== */
/* INNER                 */
/* ===================== */

function ExperienceInner({
  exhibitionId,
  playerId,
  playerName,
  openPoster,
  openTautan,
  controlsLocked,
  soundOn,
  currentFloor,
  mobileMove,
  lookDelta,
  hallModel,
  karyaList,
  folder,
}: Props & { hallModel: string; karyaList: any[]; folder: string }) {
  const [audioUrls, setAudioUrls] = useState({ bgm: "", footstep: "", jump: "" });
  const [walking, setWalking] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [remotePlayers, setRemotePlayers] = useState<RemotePlayer[]>([]);

  const isViewingMedia = !controlsLocked;

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const footRef = useRef<HTMLAudioElement | null>(null);
  const jumpRef = useRef<HTMLAudioElement | null>(null);
  const loader = useRef(new THREE.TextureLoader());

  const { scene } = useGLTF(hallModel);

  /* ===================== */
  /* AUDIO                 */
  /* ===================== */

  useEffect(() => {
    url.get("/api/experience/game-assets")
      .then(({ data }) => setAudioUrls({ bgm: data.bgm, footstep: data.footstep, jump: data.jump }))
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!audioUrls.bgm || !audioUrls.footstep || !audioUrls.jump) return;
    bgmRef.current = Object.assign(new Audio(audioUrls.bgm), { loop: true, volume: 0.35 });
    footRef.current = Object.assign(new Audio(audioUrls.footstep), { loop: true, volume: 0.55 });
    jumpRef.current = Object.assign(new Audio(audioUrls.jump), { volume: 0.75 });
    return () => { bgmRef.current?.pause(); footRef.current?.pause(); jumpRef.current?.pause(); };
  }, [audioUrls]);

  useEffect(() => {
    if (!bgmRef.current) return;
    if (soundOn) {
      bgmRef.current.volume = isViewingMedia ? 0.08 : 0.35;
      bgmRef.current.play().catch(() => { });
    } else {
      bgmRef.current.pause();
      footRef.current?.pause();
    }
  }, [soundOn, isViewingMedia]);

  useEffect(() => {
    if (!footRef.current) return;
    if (soundOn && walking && controlsLocked && !jumping) {
      footRef.current.play().catch(() => { });
    } else {
      footRef.current.pause();
      footRef.current.currentTime = 0;
    }
  }, [soundOn, walking, controlsLocked, jumping]);

  useEffect(() => {
    if (!jumpRef.current || !soundOn || !jumping) return;
    footRef.current?.pause();
    if (footRef.current) footRef.current.currentTime = 0;
    jumpRef.current.currentTime = 0;
    jumpRef.current.play().catch(() => { });
  }, [jumping, soundOn]);

  /* ===================== */
  /* MULTIPLAYER           */
  /* ===================== */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/player");
        const data = await res.json();
        const now = Date.now();
        const filtered = data.filter((p: any) => p.id !== playerId && now - p.updatedAt < 999999);
        setRemotePlayers((prev) => JSON.stringify(prev) === JSON.stringify(filtered) ? prev : filtered);
      } catch { }
    };
    load();
    const iv = setInterval(load, 200);
    return () => clearInterval(iv);
  }, [playerId]);

  /* ===================== */
  /* TEXTURE HELPER        */
  /* ===================== */

  const loadTextureSafe = useCallback((path: string, onLoad: (tex: THREE.Texture) => void) => {
    loader.current.load(path, (tex) => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      onLoad(tex);
    }, undefined, () => { });
  }, []);

  /* ===================== */
  /* DISPLAY TEXTURES      */
  /* ===================== */

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;
      const name = obj.name?.toLowerCase() || "";
      if (name.startsWith("paneldisplay")) {
        const num = parseInt(name.replace("paneldisplay", "")[1]);
        if (!isNaN(num)) loadTextureSafe(`/prodi/${folder}/${num}.png`, (tex) => {
          obj.material = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
        });
      }
      if (name === "panel") {
        loadTextureSafe(`/prodi/${folder}/${folder}.png`, (tex) => {
          obj.material = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
        });
      }
      if (name.startsWith("panelposter")) {
        const rest = name.replace("panelposter", "");
        const zone = rest[0];
        const slot = parseInt(rest.slice(1));
        const slotIndex = (slot - 1) % 6;

        const karyaInZone = karyaList
          .filter((k) => (k.kelas ?? "").toLowerCase() === zone)
          .sort((a, b) => a.id_karya - b.id_karya);

        const floorOffset = (currentFloor - 1) * 6;
        const karya = karyaInZone[floorOffset + slotIndex] ?? null;

        if (karya?.poster) {
          loadTextureSafe(karya.poster, (tex) => {
            obj.material = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
          }, true);
        }
      }

    });
  }, [scene, folder, loadTextureSafe, karyaList, currentFloor]);

  /* ===================== */
  /* BOOTH POINTS          */
  /* ===================== */

  const boothPoints = useMemo(() => {
    const result: any[] = [];
    scene.updateMatrixWorld(true);
    scene.traverse((obj: any) => {
      const lower = obj.name?.toLowerCase() || "";
      if (lower.startsWith("booth")) {
        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        obj.getWorldPosition(pos);
        obj.getWorldQuaternion(quat);
        result.push({ name: obj.name, position: [pos.x, pos.y, pos.z], quaternion: [quat.x, quat.y, quat.z, quat.w] });
        obj.visible = false;
        obj.raycast = () => null;
      }
      if (lower.includes("collider")) {
        obj.visible = false;
        obj.traverse((child: any) => { child.visible = false; if (child.isMesh) child.userData.collider = true; });
      }
    });
    return result;
  }, [scene]);

  /* ===================== */
  /* BOOTH MATCHING        */
  /* Zone: kelas A=zone a, B=zone b, etc.
     Slot: ordered by id_karya within zone, 6 per floor
  /* ===================== */

  const visibleBooths = useMemo(() => {
    return boothPoints.map((item) => {
      const nameLower = item.name.toLowerCase(); // "bootha1"
      const zone = nameLower.replace("booth", "")[0];     // "a"
      const slot = parseInt(nameLower.replace("booth", "").slice(1)); // 1-6

      // Filter karya by zone (kelas field from pengguna)
      const karyaInZone = karyaList
        .filter((k) => (k.kelas ?? "").toLowerCase() === zone)
        .sort((a, b) => a.id_karya - b.id_karya);

      // Slot index within this floor
      const floorOffset = (currentFloor - 1) * 6;
      const targetIndex = floorOffset + (slot - 1);
      const karya = karyaInZone[targetIndex] ?? null;

      return { item, karya };
    }).filter(({ karya }) => karya && karya.model_path);
  }, [boothPoints, karyaList, currentFloor]);

  return (
    <>
      <ambientLight intensity={2.2} />
      <directionalLight position={[10, 15, 10]} intensity={3} />
      <pointLight position={[0, 8, 0]} intensity={2} />

      <primitive object={scene} />

      {visibleBooths.map(({ item, karya }, i) => (
        <Booth
          key={`${item.name}-${currentFloor}`}
          boothName={karya.booth_name}
          position={item.position}
          quaternion={item.quaternion}
          poster={karya.poster}
          sampul={karya.sampul}
          tautan={karya.tautan}
          modelPath={karya.model_path}
          openPoster={openPoster}
          openTautan={openTautan}
        />
      ))}

      {remotePlayers.map((player) => (
        <RemotePlayerMesh key={player.id} player={player} />
      ))}

      <Player
        mode="first"
        controlsLocked={controlsLocked}
        setWalking={setWalking}
        setJumping={setJumping}
        mobileMove={mobileMove}
        lookDelta={lookDelta}
        playerId={playerId}
        playerName={playerName}
      />
    </>
  );
}

function RemotePlayerMesh({ player }: { player: RemotePlayer }) {
  const groupRef = useRef<THREE.Group>(null!);
  const currentPos = useRef(new THREE.Vector3(player.x, player.y, player.z));
  const targetPos = useRef(new THREE.Vector3(player.x, player.y, player.z));
  const currentRot = useRef(player.rotation);
  const targetRot = useRef(player.rotation);

  useEffect(() => {
    targetPos.current.set(player.x, player.y, player.z);
    targetRot.current = player.rotation;
  }, [player.x, player.y, player.z, player.rotation]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    currentPos.current.lerp(targetPos.current, 1 - Math.exp(-10 * delta));
    groupRef.current.position.copy(currentPos.current);
    currentRot.current = THREE.MathUtils.lerp(currentRot.current, targetRot.current, 1 - Math.exp(-10 * delta));
    groupRef.current.rotation.y = currentRot.current;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -1, 0]}>
        <capsuleGeometry args={[0.8, 1.8, 4, 8]} />
        <meshStandardMaterial color="cyan" transparent opacity={0.7} />
      </mesh>
      <Text position={[0, 1, 0]} fontSize={0.28} color="black" anchorX="center" anchorY="middle">
        {player.name}
      </Text>
    </group>
  );
}