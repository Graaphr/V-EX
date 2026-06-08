'use client';

import { useState } from 'react';
import { gantiPassword } from './apiGantiPassword';
import { useRouter } from 'next/navigation';
import { PasswordField } from '@/components/shared/ui/InputFields';

type StrengthBarProps = {
  password: string;
};

function StrengthBar({ password }: StrengthBarProps) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Lemah', color: 'bg-red-400', width: 'w-1/4' },
    { label: 'Cukup', color: 'bg-yellow-400', width: 'w-2/4' },
    { label: 'Kuat', color: 'bg-lime-500', width: 'w-3/4' },
    { label: 'Sangat kuat', color: 'bg-green-500', width: 'w-full' },
  ];

  const level = levels[score - 1] ?? levels[0];

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${level.color} ${level.width}`} />
      </div>
      <span className="text-xs text-gray-500 min-w-[68px] text-right">{level.label}</span>
    </div>
  );
}

export default function GantiPasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  // Per-field errors (seperti login)
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset semua error
    setOldPasswordError('');
    setNewPasswordError('');
    setNewPasswordConfirmError('');
    setSuccess('');
    setError('');

    // Validasi client-side per field
    let hasError = false;

    if (!oldPassword.trim()) {
      setOldPasswordError('Kata sandi lama wajib diisi');
      hasError = true;
    }

    if (!newPassword.trim()) {
      setNewPasswordError('Kata sandi baru wajib diisi');
      hasError = true;
    }

    if (!newPasswordConfirmation.trim()) {
      setNewPasswordConfirmError('Konfirmasi kata sandi wajib diisi');
      hasError = true;
    } else if (newPassword !== newPasswordConfirmation) {
      setNewPasswordConfirmError('Kata sandi tidak cocok');
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      const res = await gantiPassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      });
      setSuccess(res.message || 'Kata sandi berhasil diperbarui.');
      setTimeout(() => router.back(), 1500);
    } catch (err: any) {
      // Map error dari API ke field yang sesuai
      const message = err?.response?.data?.message || 'Gagal mengganti kata sandi';
      const msgLower = message.toLowerCase();

      if (
        msgLower.includes('lama') ||
        msgLower.includes('old') ||
        msgLower.includes('incorrect') ||
        msgLower.includes('salah')
      ) {
        setOldPasswordError(message);
      } else if (
        msgLower.includes('konfirmasi') ||
        msgLower.includes('confirmation') ||
        msgLower.includes('cocok') ||
        msgLower.includes('match')
      ) {
        setError(message);
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
          <h1 className="text-2xl font-bold">Ganti Kata Sandi</h1>
          <p className="text-sm text-gray-500 mt-2">Masukkan kata sandi lama dan buat kata sandi baru</p>
        </div>

        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Kata Sandi Lama</label>
            <PasswordField
              value={oldPassword}
              placeholder="Masukkan kata sandi lama"
              showPassword={showOldPassword}
              error={oldPasswordError}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setOldPasswordError('');
              }}
              onToggle={() => setShowOldPassword((p) => !p)}
              className="input-form transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Kata Sandi Baru</label>
            <PasswordField
              value={newPassword}
              placeholder="Minimal 8 karakter"
              showPassword={showNewPassword}
              error={newPasswordError}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setNewPasswordError('');
              }}
              onToggle={() => setShowNewPassword((p) => !p)}
              className="input-form transition-all duration-200"
            />
            <StrengthBar password={newPassword} />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Konfirmasi Kata Sandi Baru</label>
            <PasswordField
              value={newPasswordConfirmation}
              placeholder="Ulangi kata sandi baru"
              showPassword={showNewPasswordConfirm}
              error={newPasswordConfirmError}
              onChange={(e) => {
                setNewPasswordConfirmation(e.target.value);
                setNewPasswordConfirmError('');
              }}
              onToggle={() => setShowNewPasswordConfirm((p) => !p)}
              className="input-form transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-main-blue text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
