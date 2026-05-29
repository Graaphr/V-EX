'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, ButtonPutih } from '@/components/ui/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '@/lib/axios';

export default function LupaPasswordPage() {
  // ROUTE
  const router = useRouter();
  const searchParams = useSearchParams();
  // DATA
  // {get data from URL}
  const email = searchParams.get('email') || '';
  const token = searchParams.get('id') || '';
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  // RESPONSE
  const [showPassword, setShowPassword] = useState(false);
  const [ShowPasswordConfrim, setShowPasswordConfrim] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // =========================
  // handler MASUK
  // =========================
  const handleDirectLogin = async () => {
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);

      const res = await api.post('/api/reset-login-direct', { email, token });

      setSuccess(res.data.message || 'Login berhasil...');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal masuk langsung');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // UBAH PASSWORD
  // =========================
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak sama');
      return;
    }
    try {
      setIsLoading(true);

      const res = await api.post('/api/auth/reset-password', {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(res.data.message || 'Password berhasil diubah');

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-blue px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Reset Password</h1>

          <p className="text-sm text-gray-500 mt-2">Pilih tindakan untuk akun Anda</p>
        </div>

        {/* ERROR */}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        {/* SUCCESS */}
        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}

        {/* PILIHAN */}
        {!showForm ? (
          <div className="space-y-4">
            <Button
              type="button"
              onClick={handleDirectLogin}
              disabled={isLoading}
              className="w-full py-3 rounded-lg disabled:opacity-50"
              title="langsung masuk ke halaman utama"
            >
              {isLoading ? 'Memproses...' : 'Langsung Ke Halaman Utaman'}
            </Button>

            <ButtonPutih
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full py-3 rounded-lg"
              title="ubah kata sandi"
            >
              Ubah Kata Sandi
            </ButtonPutih>
          </div>
        ) : (
          // FORM GANTI KATA SANDI
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata Sandi Baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="relative">
              <input
                type={ShowPasswordConfrim ? 'text' : 'password'}
                placeholder="Konfirmasi Kata Sandi"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => setShowPasswordConfrim((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {ShowPasswordConfrim ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg disabled:opacity-50">
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>

            <ButtonPutih type="button" onClick={() => setShowForm(false)} className="w-full py-3 rounded-lg">
              Kembali
            </ButtonPutih>
          </form>
        )}
      </div>
    </div>
  );
}
