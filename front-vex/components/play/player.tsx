
"use client";

import {
  OrbitControls,
  PointerLockControls,
} from "@react-three/drei";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  useEffect,
  useRef,
  useState,
  useMemo,
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
}: Props) {
  const {
    camera,
    scene: world,
  } = useThree();

  const orbitRef =
    useRef<any>(null);

  const pointerRef =
    useRef<any>(null);

  const playerMesh =
    useRef<THREE.Mesh>(
      null!
    );

  const raycaster =
    useRef(
      new THREE.Raycaster()
    );

  /* ===================== */
  /* PLAYER */
  /* ===================== */

  const position =
    useRef(
      new THREE.Vector3(
        0,
        20,
        -8
      )
    );

  const velocityY =
    useRef(0);

  const grounded =
    useRef(false);

  /* ===================== */
  /* SETTINGS */
  /* ===================== */

  const MOVE_SPEED = 6;

  const GRAVITY = 24;

  const JUMP_FORCE = 10;

  const PLAYER_HEIGHT = 3;

  const COLLISION_DISTANCE =
    0.7;

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
  /* COLLIDERS */
  /* ===================== */

  const colliders =
    useRef<
      THREE.Object3D[]
    >([]);

  /* ===================== */
  /* MOBILE */
  /* ===================== */

  const [
    isMobile,
    setIsMobile,
  ] = useState(false);

  /* ===================== */
  /* LOOK */
  /* ===================== */

  const yaw =
    useRef(0);

  const pitch =
    useRef(0);

  /* ===================== */
  /* MULTIPLAYER SAVE */
  /* ===================== */

  const saveTimer =
    useRef(0);

  const rotationY =
    useRef(0);

  /* ===================== */
  /* MOBILE DETECT */
  /* ===================== */

  useEffect(() => {
    setIsMobile(
      /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      )
    );
  }, []);

  /* ===================== */
  /* COLLIDER SCAN */
  /* ===================== */

  useEffect(() => {
    const scan = () => {
      const arr: THREE.Object3D[] =
        [];

      world.traverse(
        (obj: any) => {
          if (
            obj.userData
              ?.collider &&
            obj.isMesh
          ) {
            arr.push(obj);

            obj.visible =
              false;
          }
        }
      );

      colliders.current =
        arr;

      console.log(
        "colliders:",
        arr.length
      );
    };

    const t1 =
      setTimeout(
        scan,
        300
      );

    const t2 =
      setTimeout(
        scan,
        1000
      );

    const t3 =
      setTimeout(
        scan,
        2000
      );

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
    const down = (
      e: KeyboardEvent
    ) => {
      if (
        !controlsLocked
      )
        return;

      if (
        e.code === "KeyW"
      )
        keys.current.w =
          true;

      if (
        e.code === "KeyA"
      )
        keys.current.a =
          true;

      if (
        e.code === "KeyS"
      )
        keys.current.s =
          true;

      if (
        e.code === "KeyD"
      )
        keys.current.d =
          true;

      if (
        e.code ===
        "Space"
      )
        keys.current.space =
          true;
    };

    const up = (
      e: KeyboardEvent
    ) => {
      if (
        e.code === "KeyW"
      )
        keys.current.w =
          false;

      if (
        e.code === "KeyA"
      )
        keys.current.a =
          false;

      if (
        e.code === "KeyS"
      )
        keys.current.s =
          false;

      if (
        e.code === "KeyD"
      )
        keys.current.d =
          false;

      if (
        e.code ===
        "Space"
      )
        keys.current.space =
          false;
    };

    window.addEventListener(
      "keydown",
      down
    );

    window.addEventListener(
      "keyup",
      up
    );

    return () => {
      window.removeEventListener(
        "keydown",
        down
      );

      window.removeEventListener(
        "keyup",
        up
      );
    };
  }, [controlsLocked]);

  /* ===================== */
  /* REMOVE PLAYER */
  /* ===================== */

  useEffect(() => {
    const removePlayer =
      () => {
        fetch(
          `/api/player?id=${playerId}`,
          {
            method: "DELETE",
          }
        ).catch(() => { });
      };

    window.addEventListener(
      "beforeunload",
      removePlayer
    );

    return () => {
      removePlayer();

      window.removeEventListener(
        "beforeunload",
        removePlayer
      );
    };
  }, [playerId]);

  /* ===================== */
  /* POINTER UNLOCK */
  /* ===================== */

  useEffect(() => {
    if (
      !controlsLocked
    ) {
      pointerRef.current?.unlock?.();

      document.exitPointerLock?.();
    }
  }, [controlsLocked]);

  /* ===================== */
  /* FRAME */
  /* ===================== */

  useFrame((_, delta) => {
    const dt =
      Math.min(
        delta,
        0.1
      );

    /* ===================== */
    /* MOBILE LOOK */
    /* ===================== */

    if (
      isMobile &&
      mode === "first" &&
      lookDelta
    ) {
      yaw.current -=
        lookDelta.current.x;

      pitch.current -=
        lookDelta.current.y;

      pitch.current =
        Math.max(
          -1.2,
          Math.min(
            1.2,
            pitch.current
          )
        );

      const euler =
        new THREE.Euler(
          pitch.current,
          yaw.current,
          0,
          "YXZ"
        );

      camera.quaternion.setFromEuler(
        euler
      );
    }

    /* ===================== */
    /* MOVE DIR */
    /* ===================== */

    const forward =
      new THREE.Vector3();

    camera.getWorldDirection(
      forward
    );

    rotationY.current =
      Math.atan2(
        forward.x,
        forward.z
      );

    forward.y = 0;

    forward.normalize();

    const right =
      new THREE.Vector3()
        .crossVectors(
          forward,
          camera.up
        )
        .normalize();

    const next =
      position.current.clone();

    let moving =
      false;

    const moveAmount =
      MOVE_SPEED * dt;

    const W =
      keys.current.w ||
      mobileMove?.w;

    const A =
      keys.current.a ||
      mobileMove?.a;

    const S =
      keys.current.s ||
      mobileMove?.s;

    const D =
      keys.current.d ||
      mobileMove?.d;

    if (
      controlsLocked
    ) {
      if (W) {
        next.add(
          forward
            .clone()
            .multiplyScalar(
              moveAmount
            )
        );

        moving =
          true;
      }

      if (S) {
        next.add(
          forward
            .clone()
            .multiplyScalar(
              -moveAmount
            )
        );

        moving =
          true;
      }

      if (A) {
        next.add(
          right
            .clone()
            .multiplyScalar(
              -moveAmount
            )
        );

        moving =
          true;
      }

      if (D) {
        next.add(
          right
            .clone()
            .multiplyScalar(
              moveAmount
            )
        );

        moving =
          true;
      }
    }

    setWalking?.(
      moving &&
      grounded.current
    );

    /* ===================== */
    /* WALL COLLISION */
    /* ===================== */

    const moveDir =
      next
        .clone()
        .sub(
          position.current
        );

    if (
      moveDir.length() >
      0
    ) {
      moveDir.normalize();

      const origin =
        position.current.clone();

      origin.y -= 1;

      raycaster.current.set(
        origin,
        moveDir
      );

      raycaster.current.far =
        COLLISION_DISTANCE;

      const hits =
        raycaster.current.intersectObjects(
          colliders.current,
          true
        );

      if (
        hits.length ===
        0
      ) {
        position.current.copy(
          next
        );
      }
    }

    /* ===================== */
    /* FLOOR CHECK */
    /* ===================== */

    grounded.current =
      false;

    const floorOrigin =
      position.current.clone();

    floorOrigin.y +=
      0.2;

    raycaster.current.set(
      floorOrigin,
      new THREE.Vector3(
        0,
        -1,
        0
      )
    );

    raycaster.current.far =
      50;

    const floorHits =
      raycaster.current
        .intersectObjects(
          world.children,
          true
        )
        .filter(
          (
            hit: any
          ) =>
            hit.object
              .isMesh &&
            !hit.object
              .userData
              ?.collider
        )
        .sort(
          (a, b) =>
            a.distance -
            b.distance
        );

    if (
      floorHits.length >
      0
    ) {
      const floorY =
        floorHits[0]
          .point.y;

      const targetY =
        floorY +
        PLAYER_HEIGHT;

      if (
        velocityY.current <=
        0 &&
        position.current.y <=
        targetY +
        0.2
      ) {
        grounded.current =
          true;

        velocityY.current =
          0;

        setJumping?.(false);

        position.current.y =
          targetY;
      }
    }

    /* ===================== */
    /* JUMP */
    /* ===================== */

    if (
      grounded.current &&
      keys.current.space
    ) {
      velocityY.current =
        JUMP_FORCE;

      grounded.current =
        false;

      setJumping?.(true);
    }

    /* ===================== */
    /* GRAVITY */
    /* ===================== */

    if (
      !grounded.current
    ) {
      velocityY.current -=
        GRAVITY * dt;

      position.current.y +=
        velocityY.current *
        dt;
    }

    /* ===================== */
    /* CAMERA */
    /* ===================== */

    if (
      mode === "first"
    ) {
      camera.position.copy(
        position.current
      );
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

    if (
      saveTimer.current >= 0.2 &&
      playerName !== "Loading..."
    ) {
      saveTimer.current = 0;

      fetch("/api/player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: playerId,

          name: playerName,

          x: position.current.x,
          y: position.current.y,
          z: position.current.z,

          rotation: rotationY.current,
        }),
      }).catch(() => { });
    }

    if (
      playerMesh.current &&
      mode ===
      "third"
    ) {
      playerMesh.current.position.copy(
        position.current
      );

      playerMesh.current.position.y -=
        1.5;
    }

    if (
      mode ===
      "third" &&
      orbitRef.current
    ) {
      orbitRef.current.target.copy(
        position.current
      );

      orbitRef.current.update();
    }
  });

  return (
    <>
      {!isMobile &&
        mode ===
        "first" &&
        controlsLocked && (
          <PointerLockControls
            ref={
              pointerRef
            }
          />
        )}

      {mode ===
        "third" && (
          <>
            <OrbitControls
              ref={
                orbitRef
              }
              enablePan={
                false
              }
              enableRotate={
                controlsLocked
              }
              enableZoom={
                controlsLocked
              }
              minDistance={
                4
              }
              maxDistance={
                8
              }
            />

            <mesh
              ref={
                playerMesh
              }
            >
              <capsuleGeometry
                args={[
                  0.5,
                  1.2,
                  4,
                  8,
                ]}
              />

              <meshStandardMaterial
                color="lime"
                transparent
                opacity={
                  0.35
                }
              />
            </mesh>
          </>
        )}
    </>
  );
}
