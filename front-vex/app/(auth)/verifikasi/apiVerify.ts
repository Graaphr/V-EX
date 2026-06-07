import api from '@/lib/axios';

interface VerifyPayload {
  token: string | null;
  otp: string;
}
interface ResendPayload {
  token: string | null;
}

// Register akun baru
export async function Verify(payload: VerifyPayload) {
  const res = await api.post("/api/auth/verify-otp", payload);
  return res.data;
}
// Resend akun baru
export async function Resend(payload: ResendPayload) {
  const res = await api.post("/api/auth/resend-otp", payload);
  return res.data;
}