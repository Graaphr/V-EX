'use client';

// React
import React, { useState } from 'react';
import { motion, Transition } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Componen
import { Logo } from '@/components/ui/Components';
import { Button, ButtonPutih } from '@/components/ui/Button';
import { VectorBlueBox } from '@/components/ui/BoxModel';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// API
import api from '@/lib/axios';

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

  // handle_register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama || !email || !password || !password_confirmation) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    if (password !== password_confirmation) {
      alert('Password tidak sama!');
      return;
    }

    setIsLoading(true);

    try {
      // push and respose from API
      const response = await api.post('/api/auth/register', {
        nama: nama,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      });

      alert(response.data.message);

      // set local for token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('otp_expires_at', response.data.otp_expires_at);

      router.push('/verifikasi');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registrasi Gagal');
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
      className: 'top-10 left-10',
      size: 'h-[300px] w-[300px] rotate-45',
    },
    {
      d: 0.3,
      className: 'top-10 right-10',
      size: 'h-[300px] w-[300px] -rotate-12',
    },
    {
      d: 0.1,
      className: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      size: 'h-[250px] w-[250px] rotate-90',
    },
    {
      d: 0.5,
      className: 'bottom-20 left-1/4',
      size: 'h-[100px] w-[100px] rotate-12',
    },
    {
      d: 0.6,
      className: 'bottom-20 right-1/4',
      size: 'h-[100px] w-[100px] -rotate-45',
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
        className="absolute h-[95%] top-0 w-[95%] bg-secondary-color rounded-b-full"
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
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Lengkap"
            className="input-form"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="input-form"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Kata Sandi"
              className="input-form"
            />

            <motion.span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </motion.span>
          </div>

          {/* CONFIRM */}
          <div className="relative">
            <input
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Konfirmasi Kata Sandi"
              className="input-form"
            />

            <motion.span
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </motion.span>
          </div>

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
