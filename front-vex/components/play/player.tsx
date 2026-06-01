'use client';

import { PointerLockControls, OrbitControls } from '@react-three/drei';

import { useFrame, useThree } from '@react-three/fiber';

import { useEffect, useRef, useState } from 'react';

import * as THREE from 'three';

type Props = {
  mode: 'first' | 'third';
  controlsLocked: boolean;

  setWalking?: (value: boolean) => void;

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

export default function Player({ mode, controlsLocked, setWalking, mobileMove, lookDelta }: Props) {
  const { camera, scene: world } = useThree();

  const orbitRef = useRef<any>(null);

  const pointerRef = useRef<any>(null);

  const playerMesh = useRef<THREE.Mesh>(null!);

  const raycaster = useRef(new THREE.Raycaster());

  const position = useRef(new THREE.Vector3(0, 20, -8));

  const velocityY = useRef(0);

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const colliders = useRef<THREE.Object3D[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  /* LOOK ROTATION */
  const yaw = useRef(0);

  const pitch = useRef(0);

  /* ===================== */
  /* MOBILE DETECT */
  /* ===================== */

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  /* ===================== */
  /* COLLIDER */
  /* ===================== */

  useEffect(() => {
    const scan = () => {
      const arr: THREE.Object3D[] = [];

      world.traverse((obj: any) => {
        if (obj.userData?.collider && obj.isMesh) {
          arr.push(obj);
          obj.visible = false;
        }
      });

      colliders.current = arr;
      console.log('colliders:', arr.length);
    };

    const t1 = setTimeout(scan, 300);
    const t2 = setTimeout(scan, 1000);
    const t3 = setTimeout(scan, 2000);
    const t4 = setTimeout(scan, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [world]);

  /* ===================== */
  /* KEYBOARD */
  /* ===================== */

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!controlsLocked) return;

      if (e.code === 'KeyW') keys.current.w = true;

      if (e.code === 'KeyA') keys.current.a = true;

      if (e.code === 'KeyS') keys.current.s = true;

      if (e.code === 'KeyD') keys.current.d = true;
    };

    const up = (e: KeyboardEvent) => {
      if (e.code === 'KeyW') keys.current.w = false;

      if (e.code === 'KeyA') keys.current.a = false;

      if (e.code === 'KeyS') keys.current.s = false;

      if (e.code === 'KeyD') keys.current.d = false;
    };

    window.addEventListener('keydown', down);

    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);

      window.removeEventListener('keyup', up);
    };
  }, [controlsLocked]);

  /* ===================== */
  /* FORCE UNLOCK */
  /* ===================== */

  useEffect(() => {
    if (!controlsLocked) {
      pointerRef.current?.unlock?.();
      document.exitPointerLock?.();
    }
  }, [controlsLocked]);

  /* ===================== */
  /* FRAME */
  /* ===================== */

  useFrame(() => {
    const speed = 0.15;

    const playerHeight = 3;

    /* ===================== */
    /* MOBILE LOOK FIX */
    /* ===================== */

    if (isMobile && mode === 'first' && lookDelta) {
      yaw.current -= lookDelta.current.x * 1;
      pitch.current -= lookDelta.current.y * 1;

      pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));

      const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ');

      camera.quaternion.setFromEuler(euler);
    }

    const dir = new THREE.Vector3();

    camera.getWorldDirection(dir);

    dir.y = 0;
    dir.normalize();

    const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();

    const next = position.current.clone();

    let moving = false;

    const W = keys.current.w || mobileMove?.w;

    const A = keys.current.a || mobileMove?.a;

    const S = keys.current.s || mobileMove?.s;

    const D = keys.current.d || mobileMove?.d;

    if (controlsLocked) {
      if (W) {
        next.add(dir.clone().multiplyScalar(speed));
        moving = true;
      }

      if (S) {
        next.add(dir.clone().multiplyScalar(-speed));
        moving = true;
      }

      if (A) {
        next.add(right.clone().multiplyScalar(-speed));
        moving = true;
      }

      if (D) {
        next.add(right.clone().multiplyScalar(speed));
        moving = true;
      }
    }

    setWalking?.(moving);

    /* ===================== */
    /* COLLISION */
    /* ===================== */

    const moveDir = next.clone().sub(position.current);

    if (moveDir.length() > 0) {
      moveDir.normalize();

      const origin = position.current.clone();

      origin.y -= 1;

      raycaster.current.set(origin, moveDir);

      raycaster.current.far = 0.7;

      const hits = raycaster.current.intersectObjects(colliders.current, true);

      if (hits.length === 0) {
        position.current.copy(next);
      }
    }

    /* ===================== */
    /* FLOOR */
    /* ===================== */

    let grounded = false;

    const floorOrigin = position.current.clone();

    floorOrigin.y += 0.3;

    raycaster.current.set(floorOrigin, new THREE.Vector3(0, -1, 0));

    raycaster.current.far = 20;

    const floorHits = raycaster.current
      .intersectObjects(world.children, true)
      .filter((hit: any) => hit.object.isMesh && !hit.object.userData?.collider)
      .sort((a, b) => a.distance - b.distance);

    if (floorHits.length > 0) {
      position.current.y = floorHits[0].point.y + playerHeight;

      grounded = true;

      velocityY.current = 0;
    }

    if (!grounded) {
      velocityY.current -= 0.008;

      position.current.y += velocityY.current;
    }

    /* ===================== */
    /* CAMERA */
    /* ===================== */

    if (mode === 'first') {
      camera.position.copy(position.current);
    }

    if (playerMesh.current && mode === 'third') {
      playerMesh.current.position.copy(position.current);

      playerMesh.current.position.y -= 1.5;
    }

    if (mode === 'third' && orbitRef.current) {
      orbitRef.current.target.copy(position.current);

      orbitRef.current.update();
    }
  });

  return (
    <>
      {!isMobile && mode === 'first' && controlsLocked && <PointerLockControls ref={pointerRef} />}

      {mode === 'third' && (
        <>
          <OrbitControls
            ref={orbitRef}
            enablePan={false}
            enableRotate={controlsLocked}
            enableZoom={controlsLocked}
            minDistance={4}
            maxDistance={8}
          />

          <mesh ref={playerMesh}>
            <capsuleGeometry args={[0.5, 1.2, 4, 8]} />

            <meshStandardMaterial color="lime" transparent opacity={0.35} />
          </mesh>
        </>
      )}
    </>
  );
}
