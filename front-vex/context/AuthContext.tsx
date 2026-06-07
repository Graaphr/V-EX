'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // FETCH USER
  // FETCH USER
  const fetchUser = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        return;
      }

      const response = await url.get('/api/user');

      setUser(response.data.user ?? response.data);
    } catch (error: any) {
      console.error('Fetch user gagal:', error);

      localStorage.removeItem('token');
      setUser(null);

      // Redirect ke halaman utama jika token expired/invalid
      if (error?.response?.status === 401) {
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // LOGIN
  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // LOGOUT
  // LOGOUT
  const logout = async () => {
    try {
      await url.post('/api/logout');
    } catch (error) {
      console.warn('Logout request failed, clearing local session anyway.');
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/';
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
