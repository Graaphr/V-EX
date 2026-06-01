'use client';

import { useEffect, useState } from 'react';
import { Button, ButtonPutih } from '@/components/shared/ui/Button';
import api from '@/lib/axios';

export default function LupaPasswordEmailPage() {
  // RESPONSE
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // DATA
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('reset_email');

    if (savedEmail) {
      setEmail(savedEmail);
      setEmailSent(true);
    }
  }, []);

  // =================
  // handler kirim
  // =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!email) {
      setError('Email wajib diisi');
      return;
    }

    try {
      setIsLoading(true);

      // const res = await api.post('/api/auth/resend-email', { email });
      // setSuccess(res.data.message || 'Email berhasil dikrim');

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Berhasil');

      localStorage.setItem('reset_email', email);
      setEmailSent(true);
    } catch {
      setError('Gagal');
    }
  };

  // =================
  // handler resend
  // =================
  const handleResend = async () => {
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);
      const res = await api.post('/api/auth/resend-email', { email });
      setSuccess(res.data.message || 'Email berhasil dikrim');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Email berhasil dikirim ulang');
    } catch {
      setError('Gagal mengirim ulang email');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================
  // handler ganti email (button)
  // ============================
  const handleChangeEmail = () => {
    setEmailSent(false);
    setSuccess('');
    setError('');
    localStorage.removeItem('reset_email');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-blue px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Lupa Password</h1>

          <p className="text-sm text-gray-500 mt-2">
            {!emailSent ? 'Masukkan email aktif yang terkait akun anda' : 'Cek email Anda'}
          </p>
        </div>

        {/* ERROR */}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        {/* SUCCESS */}
        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}

        {/* FORM EMAIL */}
        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg disabled:opacity-50">
              {isLoading ? 'Mengirim...' : 'Kirim'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              className="opacity-60 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
            <Button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="w-full py-3 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Ulang Email'}
            </Button>

            <ButtonPutih type="button" onClick={handleChangeEmail} className="w-full py-3 rounded-lg">
              Ubah email
            </ButtonPutih>
          </div>
        )}
      </div>
    </div>
  );
}
