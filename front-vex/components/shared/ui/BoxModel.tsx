"use client";
import modelBox from "@/public/model/vector-box.svg";
import modelBlueBox from "@/public/model/vector-box-blue.svg";
import Image from "next/image";

interface data {
    className?: string
}
export function VectorBox({ className, ...props }: data) {
    return (
        <Image className={className} src={modelBox} height={200} width={200} alt="box" />
    );
}
export function VectorBlueBox({ className, ...props }: data) {
    return (
        <Image className={className} src={modelBlueBox} height={200} width={200} alt="box" />
    );
}