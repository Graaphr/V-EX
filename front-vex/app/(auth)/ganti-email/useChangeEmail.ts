import { useState } from 'react';
import { sendVerification, verifyToken } from './apiGantiEmail';

export function useChangeEmail() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [success, setSuccess] = useState('');
  const [globalError, setGlobalError] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [tokenError, setTokenError] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const reset = () => {
    setStep(1);

    setSuccess('');
    setGlobalError('');

    setEmailError('');
    setPasswordError('');
    setTokenError('');

    setToken('');
    setPassword('');
  };

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccess('');
    setGlobalError('');

    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!newEmail.trim()) {
      setEmailError('Email baru wajib diisi');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password wajib diisi');
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);

      const res = await sendVerification({
        new_email: newEmail,
        password,
      });

      setSuccess(res.message || 'Kode verifikasi telah dikirim');
      setStep(2);
    } catch (err: any) {
      setGlobalError(err?.response?.data?.message || 'Gagal mengirim kode verifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setSuccess('');
    setGlobalError('');
    setTokenError('');

    if (!token.trim()) {
      setTokenError('Kode verifikasi wajib diisi');
      return;
    }

    try {
      setIsLoading(true);

      const res = await verifyToken({
        otp: token,
      });

      setSuccess(res.message || 'Email berhasil diubah');
      setStep(3);
    } catch (err: any) {
      if (err.res?.status === 401) {
        setPasswordError(err.res.message);
        return;
      }

      // setGlobalError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    handleReset: reset,
  };
}
