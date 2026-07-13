'use client';

import { useState } from 'react';
import { Button, ButtonPutih } from '@/components/shared/ui/Button';
import { useChangeEmail } from './useChangeEmail';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { InputField } from '@/components/shared/ui/InputFields';

export default function GantiEmailPage() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    step,
    isLoading,

    success,
    globalError,

    emailError,
    passwordError,
    tokenError,

    newEmail,
    setNewEmail,

    password,
    setPassword,

    token,
    setToken,

    handleSendVerification,
    handleVerify,
    handleReset,
  } = useChangeEmail();

  const handleSelesai = async () => {
    setIsRedirecting(true);

    handleReset();
    await fetchUser();

    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-blue px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        {isRedirecting ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Mengalihkan ke halaman utama...</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Ganti Email</h1>

              <p className="text-sm text-gray-500 mt-2">
                {step === 1
                  ? 'Masukkan email baru dan password Anda'
                  : 'Masukkan kode verifikasi yang dikirim ke email baru'}
              </p>
            </div>

            {/* NOTIFIKASI */}
            {globalError && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{globalError}</div>}

            {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleSendVerification} className="space-y-5">
                <InputField
                  type="email"
                  value={newEmail}
                  placeholder="Email baru"
                  error={emailError}
                  className="w-full px-4 py-3 border rounded-lg"
                  onChange={(e) => setNewEmail(e.target.value)}
                />

                <InputField
                  type="password"
                  value={password}
                  placeholder="Kata Sandi"
                  error={passwordError}
                  className="w-full px-4 py-3 border rounded-lg"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg disabled:opacity-50">
                  {isLoading ? 'Mengirim...' : 'Kirim Kode Verifikasi'}
                </Button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Kode dikirim ke: <span className="font-medium text-gray-700">{newEmail}</span>
                </p>

                <InputField
                  type="text"
                  value={token}
                  placeholder="Masukkan kode verifikasi"
                  error={tokenError}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setToken(e.target.value)}
                />

                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg disabled:opacity-50"
                >
                  {isLoading ? 'Memverifikasi...' : 'Verifikasi & Ganti Email'}
                </Button>

                <ButtonPutih type="button" onClick={handleReset} className="w-full py-3 rounded-lg">
                  Kembali
                </ButtonPutih>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="text-center space-y-4">
                <ButtonPutih type="button" onClick={handleSelesai} className="w-full py-3 rounded-lg">
                  Selesai
                </ButtonPutih>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
