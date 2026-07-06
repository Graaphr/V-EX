import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-poppins px-6 relative overflow-hidden">
            {/* Aksen gradient dekoratif */}
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-main-blue/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-36 -left-36 w-96 h-96 rounded-full bg-main-blue/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 px-10 py-12 text-center">
                <p className="text-7xl font-extrabold text-main-blue tracking-tight">404</p>
                <div className="w-12 h-1 rounded-full bg-main-blue/60 mx-auto my-5" />
                <p className="text-gray-600 font-medium mb-7 leading-relaxed">
                    Halaman yang kamu cari tidak ditemukan.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-main-blue text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}