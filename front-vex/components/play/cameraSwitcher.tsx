"use client";

import { useEffect } from "react";

type Props = {
    disabled: boolean;
    setMode: React.Dispatch<
        React.SetStateAction<
            "first" | "third"
        >
    >;
};

export default function CameraSwitcher({
    disabled,
    setMode,
}: Props) {
    useEffect(() => {
        const handleKey = (
            e: KeyboardEvent
        ) => {
            if (e.code === "KeyC") {
                e.preventDefault();

                // Sebelumnya `disabled` tidak pernah dibaca di sini, jadi
                // switch kamera tetap bisa ke-trigger walau seharusnya
                // dikunci (mis. sedang lihat poster/video, atau menu ESC
                // sedang terbuka). Sekarang benar-benar diperiksa.
                if (disabled) return;

                setMode((prev) =>
                    prev === "first"
                        ? "third"
                        : "first"
                );
            }
        };

        window.addEventListener(
            "keyup",
            handleKey
        );

        return () =>
            window.removeEventListener(
                "keyup",
                handleKey
            );
    }, [disabled, setMode]);

    return null;
}