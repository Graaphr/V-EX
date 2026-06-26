'use client';

import { useEffect, useState } from 'react';
import { Button, ButtonPutih } from '@/components/shared/ui/Button';
import { InputField } from '@/components/shared/ui/InputFields';
import { ForgotPassword, ResendEmail } from './apiLupaPassword';

export default function LupaPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('reset_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setEmailSent(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setSuccess('');
    setError('');

    if (!email.trim()) {
      setEmailError('Email wajib diisi');
      return;
    }

    try {
      setIsLoading(true);
      const res = await ForgotPassword({ email });
      setSuccess(res.message || 'Email berhasil dikirim');
      localStorage.setItem('reset_email', email);
      setEmailSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal mengirim email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setEmailError('');
    setSuccess('');
    setError('');

    try {
      setIsLoading(true);
      const res = await ResendEmail({ email });
      setSuccess(res.message || 'Email berhasil dikirim ulang');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal mengirim email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setEmailSent(false);
    setSuccess('');
    setError('');

    setEmailError('');
    localStorage.removeItem('reset_email');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-blue px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Lupa Password</h1>
          <p className="text-sm text-gray-500 mt-2">
            {!emailSent ? 'Masukkan email aktif yang terkait akun anda' : 'Cek email Anda'}
          </p>
        </div>

        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              type="email"
              value={email}
              placeholder="Masukkan email"
              error={emailError}
              className="input-form transition-all duration-200"
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
            />

            <Button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg disabled:opacity-50">
              {isLoading ? 'Mengirim...' : 'Kirim'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <InputField
              type="email"
              value={email}
              placeholder="Masukkan email"
              error={emailError}
              className="input-form opacity-60 transition-all duration-200"
              onChange={(e) => setEmail(e.target.value)}
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
