"use client";

import {
  PointerLockControls,
  Text,
  Billboard,
  useGLTF,
} from "@react-three/drei";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

type Props = {
  mode: "first" | "third";

  controlsLocked: boolean;

  playerId: string;
  playerName: string;

  setPosition?: (
    pos: {
      x: number;
      y: number;
      z: number;
    }
  ) => void;

  setWalking?: (
    value: boolean
  ) => void;

  setJumping?: (
    value: boolean
  ) => void;

  mobileMove?: React.MutableRefObject<{
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
  }>;

  lookDelta?: React.MutableRefObject<{
    x: number;
    y: number;
  }>;

  // URL model player.glb (dari getPlayerModelUrl() di apiPlay.ts). Kalau
  // belum ada (masih fetching / gagal), fallback ke capsule seperti semula.
  playerModelUrl?: string | null;
};

export default function Player({
  mode,
  controlsLocked,
  setWalking,
  setJumping,
  mobileMove,
  lookDelta,

  playerId,
  playerName,

  setPosition,
  playerModelUrl,
}: Props) {
  const { camera, scene: world, gl } = useThree();

  const pointerRef = useRef<any>(null);
  // Sekarang jadi <group>, bukan lagi <mesh>, karena isinya bisa berupa
  // model GLB (primitive) atau capsule fallback.
  const playerMesh = useRef<THREE.Group>(null!);

  const raycaster = useRef(new THREE.Raycaster());

  /* ===================== */
  /* PLAYER */
  /* ===================== */

  const position = useRef(new THREE.Vector3(0, 20, -8));
  const velocityY = useRef(0);
  const grounded = useRef(false);

  /* ===================== */
  /* SETTINGS */
  /* ===================== */

  const MOVE_SPEED = 6;
  const GRAVITY = 24;
  const JUMP_FORCE = 10;
  // Tinggi kamera/mata dari lantai (dipakai buat first-person DAN sebagai
  // acuan third-person — lihat bagian CAMERA di useFrame di bawah). Naikin
  // angka ini buat bikin kamera lebih tinggi, turunin buat lebih rendah.
  const PLAYER_HEIGHT = 3;
  const COLLISION_DISTANCE = 0.7;

  /* ===================== */
  /* INPUT */
  /* ===================== */

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  });

  /* ===================== */
  /* COLLIDERS / FLOOR CACHE */
  /* ===================== */

  // Walls/obstacles, flagged via userData.collider
  const colliders = useRef<THREE.Object3D[]>([]);
  // Walkable meshes used for floor raycasting (cached instead of
  // re-scanning world.children every frame)
  const floorMeshes = useRef<THREE.Object3D[]>([]);

  /* ===================== */
  /* MOBILE */
  /* ===================== */

  const [isMobile, setIsMobile] = useState(false);

  /* ===================== */
  /* LOOK */
  /* ===================== */

  const yaw = useRef(0);
  const pitch = useRef(0);
  // Jarak kamera ke player pas third-person, bisa di-scroll (zoom) — gantiin
  // minDistance/maxDistance punya OrbitControls yang lama.
  const thirdPersonDistance = useRef(6);

  /* ===================== */
  /* MULTIPLAYER SAVE */
  /* ===================== */
const heartbeatTimer = useRef(0); // ← tambah ini
const HEARTBEAT_INTERVAL = 3;

  const saveTimer = useRef(0);
  const rotationY = useRef(0);
  const lastSent = useRef({ x: Infinity, y: Infinity, z: Infinity, rotation: Infinity });

  /* ===================== */
  /* REUSABLE SCRATCH OBJECTS (avoid per-frame GC pressure) */
  /* ===================== */

  const forwardVec = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3());
  const nextVec = useRef(new THREE.Vector3());
  const moveDirVec = useRef(new THREE.Vector3());
  const originVec = useRef(new THREE.Vector3());
  const floorOriginVec = useRef(new THREE.Vector3());
  const downVec = useRef(new THREE.Vector3(0, -1, 0));
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const camDirVec = useRef(new THREE.Vector3());
  const lookTargetVec = useRef(new THREE.Vector3());

  /* ===================== */
  /* MOBILE DETECT */
  /* ===================== */

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  /* ===================== */
  /* COLLIDER + FLOOR SCAN */
  /* ===================== */

  useEffect(() => {
    const scan = () => {
      const colliderArr: THREE.Object3D[] = [];
      const floorArr: THREE.Object3D[] = [];

      world.traverse((obj: any) => {
        if (!obj.isMesh) return;

        // Mesh milik player (badan player sendiri di mode third-person,
        // ATAU badan remote player lain) TIDAK pernah dianggap collider
        // maupun floor. Ini yang bikin antar player saling tembus — cuma
        // objek ber-tag "collider" dari hall/booth yang tetap menghalangi.
        if (obj.userData?.isPlayer) return;

        if (obj.userData?.collider) {
          colliderArr.push(obj);
          obj.visible = false;
        } else {
          // Anything mesh-like that isn't a collider is a floor candidate.
          floorArr.push(obj);
        }
      });

      colliders.current = colliderArr;
      floorMeshes.current = floorArr;

      // console.log("colliders:", colliderArr.length, "floor candidates:", floorArr.length);
    };

    const t1 = setTimeout(scan, 300);
    const t2 = setTimeout(scan, 1000);
    const t3 = setTimeout(scan, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [world]);

  /* ===================== */
  /* KEYBOARD */
  /* ===================== */

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!controlsLocked) return;

      if (e.code === "KeyW") keys.current.w = true;
      if (e.code === "KeyA") keys.current.a = true;
      if (e.code === "KeyS") keys.current.s = true;
      if (e.code === "KeyD") keys.current.d = true;
      if (e.code === "Space") keys.current.space = true;
    };

    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyW") keys.current.w = false;
      if (e.code === "KeyA") keys.current.a = false;
      if (e.code === "KeyS") keys.current.s = false;
      if (e.code === "KeyD") keys.current.d = false;
      if (e.code === "Space") keys.current.space = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [controlsLocked]);

  /* ===================== */
  /* REMOVE PLAYER */
  /* ===================== */

  useEffect(() => {
    const removePlayer = () => {
      fetch(`/api-internal/player?id=${playerId}`, {
        method: "DELETE",
      }).catch(() => {});
    };

    window.addEventListener("beforeunload", removePlayer);

    return () => {
      removePlayer();
      window.removeEventListener("beforeunload", removePlayer);
    };
  }, [playerId]);

  /* ===================== */
  /* POINTER UNLOCK */
  /* ===================== */

  // Dipakai di onLock (lihat return JSX) supaya callback-nya selalu baca
  // nilai controlsLocked terbaru, bukan closure lama dari saat pertama
  // <PointerLockControls> di-mount.
  const controlsLockedRef = useRef(controlsLocked);
  useEffect(() => {
    controlsLockedRef.current = controlsLocked;
  }, [controlsLocked]);

  useEffect(() => {
    // Di HP nggak pernah ada Pointer Lock beneran (<PointerLockControls> di
    // bawah cuma di-mount kalau !isMobile) — jadi "melepas lock" di sini
    // nggak ada gunanya, skip aja.
    if (isMobile) return;
    if (!controlsLocked) {
      pointerRef.current?.unlock?.();
      document.exitPointerLock?.();
    }
  }, [controlsLocked, isMobile]);

  /* ===================== */
  /* CAMERA MODE SWITCH    */
  /* ===================== */

  useEffect(() => {
    // Pindah mode (biasanya lewat tombol C di <CameraSwitcher>, atau tombol
    // "ganti sudut pandang" di HUD mobile). Pointer TIDAK di-unlock lagi di
    // sini — third-person sekarang tetap pakai pointer lock (mouse dipakai
    // buat nengok terus, bukan drag-orbit kayak sebelumnya), jadi cursor
    // harus tetap ke-hide baik di first maupun third person.
    if (mode === "third") {
      // Derive yaw/pitch awal dari arah kamera saat ini (peninggalan
      // first-person) supaya transisi ke belakang-badan player mulus,
      // nggak "patah" ke sudut acak begitu kamera dipindah ke belakang.
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      yaw.current = Math.atan2(dir.x, dir.z);
      pitch.current = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
      thirdPersonDistance.current = 6;

      // <PointerLockControls> (pemilik lock selama first-person) baru saja
      // unmount begitu mode berubah. Elemen yang terkunci sebenarnya tetap
      // canvas yang sama, jadi lock browser biasanya nggak ikut terlepas —
      // ini cuma jaring pengaman: kalau ternyata sempat lepas, dan kita
      // memang berhak mengunci lagi (controlsLocked, bukan mobile), minta
      // lock ulang langsung ke canvas milik r3f.
      if (!isMobile && controlsLockedRef.current && document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  /* ===================== */
  /* THIRD-PERSON LOOK (desktop) */
  /* Third-person sekarang juga pointer-lock: gerakan mouse (movementX/Y)   */
  /* update yaw/pitch terus-menerus, persis first-person — cuma kameranya   */
  /* diposisikan di belakang badan player, bukan pas di posisi mata. Mode   */
  /* first-person tetap dipegang penuh oleh <PointerLockControls> seperti   */
  /* semula — effect ini sengaja no-op selama mode === "first".            */
  /* ===================== */

  useEffect(() => {
    if (isMobile) return; // mobile pakai lookDelta dari joystick kanan

    const LOOK_SPEED = 0.0025;
    const PITCH_LIMIT = 1.2;

    const onMouseMove = (e: MouseEvent) => {
      if (mode !== "third") return;
      if (document.pointerLockElement !== gl.domElement) return;

      yaw.current -= e.movementX * LOOK_SPEED;
      pitch.current -= e.movementY * LOOK_SPEED;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
    };

    const onWheel = (e: WheelEvent) => {
      if (mode !== "third") return;
      thirdPersonDistance.current = Math.max(
        4,
        Math.min(8, thirdPersonDistance.current + e.deltaY * 0.01)
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("wheel", onWheel);
    };
  }, [mode, isMobile, gl]);

  /* ===================== */
  /* FRAME */
  /* ===================== */

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    /* ===================== */
    /* MOBILE LOOK */
    /* ===================== */

    if (isMobile && lookDelta) {
      yaw.current -= lookDelta.current.x;
      pitch.current -= lookDelta.current.y;
      pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));

      // Third-person nge-set orientasi kamera sendiri di bagian CAMERA di
      // bawah (lewat lookAt) — di sini cukup update yaw/pitch-nya aja.
      if (mode === "first") {
        eulerRef.current.set(pitch.current, yaw.current, 0, "YXZ");
        camera.quaternion.setFromEuler(eulerRef.current);
      }
    }

    /* ===================== */
    /* MOVE DIR */
    /* ===================== */

    camera.getWorldDirection(forwardVec.current);

    rotationY.current = Math.atan2(forwardVec.current.x, forwardVec.current.z);

    forwardVec.current.y = 0;
    forwardVec.current.normalize();

    rightVec.current.crossVectors(forwardVec.current, camera.up).normalize();

    nextVec.current.copy(position.current);

    let moving = false;

    const moveAmount = MOVE_SPEED * dt;

    const W = keys.current.w || mobileMove?.current.w;
    const A = keys.current.a || mobileMove?.current.a;
    const S = keys.current.s || mobileMove?.current.s;
    const D = keys.current.d || mobileMove?.current.d;

    if (controlsLocked) {
      if (W) {
        nextVec.current.addScaledVector(forwardVec.current, moveAmount);
        moving = true;
      }

      if (S) {
        nextVec.current.addScaledVector(forwardVec.current, -moveAmount);
        moving = true;
      }

      if (A) {
        nextVec.current.addScaledVector(rightVec.current, -moveAmount);
        moving = true;
      }

      if (D) {
        nextVec.current.addScaledVector(rightVec.current, moveAmount);
        moving = true;
      }
    }

    setWalking?.(moving && grounded.current);

    /* ===================== */
    /* WALL COLLISION */
    /* ===================== */
    // Note: colliders.current hanya berisi objek ber-tag "collider" (hall,
    // booth, dst). Mesh player lain sudah dikeluarkan sejak proses scan di
    // atas, jadi raycast ini TIDAK PERNAH menabrak player lain — antar
    // player otomatis saling tembus, sementara tembok/objek collider tetap
    // menghalangi seperti biasa.

    moveDirVec.current.copy(nextVec.current).sub(position.current);

    if (moveDirVec.current.length() > 0) {
      moveDirVec.current.normalize();

      originVec.current.copy(position.current);
      originVec.current.y -= 1;

      raycaster.current.set(originVec.current, moveDirVec.current);
      raycaster.current.far = COLLISION_DISTANCE;

      const hits = raycaster.current.intersectObjects(colliders.current, true);

      if (hits.length === 0) {
        position.current.copy(nextVec.current);
      }
    }

    /* ===================== */
    /* FLOOR CHECK (cached floor meshes — no full-scene raycast) */
    /* ===================== */

    grounded.current = false;

    floorOriginVec.current.copy(position.current);
    floorOriginVec.current.y += 0.2;

    raycaster.current.set(floorOriginVec.current, downVec.current);
    raycaster.current.far = 50;

    const floorHits = raycaster.current
      .intersectObjects(floorMeshes.current, true)
      .filter((hit: any) => hit.object.isMesh && !hit.object.userData?.collider)
      .sort((a, b) => a.distance - b.distance);

    if (floorHits.length > 0) {
      const floorY = floorHits[0].point.y;
      const targetY = floorY + PLAYER_HEIGHT;

      if (velocityY.current <= 0 && position.current.y <= targetY + 0.2) {
        grounded.current = true;
        velocityY.current = 0;
        setJumping?.(false);
        position.current.y = targetY;
      }
    }

    /* ===================== */
    /* JUMP */
    /* ===================== */

    if (grounded.current && keys.current.space) {
      velocityY.current = JUMP_FORCE;
      grounded.current = false;
      setJumping?.(true);
    }

    /* ===================== */
    /* GRAVITY */
    /* ===================== */

    if (!grounded.current) {
      velocityY.current -= GRAVITY * dt;
      position.current.y += velocityY.current * dt;
    }

    /* ===================== */
    /* CAMERA */
    /* ===================== */

    if (mode === "first") {
      camera.position.copy(position.current);
    }

    if (mode === "third") {
      // Koordinat bola dari yaw/pitch (di-update dari mouse/joystick di
      // atas) — bukan drag OrbitControls lagi. Kamera "menembus" badan
      // player buat lihat ke arah hadapnya, jadi getWorldDirection (dipakai
      // buat gerakan WASD di atas) otomatis tetap konsisten dengan arah
      // badan player menghadap.
      camDirVec.current.set(
        Math.sin(yaw.current) * Math.cos(pitch.current),
        Math.sin(pitch.current),
        Math.cos(yaw.current) * Math.cos(pitch.current)
      );

      lookTargetVec.current.copy(position.current);
      lookTargetVec.current.y += 1.2;

      camera.position
        .copy(lookTargetVec.current)
        .addScaledVector(camDirVec.current, -thirdPersonDistance.current);
      camera.lookAt(lookTargetVec.current);
    }

    /* ===================== */
    /* SAVE PLAYER */
    /* ===================== */

    setPosition?.({
      x: position.current.x,
      y: position.current.y,
      z: position.current.z,
    });

   saveTimer.current += dt;
heartbeatTimer.current += dt; // ← tambah ini, di luar if supaya selalu jalan

if (saveTimer.current >= 0.2 && playerName !== "Loading...") {
  saveTimer.current = 0;

  const moved =
    Math.abs(position.current.x - lastSent.current.x) > 0.01 ||
    Math.abs(position.current.y - lastSent.current.y) > 0.01 ||
    Math.abs(position.current.z - lastSent.current.z) > 0.01 ||
    Math.abs(rotationY.current - lastSent.current.rotation) > 0.01;

  // Heartbeat: walau pemain diam total (moved = false), tetap kirim POST
  // tiap HEARTBEAT_INTERVAL detik supaya `updatedAt` di Redis terus
  // ter-refresh dan key tidak expired (TTL) hanya karena idle — bukan
  // karena benar-benar disconnect.
  const heartbeatDue = heartbeatTimer.current >= HEARTBEAT_INTERVAL;

  if (moved || heartbeatDue) {
    lastSent.current = {
      x: position.current.x,
      y: position.current.y,
      z: position.current.z,
      rotation: rotationY.current,
    };

    if (heartbeatDue) heartbeatTimer.current = 0;

    fetch("/api-internal/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: playerId,
        name: playerName,
        x: position.current.x,
        y: position.current.y,
        z: position.current.z,
        rotation: rotationY.current,
      }),
    }).catch(() => {});
  }
}

    if (playerMesh.current && mode === "third") {
      playerMesh.current.position.copy(position.current);
      playerMesh.current.position.y -= 1.5;
      // Badan player ikut nengok sesuai arah hadap (yaw) — sebelumnya cuma
      // posisinya yang diupdate, badannya sendiri nggak pernah rotate.
      playerMesh.current.rotation.y = yaw.current;
    }
  });

  return (
    <>
      {!isMobile && mode === "first" && (
        <PointerLockControls
          ref={pointerRef}
          onLock={() => {
            // Listener klik bawaan PointerLockControls selalu aktif
            // (komponennya selalu ter-mount), jadi bisa saja ke-trigger
            // walau menu/poster/video sedang terbuka. Kalau itu terjadi,
            // langsung batalkan lagi — TIDAK BOLEH lock selama
            // controlsLocked masih false (mis. menu ESC sedang tampil).
            if (!controlsLockedRef.current) {
              pointerRef.current?.unlock?.();
              document.exitPointerLock?.();
            }
          }}
        />
      )}

      {mode === "third" && (
        <group ref={playerMesh}>
          {playerModelUrl ? (
            <PlayerBodyModel url={playerModelUrl} />
          ) : (
            // Fallback capsule kalau URL model belum siap / gagal load.
            // Tetap ditandai isPlayer supaya tidak ikut collider/floor scan.
            <mesh userData={{ isPlayer: true }}>
              <capsuleGeometry args={[0.5, 1.2, 4, 8]} />
              <meshStandardMaterial color="lime" transparent opacity={0.35} />
            </mesh>
          )}

          {/* Nametag sendiri — sebelumnya cuma remote player yang punya    */}
          {/* label nama di atas kepala (lihat RemotePlayerMesh di          */}
          {/* experience.tsx); badan sendiri nggak pernah dikasih Text.     */}
          {/* Dibungkus Billboard supaya pas dilihat teman dari sudut mana  */}
          {/* pun, nametag-nya tetap menghadap kamera mereka (bukan ikut    */}
          {/* muter sesuai rotation.y group ini).                          */}
          <Billboard position={[0, 2.5, 0]}>
            <Text fontSize={0.28} color="yellow" anchorX="center" anchorY="middle">
              {playerName}
            </Text>
          </Billboard>
        </group>
      )}
    </>
  );
}

/* ===================== */
/* PLAYER BODY MODEL (player.glb) */
/* ===================== */

// Di-clone per-instance (bukan pakai scene hasil useGLTF langsung) karena
// useGLTF men-cache & mengembalikan objek scene YANG SAMA untuk URL yang
// sama — kalau dipakai langsung, semua instance player akan berbagi satu
// object3D dan saling "rebutan" transform (posisi/rotasi ikut yang
// terakhir mount).
function PlayerBodyModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj: any) => {
      obj.userData.isPlayer = true;
    });
    return clone;
  }, [scene]);

  return <primitive object={cloned} />;
}