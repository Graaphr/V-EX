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
      // Cookie 'username' dibaca oleh /api/player-name (server route) untuk
      // menentukan nama player di pameran 3D. localStorage/context useAuth
      // tidak terlihat oleh server route, jadi harus disinkronkan ke cookie
      // di sini juga — bukan cuma di login() — karena fetchUser() ini yang
      // jalan otomatis tiap kali app di-refresh selama token masih ada.
      Cookies.set('username', userData.nama);

    } catch (error: any) {
      // Kalau unauthorized langsung reset session
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        Cookies.remove('role');
        Cookies.remove('username');
        setUser(null);
        window.location.href = '/';
        return;
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
    Cookies.set('role', userData.role); // simpan role ke cookie
    Cookies.set('username', userData.nama); // dipakai /api/player-name
    setUser(userData);
  };

  const logout = async () => {

    try {
      await url.post('/api/logout');
      clearSession();
      localStorage.removeItem('token');
    } catch (error) {
      console.warn('Logout request failed, clearing local session anyway.');
    } finally {
      localStorage.removeItem('token');
      Cookies.remove('role');
      Cookies.remove('username');
      router.replace('/');
      setUser(null);
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