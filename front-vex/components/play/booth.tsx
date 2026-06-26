"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Shared loader — bukan dibuat ulang tiap Booth
const textureLoader = new THREE.TextureLoader();

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

  textureLoader.load(
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
  openPoster: (src: string, booth: string) => void;
  openTautan: (url: string, booth: string) => void;
};

export default function Booth({
  position = [0, 0, 0],
  quaternion = [0, 0, 0, 1],
  boothName, poster, sampul, tautan, modelPath,
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

    // Note: textures themselves are not disposed here since they're shared
    // via textureCache and may be referenced by other booths/panels.
    // Only the per-mesh material instance is disposed, in the effects below.
  }, [scene]);

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

  const handleClick = (e: any) => {
    const clicked = e?.object?.name;
    if (clicked === "PanelPoster" && poster) openPoster(poster, boothName);
    if (clicked === "PanelVideo" && tautan) openTautan(tautan, boothName);
  };

  return (
    <group position={position} quaternion={quaternionObj}>
      <primitive object={scene} position={[0, 0, -1.2]} onClick={handleClick} />
    </group>
  );
}