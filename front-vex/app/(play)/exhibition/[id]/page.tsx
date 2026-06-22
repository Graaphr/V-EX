"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { Canvas } from "@react-three/fiber";
import { v4 as uuidv4 } from 'uuid';

import Experience from "@/components/play/experience";
import Crosshair from "@/components/play/crosshair";
import Image from "next/image";
import { showToast } from "@/components/shared/ui/ToastNotification"; //


type PosterData = {
  src: string;
  booth: string;
};

type InfoData = {
  id_karya: number | null;
  judul: string;
  deskripsi: string;
  likes: number;
  liked: boolean;
  is_terbaik: boolean;      // ← tambah
  is_terbanyak: boolean;    // ← tambah
  tautan: string | null;
  komentar: { nama: string; isi: string; }[];
};

/* ======================= */
/* AUTH HEADERS HELPER     */
/* ======================= */

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function ExhibitionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Intro: "controls" → "welcome" → null (ditutup)
  const [introStep, setIntroStep] = useState<"controls" | "welcome" | null>("controls");

  const [posterData, setPosterData] = useState<PosterData>({ src: "", booth: "" });
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");

  // Floor switcher
  const [currentFloor, setCurrentFloor] = useState(1);
  const [maxFloor, setMaxFloor] = useState<Record<string, number>>({});
  const [karyaList, setKaryaList] = useState<any[]>([]);
  const [mapOpen, setMapOpen] = useState(false);

  // Load karya + max_floor once
  useEffect(() => {
    fetch(`/api/experience/karya/pameran/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setKaryaList(data.karya ?? data);
        setMaxFloor(data.max_floor ?? {});
      })
      .catch(() => { });
  }, [id]);

  /* ====================== */
  /* PLAYER MULTIPLAYER     */
  /* ====================== */

  const [playerId] = useState(() => {
    if (typeof window === "undefined") {
      return typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2);
    }
    const existing = sessionStorage.getItem("playerId");
    if (existing) return existing;
    const newId = uuidv4();
    sessionStorage.setItem("playerId", newId);
    return newId;
  });

  const generateGuestName = () => {
    const num = Math.floor(Math.random() * 999) + 1;
    return `guest${String(num).padStart(3, "0")}`;
  };

  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const initPlayerName = async () => {
      try {
        const res = await fetch("/api/player-name");
        const data = await res.json();
        setPlayerName(data.name);
      } catch {
        setPlayerName(generateGuestName());
      }
    };
    initPlayerName();
  }, []);

  const [mobileMove, setMobileMove] = useState({ w: false, a: false, s: false, d: false });
  const lookDelta = useRef({ x: 0, y: 0 });

  /* ====================== */
  /* DETECT MOBILE          */
  /* ====================== */

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  /* ====================== */
  /* REMOVE PLAYER          */
  /* ====================== */

  useEffect(() => {
    const removePlayer = () => {
      fetch(`/api/player?id=${playerId}`, { method: "DELETE", keepalive: true });
    };
    window.addEventListener("beforeunload", removePlayer);
    return () => {
      removePlayer();
      window.removeEventListener("beforeunload", removePlayer);
    };
  }, [playerId]);

  useEffect(() => {
    if (posterOpen) document.exitPointerLock?.();
  }, [posterOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !posterOpen) {
        setMenuOpen(true);
        document.exitPointerLock?.();
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [posterOpen]);

  const openPoster = (src: string, booth: string) => {
    document.exitPointerLock?.();
    setPosterData({ src, booth });
    setPosterOpen(true);
  };

  // Dipanggil saat klik PanelVideo di booth → langsung buka embed
  const openTautan = (url: string, _booth: string) => {
    document.exitPointerLock?.();
    setEmbedUrl(url);
    setEmbedOpen(true);
  };

  // Dipanggil dari PosterViewer tombol "Tonton Video"
  const openEmbedFromPoster = (url: string) => {
    setPosterOpen(false);
    setEmbedUrl(url);
    setEmbedOpen(true);
  };

  const controlsLocked = !posterOpen && !menuOpen && !embedOpen && !mapOpen && introStep === null;

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative touch-none select-none">

      {/* PORTRAIT WARNING */}
      {isMobile && isPortrait && (
        <div className="fixed inset-0 z-[999999] bg-black text-white flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Putar HP Anda</h1>
          <p className="text-white/70 text-lg">Gunakan mode landscape untuk masuk pameran 3D</p>
        </div>
      )}

      {/* GAME */}
      {(!isMobile || !isPortrait) && (
        <>
          {playerName && (
            <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
              <Experience
                exhibitionId={id}
                openTautan={openTautan}
                openPoster={openPoster}
                controlsLocked={controlsLocked}
                soundOn={soundOn}
                mobile={isMobile}
                mobileMove={mobileMove}
                lookDelta={lookDelta}
                playerId={playerId}
                playerName={playerName}
                currentFloor={currentFloor}
              />
            </Canvas>
          )}

          {!isMobile && controlsLocked && <Crosshair />}

          {isMobile && controlsLocked && (
            <MobileHUD setMobileMove={setMobileMove} lookDelta={lookDelta} />
          )}

          {/* FLOOR SWITCHER — bottom center */}
          {controlsLocked && Object.values(maxFloor).some(v => v > 1) && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-black/70 backdrop-blur rounded-full px-4 py-2 border border-white/15">
              <button
                onClick={() => setCurrentFloor(f => Math.max(1, f - 1))}
                disabled={currentFloor <= 1}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center disabled:opacity-30 text-white text-sm"
              >
                ▼
              </button>
              <span className="text-white text-sm font-bold px-2">Lantai {currentFloor}</span>
              <button
                onClick={() => setCurrentFloor(f => Math.min(Math.max(...Object.values(maxFloor)), f + 1))}
                disabled={currentFloor >= Math.max(...Object.values(maxFloor), 1)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center disabled:opacity-30 text-white text-sm"
              >
                ▲
              </button>
            </div>
          )}

          {/* MAP BUTTON */}
          {controlsLocked && (
            <button
              onClick={() => { setMapOpen(true); document.exitPointerLock?.(); }}
              className="fixed top-4 right-4 z-[9999] w-10 h-10 rounded-xl bg-black/60 border border-white/15 text-white flex items-center justify-center text-lg"
              title="Lihat semua karya"
            >
              🗺
            </button>
          )}
        </>
      )}

      {/* MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[99998] bg-black/75 flex items-center justify-center">
          <div className="w-[380px] max-w-[90%] rounded-2xl bg-zinc-900 p-6 text-white space-y-4">
            <h1 className="text-2xl font-bold">Menu</h1>
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="w-full h-12 rounded-xl bg-white/10"
            >
              Sound : {soundOn ? " ON" : " OFF"}
            </button>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full h-12 rounded-xl bg-green-500 font-bold"
            >
              Lanjut
            </button>
            <button
              onClick={async () => {
                await fetch(`/api/player?id=${playerId}`, { method: "DELETE" });
                sessionStorage.removeItem("playerId");
                sessionStorage.removeItem("playerName");
                router.push(`/pameran/${id}`);
              }}
              className="w-full h-12 rounded-xl bg-red-500 font-bold"
            >
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* POSTER + DETAIL */}
      {posterOpen && (
        <PosterViewer
          id={id}
          src={posterData.src}
          booth={posterData.booth}
          onClose={() => setPosterOpen(false)}
          onOpenTautan={openEmbedFromPoster}
        />
      )}

      {/* EMBED VIDEO */}
      {embedOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/90 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-video px-4">
            <button
              onClick={() => setEmbedOpen(false)}
              className="absolute -top-10 right-4 text-white text-2xl font-bold"
            >
              ✕
            </button>
            <iframe
              src={toEmbedUrl(embedUrl)}
              className="w-full h-full rounded-xl"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
      )}

      {/* KARYA MAP PANEL */}
      {mapOpen && (
        <KaryaMapPanel
          karyaList={karyaList}
          currentFloor={currentFloor}
          maxFloor={maxFloor}
          onFloorChange={setCurrentFloor}
          onSelectPoster={(src, booth) => {
            setMapOpen(false);
            openPoster(src, booth);
          }}
          onClose={() => setMapOpen(false)}
        />
      )}

      {/* INTRO — STEP 1: KONTROL */}
      {introStep === "controls" && (
        <div className="fixed inset-0 z-[999999] bg-black/90 flex items-center justify-center px-4">
          <div className="w-[480px] max-w-full rounded-2xl bg-zinc-900 border border-white/10 p-8 text-white space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold">Panduan Kontrol</h1>
              <p className="text-white/40 text-xs">Pelajari cara menjelajahi pameran</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 text-sm">
              {!isMobile && (
                <>
                  <div className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/[0.07] rounded-xl p-3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 shrink-0">
                        {["W", "A", "S", "D"].map((k) => (
                          <kbd
                            key={k}
                            className="w-7 h-7 rounded-md bg-white/10 border border-white/10 flex items-center justify-center font-bold text-[11px]"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                      <span className="text-white/70">Bergerak</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <kbd className="px-3 h-7 rounded-md bg-white/10 border border-white/10 flex items-center justify-center font-bold text-[11px] shrink-0">
                        SPACE
                      </kbd>
                      <span className="text-white/70">Loncat</span>
                    </div>
                  </div>

                  <div className="flex items-center bg-white/5 hover:bg-white/[0.07] rounded-xl p-3 transition-colors">
                    <span className="text-white/70">Gerakkan mouse untuk melihat sekitar, klik untuk berinteraksi</span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 hover:bg-white/[0.07] rounded-xl p-3 transition-colors">
                    <kbd className="px-3 h-7 rounded-md bg-white/10 border border-white/10 flex items-center justify-center font-bold text-[11px] shrink-0">
                      ESC
                    </kbd>
                    <span className="text-white/70">Buka menu pengaturan</span>
                  </div>
                </>
              )}

              {isMobile && (
                <>
                  <div className="flex items-center bg-white/5 rounded-xl p-3">
                    <span className="text-white/70">Joystick kiri untuk bergerak</span>
                  </div>
                  <div className="flex items-center bg-white/5 rounded-xl p-3">
                    <span className="text-white/70">Joystick kanan untuk melihat sekitar</span>
                  </div>
                  <div className="flex items-center bg-white/5 rounded-xl p-3">
                    <span className="text-white/70">Ketuk objek untuk berinteraksi</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIntroStep(null)}
                className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 font-medium text-sm transition-colors"
              >
                Lewati
              </button>
              <button
                onClick={() => setIntroStep("welcome")}
                className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-colors"
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTRO — STEP 2: SELAMAT BERKUNJUNG */}
      {introStep === "welcome" && (
        <div className="fixed inset-0 z-[999999] bg-black/90 flex items-center justify-center">
          <div className="w-[420px] max-w-[92%] rounded-2xl bg-zinc-900 border border-white/10 p-8 text-white text-center space-y-5">
            <h1 className="text-3xl font-bold">Selamat Berkunjung!</h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Jelajahi pameran virtual ini, kunjungi setiap booth, dan nikmati karya-karya terbaik yang telah dipersembahkan.
            </p>
            <button
              onClick={() => setIntroStep(null)}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-lg transition-colors"
            >
              Mulai Jelajahi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================= */
/* YOUTUBE EMBED HELPER    */
/* ======================= */

function toEmbedUrl(url: string): string {
  if (!url) return "";
  // Sudah embed → langsung pakai
  if (url.includes("youtube.com/embed/")) return url;
  // youtu.be/VIDEO_ID
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  // youtube.com/watch?v=VIDEO_ID
  const watch = url.match(/[?&]v=([^&]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  // Fallback (misal Vimeo atau link lain)
  return url;
}

/* ======================= */
/* MOBILE HUD              */
/* ======================= */

function MobileHUD({ setMobileMove, lookDelta }: any) {
  const moveBase = useRef<any>(null);
  const moveStick = useRef<any>(null);
  const lookBase = useRef<any>(null);
  const lookStick = useRef<any>(null);
  const moveTouchId = useRef<number | null>(null);
  const lookTouchId = useRef<number | null>(null);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const updateMove = (touch: Touch) => {
    const rect = moveBase.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - rect.width / 2;
    const y = touch.clientY - rect.top - rect.height / 2;
    const dx = clamp(x, -35, 35);
    const dy = clamp(y, -35, 35);
    moveStick.current.style.transform = `translate(${dx}px,${dy}px)`;
    setMobileMove({ w: dy < -10, s: dy > 10, a: dx < -10, d: dx > 10 });
  };

  const updateLook = (touch: Touch) => {
    const rect = lookBase.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - rect.width / 2;
    const y = touch.clientY - rect.top - rect.height / 2;
    const dx = clamp(x, -35, 35);
    const dy = clamp(y, -35, 35);
    lookStick.current.style.transform = `translate(${dx}px,${dy}px)`;
    lookDelta.current = { x: dx * 0.0015, y: dy * 0.0015 };
  };

  const moveStart = (e: any) => { moveTouchId.current = e.changedTouches[0].identifier; updateMove(e.changedTouches[0]); };
  const moveMove = (e: any) => { for (const t of e.touches) if (t.identifier === moveTouchId.current) updateMove(t); };
  const moveEnd = (e: any) => { for (const t of e.changedTouches) if (t.identifier === moveTouchId.current) { moveTouchId.current = null; moveStick.current.style.transform = "translate(0px,0px)"; setMobileMove({ w: false, a: false, s: false, d: false }); } };

  const lookStart = (e: any) => { lookTouchId.current = e.changedTouches[0].identifier; updateLook(e.changedTouches[0]); };
  const lookMove = (e: any) => { for (const t of e.touches) if (t.identifier === lookTouchId.current) updateLook(t); };
  const lookEnd = (e: any) => { for (const t of e.changedTouches) if (t.identifier === lookTouchId.current) { lookTouchId.current = null; lookStick.current.style.transform = "translate(0px,0px)"; lookDelta.current = { x: 0, y: 0 }; } };

  return (
    <>
      <div ref={moveBase} onTouchStart={moveStart} onTouchMove={moveMove} onTouchEnd={moveEnd}
        className="fixed bottom-5 left-5 z-[99999] w-28 h-28 rounded-full bg-white/10 border border-white/20">
        <div ref={moveStick} className="absolute left-1/2 top-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full bg-white/60" />
      </div>
      <div ref={lookBase} onTouchStart={lookStart} onTouchMove={lookMove} onTouchEnd={lookEnd}
        className="fixed bottom-5 right-5 z-[99999] w-28 h-28 rounded-full bg-white/10 border border-white/20">
        <div ref={lookStick} className="absolute left-1/2 top-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full bg-white/60" />
      </div>
    </>
  );
}

/* ======================= */
/* KARYA MAP PANEL         */
/* ======================= */

const ZONES = ["a", "b", "c", "d"];
const ZONE_LABELS: Record<string, string> = { a: "Kelas A", b: "Kelas B", c: "Kelas C", d: "Kelas D" };

function KaryaMapPanel({
  karyaList,
  currentFloor,
  maxFloor,
  onFloorChange,
  onSelectPoster,
  onClose,
}: {
  karyaList: any[];
  currentFloor: number;
  maxFloor: Record<string, number>;
  onFloorChange: (f: number) => void;
  onSelectPoster: (src: string, booth: string) => void;
  onClose: () => void;
}) {
  const [activeZone, setActiveZone] = useState(ZONES[0]);

  const globalMax = Math.max(...Object.values(maxFloor), 1);

  const karyaInView = karyaList
    .filter((k) => (k.kelas ?? "") === activeZone)
    .sort((a, b) => a.id_karya - b.id_karya)
    .slice((currentFloor - 1) * 6, currentFloor * 6);

  // Fill empty slots to always show 6
  const slots = Array.from({ length: 6 }, (_, i) => karyaInView[i] ?? null);

  return (
    <div className="fixed inset-0 z-[99998] bg-black/90 flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h1 className="text-white font-bold text-lg">Peta Pameran</h1>
        <button onClick={onClose} className="text-white/70 hover:text-white text-xl font-bold">✕</button>
      </div>

      {/* ZONE TABS */}
      <div className="flex gap-2 px-5 pt-4 shrink-0">
        {ZONES.map((z) => (
          <button
            key={z}
            onClick={() => setActiveZone(z)}
            className={`px-4 h-9 rounded-full text-sm font-bold transition-colors ${activeZone === z
              ? "bg-white text-black"
              : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
          >
            {ZONE_LABELS[z]}
          </button>
        ))}
      </div>

      {/* FLOOR SWITCHER */}
      {globalMax > 1 && (
        <div className="flex items-center gap-3 px-5 pt-3 shrink-0">
          <span className="text-white/50 text-xs">Lantai:</span>
          {Array.from({ length: globalMax }, (_, i) => i + 1).map((f) => (
            <button
              key={f}
              onClick={() => onFloorChange(f)}
              className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${currentFloor === f ? "bg-blue-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* GRID — 6 slots */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {slots.map((karya, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
              {karya ? (
                <>
                  {karya.poster ? (
                    <Image
                      src={karya.poster}
                      alt={karya.judul}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                      No Poster
                    </div>
                  )}
                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-bold leading-tight line-clamp-2">{karya.judul}</p>
                    <p className="text-white/50 text-xs mt-0.5">
                      {ZONE_LABELS[activeZone]} · Slot {i + 1}
                    </p>
                  </div>

                  {/* TERBAIK BADGE */}
                  {karya.is_terbaik && (
                    <div className="absolute top-2 right-2 w-18 h-18">
                      <Image src="/icon/Medalion.svg" alt="Karya Terbaik" fill className="object-contain" />
                    </div>
                  )}

                  {/* TERBANYAK LIKES BADGE */}
                  {karya.is_terbanyak && (
                    <div className="absolute top-2 left-2 w-18 h-18">
                      <Image src="/icon/Favorite.svg" alt="Likes Terbanyak" fill className="object-contain" />
                    </div>
                  )}

                  {/* CLICK OVERLAY */}
                  {karya.poster && (
                    <button
                      onClick={() => onSelectPoster(karya.poster, karya.booth_name)}
                      className="absolute inset-0"
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                  Kosong
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PosterViewer({
  id,
  src,
  booth,
  onClose,
  onOpenTautan,
}: {
  id: string;
  src: string;
  booth: string;
  onClose: () => void;
  onOpenTautan: (url: string) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState<"detail" | "komentar">("detail");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [info, setInfo] = useState<InfoData>({
    id_karya: null,
    judul: "Loading...",
    deskripsi: "Loading...",
    likes: 0,
    liked: false,
    is_terbaik: false,   // ← tambah
    is_terbanyak: false, // ← tambah
    tautan: null,
    komentar: [],
  });

  const isLoggedIn = () => {
    return typeof window !== "undefined" && !!localStorage.getItem("token");
  };

  /* ====================== */
  /* LOAD DATA KARYA        */
  /* ====================== */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/experience/karya/pameran/${id}`);
        const list: any[] = await res.json();

        const karya = list.find(
          (k) =>
            k.booth_name === booth ||
            k.judul === booth ||
            String(k.id_stan).toLowerCase() === booth.toLowerCase()
        );

        if (!karya) throw new Error("Karya tidak ditemukan");

        // Ambil status like user saat ini (butuh auth)
        let liked = false;
        let totalSuka = karya.total_suka ?? 0;
        const sukaRes = await fetch(`/api/karya/${karya.id_karya}/suka`, {
          headers: authHeaders(),
        });
        if (sukaRes.ok) {
          const sukaData = await sukaRes.json();
          liked = sukaData.liked ?? false;
          totalSuka = sukaData.total_suka ?? totalSuka;
        }

        // Ambil komentar terbaru
        const komentarRes = await fetch(`/api/karya/${karya.id_karya}/komentar`, {
          headers: { Accept: "application/json" },
        });
        let komentar: { nama: string; isi: string }[] = [];
        if (komentarRes.ok) {
          const komentarData = await komentarRes.json();
          const rawList = Array.isArray(komentarData)
            ? komentarData
            : (komentarData.komentar ?? []);
          komentar = rawList.map((k: any) => ({
            nama: k.pengguna?.nama ?? k.nama ?? "Anonim",
            isi: k.isi_komentar ?? k.isi ?? "",
          }));
        }

        setInfo({
          id_karya: karya.id_karya,
          judul: karya.judul ?? "-",
          deskripsi: karya.deskripsi ?? "-",
          likes: totalSuka,
          liked,
          is_terbaik: karya.is_terbaik ?? false,       // ← tambah
          is_terbanyak: karya.is_terbanyak ?? false,   // ← tambah (kalau ada di API)
          tautan: karya.tautan ?? null,
          komentar,
        });
      } catch {
        setInfo({
          id_karya: null,
          judul: "Data Tidak Ditemukan",
          deskripsi: "Data karya belum tersedia.",
          likes: 0,
          liked: false,
          is_terbaik: false,    // ← ganti penilaian
          is_terbanyak: false,  // ← tambah
          tautan: null,
          komentar: [],
        });
      }
    };

    load();
  }, [id, booth]);

  /* ====================== */
  /* TOGGLE LIKE (ke API)   */
  /* ====================== */

  const toggleLike = async () => {
    if (!info.id_karya) return;
    if (!isLoggedIn()) {
      showToast("Kamu harus login untuk menyukai karya.", "warning");
      return;
    }
    const wasLiked = info.liked;
    setInfo((prev) => ({
      ...prev,
      liked: !wasLiked,
      likes: wasLiked ? prev.likes - 1 : prev.likes + 1,
    }));
    try {
      const res = await fetch(`/api/karya/${info.id_karya}/suka`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setInfo((prev) => ({
          ...prev,
          liked: data.liked,
          likes: data.total_suka,
        }));
      } else {
        throw new Error("Gagal");
      }
    } catch {
      setInfo((prev) => ({
        ...prev,
        liked: wasLiked,
        likes: wasLiked ? prev.likes + 1 : prev.likes - 1,
      }));
    }
  };

  /* ====================== */
  /* KIRIM KOMENTAR (ke API)*/
  /* ====================== */

  const [commentError, setCommentError] = useState<string | null>(null);

  const sendComment = async () => {
    if (!newComment.trim() || !info.id_karya || submitting) return;
    if (!isLoggedIn()) {
      showToast("Kamu harus login untuk berkomentar.", "warning");
      return;
    }
    setSubmitting(true);
    setCommentError(null);
    try {
      const res = await fetch(`/api/karya/${info.id_karya}/komentar`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ isi_komentar: newComment }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setCommentError(data.message ?? "Tunggu beberapa menit sebelum komentar lagi.");
      } else if (res.ok) {
        const nama = data.komentar?.pengguna?.nama ?? "Kamu";
        const isi = data.komentar?.isi_komentar ?? newComment;
        setInfo((prev) => ({
          ...prev,
          komentar: [...prev.komentar, { nama, isi }],
        }));
        setNewComment("");
      }
    } catch {
      setCommentError("Gagal mengirim komentar. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const wheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((p) => Math.min(Math.max(p - e.deltaY * 0.0015, 0.5), 5));
  };

  return (
    <div className="fixed inset-0 z-[99997] bg-black/95 flex flex-row">

      {/* IMAGE */}
      <div onWheel={wheel} className="w-[55%] h-full flex items-center justify-center p-3 border-r border-white/10">
        <div style={{ transform: `scale(${zoom})` }} className="relative w-full h-full">
          <Image src={src} alt="Poster" fill draggable={false} className="object-contain" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[45%] h-full text-white flex flex-col">

        {/* HEADER */}
        <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-sm lg:text-base">Detail Booth</h1>
          <button onClick={onClose} className="px-3 h-9 text-md font-bold">✕</button>
        </div>

        {/* TAB */}
        <div className="grid grid-cols-2 border-b border-white/10">
          <button
            onClick={() => setTab("detail")}
            className={`h-11 text-sm ${tab === "detail" ? "bg-white text-black font-bold" : "text-white/70"}`}
          >
            Detail
          </button>
          <button
            onClick={() => setTab("komentar")}
            className={`h-11 text-sm ${tab === "komentar" ? "bg-white text-black font-bold" : "text-white/70"}`}
          >
            Komentar ({info.komentar.length})
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">

          {/* DETAIL */}
          {tab === "detail" && (
            <div className="p-4 space-y-5">

              {/* TOP */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold leading-tight">{info.judul}</h1>

                  {/* LIKE */}
                  <button onClick={toggleLike} className="flex items-center gap-2 mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      fill={info.liked ? "white" : "none"} stroke="white" strokeWidth="2" className="w-5 h-5">
                      <path d="M12 21s-7-4.35-9.5-8C.5 9.5 2.5 5 7 5c2.54 0 4 1.5 5 3 1-1.5 2.46-3 5-3 4.5 0 6.5 4.5 4.5 8-2.5 3.65-9.5 8-9.5 8z" />
                    </svg>
                    <span className="text-sm">{info.likes}</span>
                  </button>
                </div>

                {/* BADGE */}
                <div className="flex items-start gap-2 shrink-0">
                  {info.is_terbaik && (
                    <div className="relative w-12 h-12 lg:w-16 lg:h-16">
                      <Image src="/icon/Medalion.svg" alt="Karya Terbaik" fill className="object-contain" />
                    </div>
                  )}
                  {info.is_terbanyak && (
                    <div className="relative w-11 h-11 lg:w-[60px] lg:h-[60px]">
                      <Image src="/icon/Favorite.svg" alt="Terbanyak Likes" fill className="object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* DESC */}
              <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed text-justify">
                {info.deskripsi}
              </p>

              {/* TOMBOL TONTON VIDEO — muncul kalau ada tautan */}
              {info.tautan && (
                <button
                  onClick={() => onOpenTautan(info.tautan!)}
                  className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Tonton Video
                </button>
              )}

            </div>
          )}

          {/* KOMENTAR */}
          {tab === "komentar" && (
            <div className="p-4 space-y-3">
              {info.komentar.length === 0 && (
                <p className="text-sm text-white/50">Belum ada komentar</p>
              )}
              {info.komentar.map((item, i) => (
                <div key={i} className="bg-white/5 rounded-[6px] p-3">
                  <p className="text-xs font-bold mb-1">{item.nama}</p>
                  <p className="text-sm text-white/70">{item.isi}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INPUT KOMENTAR */}
        {tab === "komentar" && (
          <div className="border-t border-white/10">
            {!isLoggedIn() && (
              <p className="px-3 pt-2 text-xs text-yellow-400">Login untuk berkomentar.</p>
            )}
            {commentError && (
              <p className="px-3 pt-2 text-xs text-red-400">{commentError}</p>
            )}
            <div className="p-3 flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendComment()}
                placeholder="Tulis komentar..."
                className="flex-1 h-11 px-3 rounded-[6px] bg-white/10 text-sm outline-none"
              />
              <button
                onClick={sendComment}
                disabled={submitting}
                className="w-11 h-11 rounded-[6px] bg-main-blue flex items-center justify-center disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="white" strokeWidth="2" className="w-5 h-5">
                  <path d="M3 20l18-8L3 4v6l13 2-13 2v6z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}