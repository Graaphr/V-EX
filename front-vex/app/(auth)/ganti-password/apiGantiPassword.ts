import url from '@/lib/axios';

interface GantiPasswordPayload {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Ganti Password
export async function GantiPassword(payload: GantiPasswordPayload) {
  const res = await url.post('/api/change-password', payload);
  return res.data;
}