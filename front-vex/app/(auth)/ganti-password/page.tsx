'use client';

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { gantiPassword } from './apiGantiPassword';
import { useRouter } from 'next/navigation';

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
};

type StrengthBarProps = {
  password: string;
};

// FUNGSI Untuk Bar & tingkat kekuatan password
function PasswordInput({ id, value, onChange, placeholder, show, onToggle }: PasswordInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
      />
      <span
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}

// Bar
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

  const level = levels[score - 1] || levels[0];

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

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
      setError(err?.response?.data?.message || 'Gagal mengganti kata sandi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-blue px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Ganti Kata Sandi</h1>
          <p className="text-sm text-gray-500 mt-2">
            Masukkan kata sandi lama dan buat kata sandi baru
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">Kata Sandi Lama</label>
            <PasswordInput
              id="old_password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan kata sandi lama"
              show={showOldPassword}
              onToggle={() => setShowOldPassword((p) => !p)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Kata Sandi Baru</label>
            <PasswordInput
              id="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              show={showNewPassword}
              onToggle={() => setShowNewPassword((p) => !p)}
            />
            <StrengthBar password={newPassword} />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Konfirmasi Kata Sandi Baru</label>
            <PasswordInput
              id="new_password_confirmation"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              show={showNewPasswordConfirm}
              onToggle={() => setShowNewPasswordConfirm((p) => !p)}
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