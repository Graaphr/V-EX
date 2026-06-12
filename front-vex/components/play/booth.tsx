"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type BoothProps = {
  position?: [number, number, number];
  quaternion?: [number, number, number, number];
  boothName: string;
  poster: string;       // URL gambar poster → PanelPoster
  sampul: string;       // URL gambar sampul → PanelVideo
  tautan?: string;      // embed URL → dikirim ke parent saat PanelVideo diklik
  modelPath: string;
  openPoster: (src: string, booth: string) => void;
  openTautan: (url: string, booth: string) => void; // ← callback ke page.tsx
};

export default function Booth({
  position = [0, 0, 0],
  quaternion = [0, 0, 0, 1],
  boothName,
  poster,
  sampul,
  tautan,
  modelPath,
  openPoster,
  openTautan,
}: BoothProps) {
  const gltf = useGLTF(modelPath);
  const scene = useMemo(() => gltf.scene.clone(), [gltf]);

  const posterMesh = useRef<THREE.Mesh | null>(null);
  const sampulMesh = useRef<THREE.Mesh | null>(null);

  /* ===================== */
  /* SETUP MESH            */
  /* ===================== */

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;
      const name = obj.name?.toLowerCase() || "";
      if (name.includes("collider")) {
        obj.visible = false;
        obj.userData.collider = true;
      }
    });

    posterMesh.current = scene.getObjectByName("PanelPoster") as THREE.Mesh;
    sampulMesh.current = scene.getObjectByName("PanelVideo") as THREE.Mesh;
  }, [scene]);

  /* ===================== */
  /* LOAD TEXTURE HELPER   */
  /* (silent fail jika 404)*/
  /* ===================== */

  const loadTexture = (path: string, onLoad: (tex: THREE.Texture) => void) => {
    if (!path) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      path,
      (tex) => {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        onLoad(tex);
      },
      undefined,
      () => { /* 404 atau gagal → diam saja, booth tetap render */ }
    );
  };

  /* ===================== */
  /* POSTER TEXTURE        */
  /* ===================== */

  useEffect(() => {
    if (!poster || !posterMesh.current) return;
    loadTexture(poster, (tex) => {
      if (!posterMesh.current) return;
      posterMesh.current.material = new THREE.MeshBasicMaterial({
        map: tex,
        toneMapped: false,
      });
    });
  }, [poster, scene]);

  /* ===================== */
  /* SAMPUL TEXTURE        */
  /* di PanelVideo mesh    */
  /* ===================== */

  useEffect(() => {
    if (!sampul || !sampulMesh.current) return;
    loadTexture(sampul, (tex) => {
      if (!sampulMesh.current) return;
      sampulMesh.current.material = new THREE.MeshBasicMaterial({
        map: tex,
        toneMapped: false,
      });
    });
  }, [sampul, scene]);

  /* ===================== */
  /* CLICK                 */
  /* ===================== */

  const handleClick = (e: any) => {
    const clicked = e?.object?.name;

    if (clicked === "PanelPoster" && poster) {
      openPoster(poster, boothName);
    }

    if (clicked === "PanelVideo" && tautan) {
      openTautan(tautan, boothName);
    }
  };

  return (
    <group
      position={position}
      quaternion={new THREE.Quaternion(...quaternion)}
    >
      <primitive
        object={scene}
        position={[0, 0, -1.2]}
        onClick={handleClick}
      />
    </group>
  );
}