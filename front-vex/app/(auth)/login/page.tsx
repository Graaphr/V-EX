'use client';
import React, { useState } from 'react';
import { motion, Transition } from 'framer-motion';
import Link from 'next/link';
// KOMPONEN
import { Logo } from '@/components/shared/ui/Components';
import { Button, ButtonPutih } from '@/components/shared/ui/Button';
import { VectorBox } from '@/components/shared/ui/BoxModel';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { InputField, PasswordField } from '@/components/shared/ui/InputFields';
// API
import { Login } from './apiLogin';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email wajib diisi');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Kata sandi wajib diisi');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

   try {
      const res = await Login({ email, password });
      const { token, user } = res;
      login(token, user);
      
      if (user?.nama) {
        document.cookie = `username=${encodeURIComponent(user.nama)}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      setSuccess(res?.message);

      router.push(res.redirect);
      
    } catch (error: any) {
      const response = error.response?.data?.message;
      setError(response || 'Terjadi kesalahan saat masuk');
      
    } finally {
      setIsLoading(false);
    }
  };

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

const boxes = [
  {
    d: 0.2,
    className: 'absolute z-2 -bottom-4 left-2 sm:left-6 md:left-8',
    size: 'h-[130px] w-[130px] sm:h-[170px] sm:w-[170px] md:h-[210px] md:w-[210px] lg:h-[250px] lg:w-[250px] rotate-12',
  },
  {
    d: 0.4,
    className: 'absolute top-6 left-4 sm:top-10 sm:left-10 md:top-14 md:left-16 lg:top-15 lg:left-20',
    size: 'h-[100px] w-[100px] sm:h-[130px] sm:w-[130px] md:h-[165px] md:w-[165px] lg:h-[200px] lg:w-[200px] opacity-90 -rotate-12',
  },
  {
    d: 0.1,
    className: 'absolute z-2 top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2',
    size: 'h-[200px] w-[200px] sm:h-[260px] sm:w-[260px] md:h-[330px] md:w-[330px] lg:h-[400px] lg:w-[400px] rotate-45',
  },
  {
    d: 0.3,
    className: 'absolute z-2 -bottom-4 right-0',
    size: 'h-[130px] w-[130px] sm:h-[170px] sm:w-[170px] md:h-[210px] md:w-[210px] lg:h-[250px] lg:w-[250px] -rotate-12',
  },
  {
    d: 0.5,
    className: 'absolute z-2 top-8 right-2 sm:top-10 sm:right-[30px] md:right-[65px] lg:right-[100px]',
    size: 'h-[95px] w-[95px] sm:h-[130px] sm:w-[130px] md:h-[165px] md:w-[165px] lg:h-[200px] lg:w-[200px] rotate-12 opacity-90',
  },
  {
    d: 0.6,
    className: 'absolute top-[45%] z-2 left-[8%] sm:left-[15%] md:left-[20%] lg:left-75',
    size: 'h-[60px] w-[60px] sm:h-[75px] sm:w-[75px] md:h-[90px] md:w-[90px] lg:h-[100px] lg:w-[100px] opacity-90 rotate-45',
  },
  {
    d: 0.7,
    className: 'absolute z-2 bottom-[18%] right-[10%] sm:right-[18%] md:right-[24%] lg:bottom-50 lg:right-60',
    size: 'h-[60px] w-[60px] sm:h-[75px] sm:w-[75px] md:h-[90px] md:w-[90px] lg:h-[100px] lg:w-[100px] -rotate-45 opacity-90',
  },
];

  return (
    <div className="flex items-center justify-center min-h-screen  p-4 relative bg-secondary-color overflow-hidden  text-black">
      <motion.div
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        transition={{ duration: 2, ease: 'circOut' }}
        className="absolute h-[100%] sm:h-[100%] md:h-[100%] lg:h-[100%] w-[100%] sm:w-[100%] md:w-[100%] bottom-0 bg-main-blue lg:rounded-t-full "
      >
        {boxes.map((box, index) => (
          <motion.div
            key={index}
            variants={slideUp}
            initial="initial"
            animate="animate"
            transition={floatingTransition(box.d)}
            className={box.className}
          >
            <VectorBox className={box.size} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className={cn(
          'flex flex-col items-center',
          'z-10 w-full max-w-md p-8',
          'scale-90 rounded-2xl shadow-2xl',
          'bg-white border border-gray-100',
        )}
      >
        <div className="flex flex-col items-center mb-8">
          <Logo />
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-5 select-none">
          {success && <div className="bg-green-100 text-green-600 text-sm p-3 rounded-lg mb-4">{success}</div>}
          {error && <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

          <InputField
            type="email"
            value={email}
            placeholder="Email"
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

          <div className="flex justify-end">
            <Link href="/lupa-password" className="text-sm font-medium hover:text-main-blue">
              Lupa Kata Sandi?
            </Link>
          </div>

          <div className="w-full mt-7 border-b-2 border-gray-400 pb-8">
            <Button type="submit" className="w-full py-3 border-2 rounded-lg text-lg font-bold">
              {isLoading ? 'Loading...' : 'Masuk'}
            </Button>
          </div>
        </form>

        <div className="mt-4 flex flex-col items-center w-full">
          <span className="text-sm mb-3">Belum punya akun?</span>
          <div className="w-full mt-1 border-b border-gray-200 pb-1">
            <ButtonPutih className="w-full py-3 border-2 rounded-lg text-lg font-bold" link="/register">
              Daftar
            </ButtonPutih>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
