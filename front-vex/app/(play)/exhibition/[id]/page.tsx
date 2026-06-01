'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import Experience from '@/components/play/experience';
import Crosshair from '@/components/play/crosshair';

type PosterData = {
  src: string;
  booth: string;
};

type InfoData = {
  judul: string;
  tim: string;
  deskripsi: string;
  likes: number;
  penilaian: string;
  komentar: {
    nama: string;
    isi: string;
  }[];
};

export default function ExhibitionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [posterData, setPosterData] = useState<PosterData>({
    src: '',
    booth: '',
  });

  /* MOVE */
  const [mobileMove, setMobileMove] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  /* LOOK */
  const lookDelta = useRef({
    x: 0,
    y: 0,
  });

  /* ====================== */
  /* DETECT MOBILE */
  /* ====================== */

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);

      setIsPortrait(window.matchMedia('(orientation: portrait)').matches);
    };

    check();

    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  /* ====================== */
  /* EXIT POINTERLOCK SAAT POSTER BUKA */
  /* ====================== */

  useEffect(() => {
    if (posterOpen) {
      document.exitPointerLock?.();
    }
  }, [posterOpen]);

  /* ====================== */
  /* ESC MENU */
  /* ====================== */

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !posterOpen) {
        setMenuOpen(true);
        document.exitPointerLock?.();
      }
    };

    window.addEventListener('keydown', down);

    return () => window.removeEventListener('keydown', down);
  }, [posterOpen]);

  const openPoster = (src: string, booth: string) => {
    document.exitPointerLock?.();

    setPosterData({
      src,
      booth,
    });

    setPosterOpen(true);
  };

  const controlsLocked = !posterOpen && !menuOpen;

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
          <Canvas
            shadows
            camera={{
              position: [0, 2, 5],
              fov: 75,
            }}
          >
            <Experience
              exhibitionId={id}
              openPoster={openPoster}
              controlsLocked={controlsLocked}
              soundOn={soundOn}
              mobile={isMobile}
              mobileMove={mobileMove}
              lookDelta={lookDelta}
            />
          </Canvas>

          {!isMobile && controlsLocked && <Crosshair />}

          {isMobile && controlsLocked && <MobileHUD setMobileMove={setMobileMove} lookDelta={lookDelta} />}
        </>
      )}

      {/* MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[99998] bg-black/75 flex items-center justify-center">
          <div className="w-[380px] max-w-[90%] rounded-2xl bg-zinc-900 p-6 text-white space-y-4">
            <h1 className="text-2xl font-bold">Menu</h1>

            <button onClick={() => setSoundOn(!soundOn)} className="w-full h-12 rounded-xl bg-white/10">
              Sound :{soundOn ? ' ON' : ' OFF'}
            </button>

            <button onClick={() => setMenuOpen(false)} className="w-full h-12 rounded-xl bg-green-500 font-bold">
              Lanjut
            </button>

            <button
              onClick={() => router.push(`/pameran/${id}`)}
              className="w-full h-12 rounded-xl bg-red-500 font-bold"
            >
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* POSTER */}
      {posterOpen && (
        <PosterViewer id={id} src={posterData.src} booth={posterData.booth} onClose={() => setPosterOpen(false)} />
      )}
    </div>
  );
}

/* ======================= */
/* MOBILE HUD */
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

    setMobileMove({
      w: dy < -10,
      s: dy > 10,
      a: dx < -10,
      d: dx > 10,
    });
  };

  const updateLook = (touch: Touch) => {
    const rect = lookBase.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - rect.width / 2;
    const y = touch.clientY - rect.top - rect.height / 2;
    const dx = clamp(x, -35, 35);
    const dy = clamp(y, -35, 35);

    lookStick.current.style.transform = `translate(${dx}px,${dy}px)`;

    lookDelta.current = {
      x: dx * 0.0015,
      y: dy * 0.0015,
    };
  };

  /* MOVE START */
  const moveStart = (e: any) => {
    const touch = e.changedTouches[0];

    moveTouchId.current = touch.identifier;

    updateMove(touch);
  };

  const moveMove = (e: any) => {
    for (const touch of e.touches) {
      if (touch.identifier === moveTouchId.current) {
        updateMove(touch);
      }
    }
  };

  const moveEnd = (e: any) => {
    for (const touch of e.changedTouches) {
      if (touch.identifier === moveTouchId.current) {
        moveTouchId.current = null;

        moveStick.current.style.transform = `translate(0px,0px)`;

        setMobileMove({
          w: false,
          a: false,
          s: false,
          d: false,
        });
      }
    }
  };

  /* LOOK START */
  const lookStart = (e: any) => {
    const touch = e.changedTouches[0];

    lookTouchId.current = touch.identifier;

    updateLook(touch);
  };

  const lookMove = (e: any) => {
    for (const touch of e.touches) {
      if (touch.identifier === lookTouchId.current) {
        updateLook(touch);
      }
    }
  };

  const lookEnd = (e: any) => {
    for (const touch of e.changedTouches) {
      if (touch.identifier === lookTouchId.current) {
        lookTouchId.current = null;

        lookStick.current.style.transform = `translate(0px,0px)`;

        lookDelta.current = {
          x: 0,
          y: 0,
        };
      }
    }
  };

  return (
    <>
      {/* LEFT */}
      <div
        ref={moveBase}
        onTouchStart={moveStart}
        onTouchMove={moveMove}
        onTouchEnd={moveEnd}
        className="fixed bottom-5 left-5 z-[99999] w-28 h-28 rounded-full bg-white/10 border border-white/20"
      >
        <div ref={moveStick} className="absolute left-1/2 top-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full bg-white/60" />
      </div>

      {/* RIGHT */}
      <div
        ref={lookBase}
        onTouchStart={lookStart}
        onTouchMove={lookMove}
        onTouchEnd={lookEnd}
        className="fixed bottom-5 right-5 z-[99999] w-28 h-28 rounded-full bg-white/10 border border-white/20"
      >
        <div ref={lookStick} className="absolute left-1/2 top-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full bg-white/60" />
      </div>
    </>
  );
}

/* ======================= */
/* POSTER */
/* ======================= */

function PosterViewer({ id, src, booth, onClose }: { id: string; src: string; booth: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState<'detail' | 'komentar'>('detail');
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [info, setInfo] = useState<InfoData>({
    judul: 'Loading...',
    tim: '-',
    deskripsi: 'Loading...',
    likes: 0,
    penilaian: '-',
    komentar: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/uploads/${id}/${booth}-teks.txt`);
        const txt = await res.text();
        const komentarRaw = txt.split('Komentar:')[1] || '';

        const komentar = komentarRaw
          .trim()
          .split('\n')
          .filter(Boolean)
          .map((line) => {
            const [nama, isi] = line.split('|');

            return {
              nama: nama?.trim() || 'Anonim',
              isi: isi?.trim() || '',
            };
          });

        setInfo({
          judul: txt.match(/Judul:\s*(.*)/i)?.[1] || '-',

          tim: txt.match(/Tim:\s*(.*)/i)?.[1] || '-',

          deskripsi: txt.match(/Deskripsi:\s*([\s\S]*?)Likes:/i)?.[1]?.trim() || '-',

          likes: Number(txt.match(/Likes:\s*(\d+)/i)?.[1] || 0),

          penilaian: txt.match(/Penilaian:\s*(.*)/i)?.[1] || '-',

          komentar,
        });
      } catch {
        setInfo({
          judul: 'Data Tidak Ditemukan',
          tim: '-',
          deskripsi: 'File teks belum tersedia.',
          likes: 0,
          penilaian: '-',
          komentar: [],
        });
      }
    };

    load();
  }, [id, booth]);

  const wheel = (e: React.WheelEvent) => {
    e.preventDefault();

    setZoom((p) => Math.min(Math.max(p - e.deltaY * 0.0015, 0.5), 5));
  };

  const toggleLike = () => {
    setLiked(!liked);

    setInfo((prev) => ({
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const sendComment = () => {
    if (!newComment.trim()) return;

    setInfo((prev) => ({
      ...prev,
      komentar: [
        ...prev.komentar,
        {
          nama: 'Guest',
          isi: newComment,
        },
      ],
    }));

    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-[99997] bg-black/95 flex flex-row">
      {/* IMAGE */}
      <div onWheel={wheel} className="w-[55%] h-full flex items-center justify-center p-3 border-r border-white/10">
        <img
          src={src}
          draggable={false}
          style={{
            transform: `scale(${zoom})`,
          }}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[45%] h-full text-white flex flex-col">
        {/* HEADER */}
        <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <h1 className="font-bold text-sm lg:text-base">Detail Booth</h1>

          <button onClick={onClose} className="px-3 h-9 bg-none text-md font-bold">
            ✕
          </button>
        </div>

        {/* TAB */}
        <div className="grid grid-cols-2 border-b border-white/10">
          <button
            onClick={() => setTab('detail')}
            className={`h-11 text-sm ${tab === 'detail' ? 'bg-white text-black font-bold' : 'text-white/70'}`}
          >
            Detail
          </button>

          <button
            onClick={() => setTab('komentar')}
            className={`h-11 text-sm ${tab === 'komentar' ? 'bg-white text-black font-bold' : 'text-white/70'}`}
          >
            Komentar ({info.komentar.length})
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {/* DETAIL */}
          {tab === 'detail' && (
            <div className="p-4 space-y-5">
              {/* TOP */}
              <div className="flex items-start justify-between gap-4">
                {/* LEFT */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold leading-tight">{info.judul}</h1>

                  <p className="text-sm text-white/60 mt-1">{info.tim}</p>

                  {/* LIKE DI BAWAH TIM */}
                  <button onClick={toggleLike} className="flex items-center gap-2 mt-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={liked ? 'white' : 'none'}
                      stroke="white"
                      strokeWidth="2"
                      className="w-5 h-5"
                    >
                      <path d="M12 21s-7-4.35-9.5-8C.5 9.5 2.5 5 7 5c2.54 0 4 1.5 5 3 1-1.5 2.46-3 5-3 4.5 0 6.5 4.5 4.5 8-2.5 3.65-9.5 8-9.5 8z" />
                    </svg>

                    <span className="text-sm">{info.likes}</span>
                  </button>
                </div>

                {/* RIGHT BADGE */}
                <div className="flex items-start gap-2 shrink-0">
                  {/* BADGE TERBAIK */}
                  {info.penilaian.toLowerCase().includes('terbaik') && (
                    <img src="/icon/Medalion.svg" className="w-12 h-12 lg:w-16 lg:h-16 object-contain" />
                  )}

                  {/* BADGE TERBANYAK LIKE */}
                  {info.penilaian.toLowerCase().includes('terbanyak') && (
                    <img src="/icon/Favorite.svg" className="w-11 h-11 lg:w-15 lg:h-15 object-contain" />
                  )}
                </div>
              </div>

              {/* DESC */}
              <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed text-justify">{info.deskripsi}</p>
            </div>
          )}

          {/* KOMENTAR */}
          {tab === 'komentar' && (
            <div className="p-4 space-y-3">
              {info.komentar.length === 0 && <p className="text-sm text-white/50">Belum ada komentar</p>}

              {info.komentar.map((item, i) => (
                <div key={i} className="bg-white/5 rounded-[6px] p-3">
                  <p className="text-xs font-bold mb-1">{item.nama}</p>

                  <p className="text-sm text-white/70">{item.isi}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INPUT */}
        {tab === 'komentar' && (
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar..."
              className="flex-1 h-11 px-3 rounded-[6px] bg-white/10 text-sm outline-none"
            />

            <button
              onClick={sendComment}
              className="w-11 h-11 rounded-[6px] bg-main-blue flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path d="M3 20l18-8L3 4v6l13 2-13 2v6z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
