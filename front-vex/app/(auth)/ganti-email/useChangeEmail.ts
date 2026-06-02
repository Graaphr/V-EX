
import { useState } from 'react';
import { sendVerification, verifyToken } from './api';

export function useChangeEmail() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const reset = () => {
    setStep(1);
    setError('');
    setSuccess('');
    setToken('');
    setPassword('');
  };

  // STEP 1: POST /api/change-email/send
  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newEmail || !password) {
      return setError('Email baru dan password wajib diisi');
    }

    try {
      setIsLoading(true);
      const res = await sendVerification({ new_email: newEmail, password });
      setSuccess(res.message || 'Kode verifikasi telah dikirim');
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal mengirim kode verifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: POST /api/change-email/verify
  const handleVerify = async () => {
    setError('');
    setSuccess('');

    if (!token) {
      return setError('Kode verifikasi wajib diisi');
    }

    try {
      setIsLoading(true);
      const res = await verifyToken({ token });
      setSuccess(res.message || 'Email berhasil diubah');
      setStep(3);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Verifikasi gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    isLoading,
    error,
    success,
    newEmail,
    setNewEmail,
    password,
    setPassword,
    token,
    setToken,
    handleSendVerification,
    handleVerify,
    handleReset: reset,
  };
}
