"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type BoothProps = {
  position?: [number, number, number];

  quaternion?: [number, number, number, number];

  boothName: string;

  poster: string;

  video?: string;

  openPoster: (
    src: string,
    booth: string
  ) => void;
};

export default function Booth({
  position = [0, 0, 0],
  quaternion = [0, 0, 0, 1],
  boothName,
  poster,
  video,
  openPoster,
}: BoothProps) {
  const [canRender, setCanRender] =
    useState(false);

  const randomNumber =
    useMemo(() => {
      return (
        Math.floor(
          Math.random() * 3
        ) + 1
      );
    }, []);

  const gltf = useGLTF(
    `/models/stand${randomNumber}.glb`
  );

  const scene = useMemo(
    () => gltf.scene.clone(),
    [gltf]
  );

  const posterMesh =
    useRef<THREE.Mesh | null>(
      null
    );

  const videoMesh =
    useRef<THREE.Mesh | null>(
      null
    );

  const videoElement =
    useRef<HTMLVideoElement | null>(
      null
    );

  /* ===================== */
  /* CHECK FILE EXISTS */
  /* ===================== */

  const fileExists = async (
    path: string
  ) => {
    try {
      const res = await fetch(
        path,
        {
          method: "HEAD",
        }
      );

      return res.ok;
    } catch {
      return false;
    }
  };

  /* ===================== */
  /* CHECK BOOTH DATA */
  /* ===================== */

  useEffect(() => {
    const check =
      async () => {
        const posterOk =
          await fileExists(
            poster
          );

        if (!posterOk) {
          setCanRender(
            false
          );
          return;
        }

        setCanRender(true);
      };

    check();
  }, [poster]);

  /* ===================== */
  /* SAFE LOAD TEXTURE */
  /* ===================== */

  const loadTextureSafe = async (
    path: string,
    onLoad: (
      texture: THREE.Texture
    ) => void
  ) => {
    const exists =
      await fileExists(path);

    if (!exists) return;

    const loader =
      new THREE.TextureLoader();

    loader.load(
      path,
      (texture) => {
        texture.flipY = false;
        texture.colorSpace =
          THREE.SRGBColorSpace;

        onLoad(texture);
      }
    );
  };

  /* ===================== */
  /* SETUP */
  /* ===================== */

  useEffect(() => {
    if (!canRender) return;

    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;

      const name =
        obj.name?.toLowerCase() ||
        "";

      if (
        name.includes(
          "collider"
        )
      ) {
        obj.visible = false;
        obj.userData.collider =
          true;
      }
    });

    posterMesh.current =
      scene.getObjectByName(
        "PanelPoster"
      ) as THREE.Mesh;

    videoMesh.current =
      scene.getObjectByName(
        "PanelVideo"
      ) as THREE.Mesh;
  }, [
    scene,
    canRender,
  ]);

  /* ===================== */
  /* POSTER */
  /* ===================== */

  useEffect(() => {
    if (
      !canRender ||
      !posterMesh.current
    )
      return;

    loadTextureSafe(
      poster,
      (texture) => {
        if (!posterMesh.current)
          return;

        posterMesh.current.material =
          new THREE.MeshBasicMaterial(
            {
              map: texture,
              toneMapped:
                false,
            }
          );
      }
    );
  }, [
    canRender,
    poster,
  ]);

  /* ===================== */
  /* VIDEO */
  /* ===================== */

  useEffect(() => {
    const setup =
      async () => {
        if (
          !canRender ||
          !video ||
          !videoMesh.current
        )
          return;

        const exists =
          await fileExists(
            video
          );

        if (!exists) return;

        const htmlVideo =
          document.createElement(
            "video"
          );

        htmlVideo.src =
          video;
        htmlVideo.loop =
          true;
        htmlVideo.muted =
          false;
        htmlVideo.playsInline =
          true;

        videoElement.current =
          htmlVideo;

        const texture =
          new THREE.VideoTexture(
            htmlVideo
          );

        texture.colorSpace =
          THREE.SRGBColorSpace;

        videoMesh.current!.material =
          new THREE.MeshBasicMaterial(
            {
              map: texture,
              toneMapped:
                false,
            }
          );
      };

    setup();

    return () => {
      videoElement.current?.pause();
      videoElement.current?.remove();
      videoElement.current =
        null;
    };
  }, [
    canRender,
    video,
  ]);

  /* ===================== */
  /* CLICK */
  /* ===================== */

  const handleClick = (
    e: any
  ) => {
    const clicked =
      e?.object?.name;

    if (
      clicked ===
        "PanelPoster" &&
      poster
    ) {
      openPoster(
        poster,
        boothName
      );
    }

    if (
      clicked ===
        "PanelVideo" &&
      videoElement.current
    ) {
      const vid =
        videoElement.current;

      if (vid.paused) {
        vid.play().catch(
          () => {}
        );
      } else {
        vid.pause();
      }
    }
  };

  /* ===================== */
  /* NO POSTER = NO BOOTH */
  /* ===================== */

  if (!canRender) return null;

  return (
    <group
      position={position}
      quaternion={
        new THREE.Quaternion(
          ...quaternion
        )
      }
    >
      <primitive
        object={scene}
        position={[
          0, 0, -1.2,
        ]}
        onClick={
          handleClick
        }
      />
    </group>
  );
}