'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/shared/ui/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { resetPassword } from '../apiLupaPassword';

export default function UbahPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('id') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

      const res = await resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(res.message || 'Password berhasil diubah');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-blue px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-gray-500 mt-2">Masukkan kata sandi baru Anda</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}

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
              type={showPasswordConfirm ? 'text' : 'password'}
              placeholder="Konfirmasi Kata Sandi"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg disabled:opacity-50">
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </form>
      </div>
    </div>
  );
}