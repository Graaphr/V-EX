'use client';

// React
import React, { useState } from 'react';
import { motion, Transition } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Componen
import { Logo } from '@/components/shared/ui/Components';
import { Button, ButtonPutih } from '@/components/shared/ui/Button';
import { VectorBlueBox } from '@/components/shared/ui/BoxModel';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { InputField, PasswordField } from '@/components/shared/ui/InputFields';

// API
import { Register } from './apiRegister';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // pw_AUTH
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // DATA
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const [success, setSuccess] = useState("");
  const [namaError, setNamaError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] = useState('');

  // handle_register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setNamaError('');
    setEmailError('');
    setPasswordError('');
    setPasswordConfirmationError('');
    setSuccess('');

    let hasError = false;

    if (!nama.trim()) {
      setNamaError('Nama wajib diisi');
      hasError = true;
    }
    if (!email.trim()) {
      setEmailError('Email wajib diisi');
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError('Kata sandi wajib diisi');
      hasError = true;
    }
    if (!password_confirmation.trim()) {
      setPasswordConfirmationError('Kata sandi wajib diisi');
      hasError = true;
    }
    if (password !== password_confirmation) {
      setPasswordConfirmationError('Password tidak sama!');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await Register({
        nama: nama,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      });

      setSuccess(res.message);

      localStorage.setItem('token', res.token);
      localStorage.setItem('otp_expires_at', res.otp_expires_at);

      router.push('/verifikasi');

    } catch (error: any) {
      const response = error.response?.data;

      if (response?.errors) {
        setNamaError(response.errors.nama?.[0] || '');
        setEmailError(response.errors.email?.[0] || '');
        setPasswordError(response.errors.password?.[0] || '');
        setPasswordConfirmationError(
          response.errors.password_confirmation?.[0] || ''
        );
      }

    } finally {
      setIsLoading(false);
    }
  };

  // Animate
  const slideUp = {
    initial: { y: '100vh', opacity: 0 },
    animate: { y: [0, -15, 0], opacity: 1 },
  };
  const floatingTransition = (d: number): Transition => ({
    y: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: d + 1.2,
    },
    opacity: { duration: 1.2, delay: d },
    ease: 'easeOut',
  });

  // Position
const boxes = [
  {
    d: 0.2,
    className: 'top-4 left-4 sm:top-8 sm:left-8 md:top-10 md:left-0',
    size: 'h-[130px] w-[130px] sm:h-[180px] sm:w-[180px] md:h-[230px] md:w-[230px] lg:h-[300px] lg:w-[300px] rotate-45',
  },
  {
    d: 0.3,
    className: 'top-4 right-4 sm:top-8 sm:right-8 md:top-10 md:right-0',
    size: 'h-[130px] w-[130px] sm:h-[180px] sm:w-[180px] md:h-[230px] md:w-[230px] lg:h-[300px] lg:w-[300px] -rotate-12',
  },
  {
    d: 0.1,
    className: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    size: 'h-[120px] w-[120px] sm:h-[170px] sm:w-[170px] md:h-[210px] md:w-[210px] lg:h-[250px] lg:w-[250px] rotate-90',
  },
  {
    d: 0.5,
    className: 'bottom-6 left-[12%] sm:bottom-14 sm:left-1/4',
    size: 'h-[65px] w-[65px] sm:h-[85px] sm:w-[85px] md:h-[95px] md:w-[95px] lg:h-[100px] lg:w-[100px] rotate-12',
  },
  {
    d: 0.6,
    className: 'bottom-6 right-[12%] sm:bottom-14 sm:right-0',
    size: 'h-[65px] w-[65px] sm:h-[85px] sm:w-[85px] md:h-[95px] md:w-[95px] lg:h-[100px] lg:w-[100px] -rotate-45',
  },
];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-main-blue overflow-hidden min-h-screen flex items-center justify-center p-4 relative text-white"
    >
      {/* BACKGROUND */}
      <motion.div
        initial={{ y: '-100vh' }}
        animate={{ y: 0 }}
        transition={{ duration: 2, ease: 'circOut' }}
        className="absolute h-[100%] sm:h-[90%] md:h-[93%] lg:h-[95%] w-[100%] sm:w-[94%] md:w-[95%] top-0 bg-secondary-color lg:rounded-b-full "
      >
        {boxes.map((box, i) => (
          <motion.div
            key={i}
            variants={slideUp}
            initial="initial"
            animate="animate"
            transition={floatingTransition(box.d)}
            className={`absolute ${box.className}`}
          >
            <VectorBlueBox className={box.size} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="z-10 bg-white text-black rounded-xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center"
      >
        <Logo />

        <form onSubmit={handleRegister} className="w-full space-y-4 mt-6 select-none">
          {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}
          <InputField
            type="text"
            value={nama}
            placeholder="Masukkan Nama"
            error={namaError}
            className={'input-form transition-all duration-200'}
            onChange={(e) => {
              setNama(e.target.value);
              setNamaError('');
            }}
            maxLength={80}
            
          />
          <InputField
            type="text"
            value={email}
            placeholder="Masukkan Email"
            error={emailError}
            className={'input-form transition-all duration-200'}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
          />

          <PasswordField
            value={password}
            placeholder="Kata Sandi"
            showPassword={showPassword}
            error={passwordError}
            className={'input-form transition-all duration-200'}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
            onToggle={() => setShowPassword((prev) => !prev)}
          />
          <PasswordField
            value={password_confirmation}
            placeholder="Kata Sandi"
            showPassword={showConfirm}
            error={passwordConfirmationError}
            className={'input-form transition-all duration-200'}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
              setPasswordConfirmationError('');
            }}
            onToggle={() => setShowConfirm((prev) => !prev)}
            minLength={8}
          />

          <div className="w-full mt-8 border-b-2 border-gray-300 pb-8">
            <ButtonPutih onClick={handleRegister} disabled={isLoading} className="w-full py-3 rounded-lg font-bold">
              {isLoading ? 'Loading...' : 'Daftar'}
            </ButtonPutih>
          </div>
        </form>

        <div className="mt-6 flex flex-col   items-center w-full">
          <span className=" text-sm mb-4">Sudah punya akun?</span>
          <div className="w-full mt-1 border-b border-gray-200 pb-1">
            <Button className="w-full py-3 rounded-lg font-bold" link="/login">
              Masuk
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
