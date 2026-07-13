// Loading manager bersama untuk semua texture manual (poster, sampul, panel
// display) di booth.tsx dan experience.tsx.
//
// Kenapa ini perlu: THREE.TextureLoader yang dibuat tanpa argumen otomatis
// memakai THREE.DefaultLoadingManager — TAPI drei's useGLTF/useLoader juga
// memakai THREE.DefaultLoadingManager secara default, jadi sebenarnya kalau
// kita tidak buat instance manager sendiri pun, texture loader di sini akan
// otomatis terhitung oleh useProgress() dari drei, SELAMA kita tidak memakai
// `new THREE.TextureLoader()` lalu memodifikasinya jadi loader yang "lepas"
// dari manager itu.
//
// File ini sengaja meng-export manager-nya secara eksplisit (bukan cuma
// andalkan default global) agar:
// 1. Jelas dan auditable — satu sumber kebenaran untuk loading state.
// 2. Aman dari kemungkinan drei/Three.js mengubah default di versi depan.
// 3. textureLoader di booth.tsx & experience.tsx dijamin pakai manager yang
//    sama dengan yang dibaca useProgress() di ExhibitionPage.

import * as THREE from "three";

export const sharedLoadingManager = THREE.DefaultLoadingManager;

export const sharedTextureLoader = new THREE.TextureLoader(sharedLoadingManager);