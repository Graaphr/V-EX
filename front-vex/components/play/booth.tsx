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

// Hitung aspect ratio (lebar/tinggi) panel dari bounding box geometry-nya.
// Panel berupa plane tipis, jadi sumbu paling tipis (biasanya arah normal-
// nya) diabaikan — dua sumbu terbesar dianggap lebar & tinggi.
function computePlaneAspect(mesh: THREE.Mesh): number {
  const geo = mesh.geometry;
  if (!geo.boundingBox) geo.computeBoundingBox();
  const size = new THREE.Vector3();
  geo.boundingBox!.getSize(size);
  const dims = [size.x, size.y, size.z].sort((a, b) => b - a);
  return dims[1] > 0 ? dims[0] / dims[1] : 1;
}

// Meniru CSS `object-fit: cover`: texture di-crop (bukan di-stretch) supaya
// gambar tetap proporsional walau aspect ratio-nya beda dari aspect ratio
// panel. Sebelumnya texture ditempel dengan repeat/offset default (1,1 /
// 0,0), jadi gambar yang rasio aslinya beda dari panel jadi gepeng atau
// "kepanjangan" — terutama kelihatan di sampul video.
function applyCoverUV(tex: THREE.Texture, meshAspect: number) {
  const img = tex.image as { width?: number; height?: number } | undefined;
  if (!img?.width || !img?.height) return;

  const imgAspect = img.width / img.height;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;

  if (imgAspect > meshAspect) {
    // Gambar relatif lebih "lebar" dari panel → crop kiri-kanan.
    const scale = meshAspect / imgAspect;
    tex.repeat.set(scale, 1);
    tex.offset.set((1 - scale) / 2, 0);
  } else {
    // Gambar relatif lebih "tinggi" dari panel → crop atas-bawah.
    const scale = imgAspect / meshAspect;
    tex.repeat.set(1, scale);
    tex.offset.set(0, (1 - scale) / 2);
  }
  tex.needsUpdate = true;
}

// Meniru CSS `object-fit: contain`: gambar poster ditampilkan utuh (TIDAK
// di-crop) walau aspect ratio-nya beda dari panel. Bedanya sama repeat/
// offset biasa: repeat/offset saja tidak bisa bikin area sisa jadi kosong/
// letterbox — areanya malah ke-smear (efek "clamp edge" yang ditarik).
// Jadi di sini gambar digambar ulang ke <canvas> seukuran aspect ratio
// panel, di-scale supaya pas masuk semua (contain), sisanya diisi warna
// latar polos — baru <canvas> itu yang dipakai jadi texture.
function applyContainCanvas(
  tex: THREE.Texture,
  meshAspect: number,
  bgColor = "#000000"
): THREE.Texture {
  const img = tex.image as HTMLImageElement | ImageBitmap | undefined;
  const imgW = (img as any)?.width;
  const imgH = (img as any)?.height;
  if (!img || !imgW || !imgH) return tex;

  // Resolusi canvas: pakai sisi terbesar dari gambar asli sebagai basis
  // supaya nggak downscale gambar yang sudah bagus, lalu sisi lainnya
  // disesuaikan ke aspect ratio panel.
  const baseSize = Math.max(imgW, imgH, 1024);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(meshAspect >= 1 ? baseSize : baseSize * meshAspect);
  canvas.height = Math.round(meshAspect >= 1 ? baseSize / meshAspect : baseSize);

  const ctx = canvas.getContext("2d");
  if (!ctx) return tex;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const scale = Math.min(canvas.width / imgW, canvas.height / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  ctx.drawImage(
    img as CanvasImageSource,
    (canvas.width - drawW) / 2,
    (canvas.height - drawH) / 2,
    drawW,
    drawH
  );

  const canvasTex = new THREE.CanvasTexture(canvas);
  canvasTex.flipY = tex.flipY;
  canvasTex.colorSpace = tex.colorSpace;
  canvasTex.needsUpdate = true;
  return canvasTex;
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
  // Canvas texture hasil applyContainCanvas dibuat baru terus (bukan dari
  // textureCache yang shared), jadi harus di-dispose manual sendiri —
  // beda dari texture asli poster/sampul yang memang sengaja tidak
  // di-dispose karena dipakai bareng-bareng.
  const posterCanvasTex = useRef<THREE.Texture | null>(null);

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
      posterCanvasTex.current?.dispose();

      // Pakai "contain" (bukan "cover") khusus poster: gambar ditampilkan
      // utuh, tanpa ada bagian yang kepotong, walau aspect ratio-nya beda
      // dari panel. Sisa area yang nggak kepakai diisi warna latar polos.
      const meshAspect = computePlaneAspect(posterMesh.current);
      const t = applyContainCanvas(tex, meshAspect);
      posterCanvasTex.current = t;
      posterMesh.current.material = new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
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
      // Clone — sama alasannya kayak poster di atas.
      const t = tex.clone();
      applyCoverUV(t, computePlaneAspect(sampulMesh.current));
      sampulMesh.current.material = new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
    }, true);

    return () => {
      cancelled = true;
    };
  }, [sampul, scene]);

  // Canvas texture poster itu unik per-mount (bukan dari textureCache
  // shared), jadi kalau nggak di-dispose pas komponen bener-bener unmount,
  // bakal nyisa di GPU memory.
  useEffect(() => {
    return () => {
      posterCanvasTex.current?.dispose();
    };
  }, []);

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

    e.stopPropagation();
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