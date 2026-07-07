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
    setMode,
}: Props) {
    useEffect(() => {
        const handleKey = (
            e: KeyboardEvent
        ) => {
            if (e.code === "KeyC") {
                e.preventDefault();

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
    }, [setMode]);

    return null;
}