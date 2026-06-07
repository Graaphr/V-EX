import url from '@/lib/axios';

interface RegisterPayload {
  nama: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Register akun baru
export async function Register(payload: RegisterPayload) {
  const res = await url.post('/api/auth/register', payload);
  return res.data;
}