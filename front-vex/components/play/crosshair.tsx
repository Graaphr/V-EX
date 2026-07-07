"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export default function Crosshair({ canvasRef }: Props) {
  const [isDark, setIsDark] = useState(true);

  const rafRef = useRef<number | undefined>(undefined);
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!sampleCanvasRef.current) {
      const c = document.createElement("canvas");
      c.width = 1;
      c.height = 1;
      sampleCanvasRef.current = c;
    }

    const ctx = sampleCanvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });

    const sample = () => {
      const source = canvasRef.current;

      if (source && ctx && source.width > 0 && source.height > 0) {
        try {
          const cx = source.width / 2;
          const cy = source.height / 2;

          ctx.drawImage(source, cx - 1, cy - 1, 2, 2, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

          setIsDark((prev) => {
            const next = luminance < 140; // threshold, sesuaikan kalau perlu
            return prev === next ? prev : next;
          });
        } catch {
        }
      }

      rafRef.current = requestAnimationFrame(sample);
    };

    rafRef.current = requestAnimationFrame(sample);

    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [canvasRef]);

  const color = isDark ? "#ffffff" : "#000000";

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-50">
      <div className="relative w-6 h-6">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2.5px] rounded-full transition-colors duration-75"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2.5px] rounded-full transition-colors duration-75"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}