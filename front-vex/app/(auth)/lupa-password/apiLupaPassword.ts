import url from '@/lib/axios';

interface EmailPayload {
  email: string;
}

interface VerifyTokenPayload {
  token: string;
}

interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Kirim email reset password
export async function ForgotPassword(payload: EmailPayload) {
  const res = await url.post('/api/auth/forgot-password', payload);
  return res.data;
}

// Kirim ulang email reset password
export async function ResendEmail(payload: EmailPayload) {
  const res = await url.post('/api/auth/resend-email', payload);
  return res.data;
}

// Verifikasi token dari email
export async function verifyResetToken(payload: VerifyTokenPayload) {
  const res = await url.post('/api/auth/verify-reset-token', payload);
  return res.data;
}

// Simpan password baru
export async function ResetPassword(payload: ResetPasswordPayload) {
  const res = await url.post('/api/auth/reset-password', payload);
  return res.data;
}