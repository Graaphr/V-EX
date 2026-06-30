'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import url from '@/lib/axios';

type User = {
  id: number;
  nama: string;
  email: string;
  role: string;
  kelas?: string | null;
  program_studi?: string | null;
};

type AuthType = {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem('token');
    Cookies.remove('role');
    setUser(null);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');

    // Tidak ada token = langsung selesai
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await url.get('/api/user');

      const userData = response.data.user ?? response.data;

      setUser(userData);

      Cookies.set('role', userData.role);
    } catch (error: any) {
      // Kalau unauthorized langsung reset session
      if (error?.response?.status === 401) {
        clearSession();
        router.replace('/');
      } else {
        // Error lain jangan spam
        clearSession();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);

    Cookies.set('role', userData.role);

    setUser(userData);
  };

  const logout = async () => {
    // Clear dulu biar UI langsung responsif
    clearSession();

    router.replace('/');

    try {
      await url.post('/api/logout');
    } catch (_) {
      // sengaja dikosongkan
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth harus di dalam AuthProvider');
  }

  return ctx;
};