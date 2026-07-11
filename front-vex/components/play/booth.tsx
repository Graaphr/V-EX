"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sharedTextureLoader } from "@/components/shared/ui/LoadingManager";

// Shared texture cache across all booths (and experience.tsx panels),
// keyed by URL, so the same poster/sampul isn't downloaded/decoded twice.
const textureCache = new Map<string, THREE.Texture>();

function loadCachedTexture(
  path: string,
  onLoad: (tex: THREE.Texture) => void,
  flipY = false
) {
  if (!path) return;

  const cached = textureCache.get(path);
  if (cached) {
    onLoad(cached);
    return;
  }

  // sharedTextureLoader pakai THREE.DefaultLoadingManager — sama dengan
  // manager yang dibaca useProgress() di ExhibitionPage — sehingga texture
  // poster/sampul ikut terhitung dalam progress bar loading.
  sharedTextureLoader.load(
    path,
    (tex) => {
      tex.flipY = flipY;
      tex.colorSpace = THREE.SRGBColorSpace;
      textureCache.set(path, tex);
      onLoad(tex);
    },
    undefined,
    () => {}
  );
}

type BoothProps = {
  position?: [number, number, number];
  quaternion?: [number, number, number, number];
  boothName: string;
  poster: string;
  sampul: string;
  tautan?: string;
  modelPath: string;
  // Mode kamera player saat ini & apakah lagi di HP — dipakai buat
  // nge-skip klik langsung pas desktop third-person (lihat handleClick),
  // karena di situ interaksi udah dipindah ke tombol E (ThirdPersonInteract
  // di experience.tsx). Mobile third-person tetap pakai tap seperti biasa.
  cameraMode: "first" | "third";
  mobile: boolean;
  openPoster: (src: string, booth: string) => void;
  openTautan: (url: string, booth: string) => void;
};

export default function Booth({
  position = [0, 0, 0],
  quaternion = [0, 0, 0, 1],
  boothName, poster, sampul, tautan, modelPath,
  cameraMode, mobile,
  openPoster, openTautan,
}: BoothProps) {
  const gltf = useGLTF(modelPath);
  const scene = useMemo(() => gltf.scene.clone(), [gltf]);
  const quaternionObj = useMemo(() => new THREE.Quaternion(...quaternion), [quaternion]);

  const posterMesh = useRef<THREE.Mesh | null>(null);
  const sampulMesh = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;
      if (obj.name?.toLowerCase().includes("collider")) {
        obj.visible = false;
        obj.userData.collider = true;
      }
    });
    posterMesh.current = scene.getObjectByName("PanelPoster") as THREE.Mesh;
    sampulMesh.current = scene.getObjectByName("PanelVideo") as THREE.Mesh;

    // Tag kedua panel dengan userData.interact — dipakai oleh
    // ThirdPersonInteract (lihat experience.tsx) buat fitur "tekan E untuk
    // berinteraksi" pas mode third-person. Raycast generik dari kamera jadi
    // langsung tahu ini panel apa & booth mana, tanpa perlu balik lagi ke
    // closure Booth ini.
    if (posterMesh.current) {
      posterMesh.current.userData.interact = poster
        ? { type: "poster", src: poster, boothName }
        : null;
    }
    if (sampulMesh.current) {
      sampulMesh.current.userData.interact = tautan
        ? { type: "video", url: tautan, boothName }
        : null;
    }

    // Note: textures themselves are not disposed here since they're shared
    // via textureCache and may be referenced by other booths/panels.
    // Only the per-mesh material instance is disposed, in the effects below.
  }, [scene, poster, tautan, boothName]);

  useEffect(() => {
    if (!poster || !posterMesh.current) return;

    let cancelled = false;

    loadCachedTexture(poster, (tex) => {
      if (cancelled || !posterMesh.current) return;
      (posterMesh.current.material as THREE.Material)?.dispose?.();
      posterMesh.current.material = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
    });

    return () => {
      cancelled = true;
    };
  }, [poster, scene]);

  useEffect(() => {
    if (!sampul || !sampulMesh.current) return;

    let cancelled = false;

    loadCachedTexture(sampul, (tex) => {
      if (cancelled || !sampulMesh.current) return;
      (sampulMesh.current.material as THREE.Material)?.dispose?.();
      sampulMesh.current.material = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
    }, true);

    return () => {
      cancelled = true;
    };
  }, [sampul, scene]);

  /* ===================== */
  /* CLICK RANGE / OCCLUSION */
  /* r3f pointer raycasting skips invisible meshes — dan collider dinding    */
  /* memang di-set visible=false — jadi klik panel bawaan r3f TIDAK          */
  /* terpengaruh tembok maupun jarak sama sekali. Di sini kita lempar ray    */
  /* kedua secara manual dari kamera ke titik klik, khusus buat cek jarak    */
  /* dan apakah ada collider (userData.collider) yang menghalangi.          */
  /* ===================== */

  const { camera, scene: world } = useThree();
  const occlusionRay = useRef(new THREE.Raycaster());

  const MAX_INTERACT_DISTANCE = 8;

  // Cek apakah `obj` adalah bagian dari (descendant) `root`. Dipakai buat
  // membedakan collider "milik sendiri" (rangka/pedestal booth ini, yang
  // memang menempel/berhimpit dengan panelnya sendiri) dari collider
  // eksternal (dinding hall, booth lain) yang benar-benar harus menghalangi.
  const isDescendantOf = (obj: THREE.Object3D, root: THREE.Object3D) => {
    let cur: THREE.Object3D | null = obj;
    while (cur) {
      if (cur === root) return true;
      cur = cur.parent;
    }
    return false;
  };

  const isBlocked = useCallback(
    (point: THREE.Vector3, distance: number) => {
      if (distance > MAX_INTERACT_DISTANCE) return true;

      const dir = point.clone().sub(camera.position).normalize();
      occlusionRay.current.set(camera.position, dir);
      // Berhenti sedikit sebelum titik klik supaya panel yang diklik sendiri
      // tidak dihitung sebagai "penghalang" dirinya sendiri.
      occlusionRay.current.far = Math.max(distance - 0.1, 0);
      occlusionRay.current.near = 0;

      const hits = occlusionRay.current
        .intersectObjects(world.children, true)
        .filter((h: any) => h.object?.userData?.collider && !isDescendantOf(h.object, scene));

      return hits.length > 0;
    },
    [camera, world, scene]
  );

  const handleClick = (e: any) => {
    const clicked = e?.object?.name;
    if (clicked !== "PanelPoster" && clicked !== "PanelVideo") return;

    // Begitu ray kena salah satu panel yang relevan, stop di sini — jangan
    // biarkan event nembus/lanjut ke intersection lain di belakangnya.
    // Ini yang bikin klik poster kadang malah ke-trigger sebagai klik video
    // (dan sebaliknya) saat kedua panel berhimpit di ray yang sama.
    e.stopPropagation();

    // Di desktop third-person, interaksi udah dipindah ke tombol E (nggak
    // ada crosshair buat nunjuk lagi, mouse dipakai buat nengok terus) —
    // klik langsung di-skip di sini. Mobile third-person tetap pakai tap
    // seperti biasa karena nggak ada tombol E di HP.
    if (cameraMode === "third" && !mobile) return;

    if (isBlocked(e.point, e.distance)) return;

    if (clicked === "PanelPoster" && poster) openPoster(poster, boothName);
    if (clicked === "PanelVideo" && tautan) openTautan(tautan, boothName);
  };

  return (
    <group position={position} quaternion={quaternionObj}>
      <primitive object={scene} position={[0, 0, -1.2]} onClick={handleClick} />
    </group>
  );
}