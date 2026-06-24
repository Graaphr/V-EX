'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/shared/ui/Button';
import { PasswordField } from '@/components/shared/ui/InputFields';
import { ResetPassword } from '../apiLupaPassword';

export default function UbahPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('id') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordConfirmError('');
    setSuccess('');
    setError('');
    let hasError = false;

    if (!password.trim()) {
      setPasswordError('Kata sandi wajib diisi');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password minimal 6 karakter');
      hasError = true;
    }

    if (!passwordConfirmation.trim()) {
      setPasswordConfirmError('Konfirmasi kata sandi wajib diisi');
      hasError = true;
    } else if (password !== passwordConfirmation) {
      setPasswordConfirmError('Konfirmasi password tidak sama');
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      const res = await ResetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(res.message || 'Password berhasil diubah');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal mengubah password';
      const msgLower = message.toLowerCase();

      if (
        msgLower.includes('konfirmasi') ||
        msgLower.includes('confirmation') ||
        msgLower.includes('cocok') ||
        msgLower.includes('match')
      ) {
        setPasswordError(message);
      } else {
        setError(message);
      }
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

        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <PasswordField
              value={password}
              placeholder="Kata Sandi Baru"
              showPassword={showPassword}
              error={passwordError}
              className="input-form transition-all duration-200"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              onToggle={() => setShowPassword((prev) => !prev)}
            />
          </div>

          <div>
            <PasswordField
              value={passwordConfirmation}
              placeholder="Konfirmasi Kata Sandi"
              showPassword={showPasswordConfirm}
              error={passwordConfirmError}
              className="input-form transition-all duration-200"
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                setPasswordConfirmError('');
              }}
              onToggle={() => setShowPasswordConfirm((prev) => !prev)}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg disabled:opacity-50">
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </form>
      </div>
    </div>
  );
}
