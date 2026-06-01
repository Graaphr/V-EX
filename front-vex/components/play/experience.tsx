'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

import Booth from './booth';
import Player from './player';
import CameraSwitcher from './cameraSwitcher';

/* ✅ IMPORT JSON BIASA */
import exhibitions from '@/public/data/Pameran.json';

type Props = {
  exhibitionId: string;

  openPoster: (src: string, booth: string) => void;

  controlsLocked: boolean;
  soundOn: boolean;
  mobile: boolean;
  mobileMove?: {
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
  };

  lookDelta?: React.MutableRefObject<{
    x: number;
    y: number;
  }>;
};

export default function Experience({
  exhibitionId,
  openPoster,
  controlsLocked,
  soundOn,
  mobileMove,
  lookDelta,
}: Props) {
  const [mode, setMode] = useState<'first' | 'third'>('first');

  const [walking, setWalking] = useState(false);

  const isViewingMedia = !controlsLocked;

  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const footRef = useRef<HTMLAudioElement | null>(null);

  const loader = useRef(new THREE.TextureLoader());

  const { scene } = useGLTF('/models/Default.glb');

  /* ===================== */
  /* DATA PAMERAN */
  /* ===================== */

  const currentExpo = exhibitions.find((item: any) => item.id === exhibitionId);

  const category = currentExpo?.category || 'default';

  const folder = category.toLowerCase().replaceAll(' ', '-');

  /* ===================== */
  /* AUDIO */
  /* ===================== */

  useEffect(() => {
    bgmRef.current = new Audio('/music/bgm.mp3');

    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.35;

    footRef.current = new Audio('/music/footstep.mp3');

    footRef.current.loop = true;
    footRef.current.volume = 0.55;

    return () => {
      bgmRef.current?.pause();
      footRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!bgmRef.current) return;

    if (soundOn) {
      bgmRef.current.volume = isViewingMedia ? 0.08 : 0.35;

      bgmRef.current.play().catch(() => {});
    } else {
      bgmRef.current.pause();
      footRef.current?.pause();
    }
  }, [soundOn, isViewingMedia]);

  useEffect(() => {
    if (!footRef.current) return;

    if (soundOn && walking && controlsLocked) {
      footRef.current.play().catch(() => {});
    } else {
      footRef.current.pause();
      footRef.current.currentTime = 0;
    }
  }, [soundOn, walking, controlsLocked]);

  /* ===================== */
  /* SAFE TEXTURE */
  /* ===================== */

  const loadTextureSafe = (path: string, onLoad: (tex: THREE.Texture) => void) => {
    loader.current.load(
      path,
      (tex) => {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;

        onLoad(tex);
      },
      undefined,
      () => {},
    );
  };

  /* ===================== */
  /* DISPLAY TEXTURE */
  /* ===================== */

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;

      const name = obj.name?.toLowerCase() || '';

      if (name.startsWith('paneldisplay')) {
        const code = name.replace('paneldisplay', '');

        const num = parseInt(code[1]);

        if (isNaN(num)) return;

        loadTextureSafe(`/prodi/${folder}/${num}.png`, (tex) => {
          obj.material = new THREE.MeshBasicMaterial({
            map: tex,
            toneMapped: false,
          });
        });
      }

      if (name === 'panel') {
        loadTextureSafe(`/prodi/${folder}/${folder}.png`, (tex) => {
          obj.material = new THREE.MeshBasicMaterial({
            map: tex,
            toneMapped: false,
          });
        });
      }
    });
  }, [scene, folder]);

  /* ===================== */
  /* POSTER */
  /* ===================== */

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;

      const lower = obj.name?.toLowerCase() || '';

      if (!lower.startsWith('panelposter')) return;

      const code = lower.replace('panelposter', '');

      const zone = code[0];

      const num = parseInt(code.slice(1));

      if (!zone || isNaN(num)) return;

      const posterNum = ((num - 1) % 6) + 1;

      loadTextureSafe(`/uploads/${exhibitionId}/booth${zone}${posterNum}-poster.png`, (tex) => {
        obj.material = new THREE.MeshBasicMaterial({
          map: tex,
          toneMapped: false,
        });
      });
    });
  }, [scene, exhibitionId]);

  /* ===================== */
  /* BOOTH POINT */
  /* ===================== */

  const boothPoints = useMemo(() => {
    const result: any[] = [];

    scene.updateMatrixWorld(true);

    scene.traverse((obj: any) => {
      const lower = obj.name?.toLowerCase() || '';

      if (lower.startsWith('booth')) {
        const pos = new THREE.Vector3();

        const quat = new THREE.Quaternion();

        obj.getWorldPosition(pos);

        obj.getWorldQuaternion(quat);

        result.push({
          name: obj.name,
          position: [pos.x, pos.y, pos.z],
          quaternion: [quat.x, quat.y, quat.z, quat.w],
        });

        obj.visible = false;
        obj.raycast = () => null;
      }

      if (lower.includes('collider')) {
        obj.visible = false;

        obj.traverse((child: any) => {
          child.visible = false;

          if (child.isMesh) {
            child.userData.collider = true;
          }
        });
      }

      if (obj.isMesh && !obj.userData?.collider) {
        obj.castShadow = true;

        obj.receiveShadow = true;
      }
    });

    return result;
  }, [scene]);

  return (
    <>
      <ambientLight intensity={2.2} />

      <directionalLight position={[10, 15, 10]} intensity={3} castShadow />

      <pointLight position={[0, 8, 0]} intensity={2} />

      <primitive object={scene} />

      {boothPoints.map((item, i) => (
        <Booth
          key={i}
          boothName={item.name}
          position={item.position}
          quaternion={item.quaternion}
          poster={`/uploads/${exhibitionId}/${item.name}-poster.png`}
          video={`/uploads/${exhibitionId}/${item.name}-video.mp4`}
          openPoster={openPoster}
        />
      ))}

      <Player
        mode={mode}
        controlsLocked={controlsLocked}
        setWalking={setWalking}
        mobileMove={mobileMove}
        lookDelta={lookDelta}
      />

      <CameraSwitcher setMode={setMode} disabled={!controlsLocked} />
    </>
  );
}
