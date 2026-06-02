// app/settings/ganti-email/api.ts

import api from '@/lib/axios';

interface SendVerificationPayload {
  new_email: string;
  password: string;
}

interface VerifyPayload {
  token: string;
}

/**
 * STEP 1 — POST /api/change-email/send
 * Kirim token verifikasi ke email baru.
 * Membutuhkan: Bearer token (auth middleware Laravel)
 */
export async function sendVerification(payload: SendVerificationPayload) {
  const res = await api.post('/api/change-email/send', payload);
  return res.data;
}

/**
 * STEP 2 — POST /api/change-email/verify
 * Verifikasi token dan eksekusi penggantian email.
 * Membutuhkan: Bearer token (auth middleware Laravel)
 */
export async function verifyToken(payload: VerifyPayload) {
  const res = await api.post('/api/change-email/verify', payload);
  return res.data;
}

/*
 * Contoh response sukses dari Laravel:
 *
 * sendVerification → { status: 'success', message: '...', data: { verification_token, new_email, expires_at } }
 * verifyToken      → { status: 'success', message: '...', data: { old_email, new_email } }
 *
 * Error (4xx) → { status: 'error', message: '...', errors?: {...} }
 * Axios akan throw error pada 4xx/5xx — tangkap di catch block.
 */
