import url from '@/lib/axios';

interface SendVerificationPayload {
    new_email: string;
    password: string;
}

interface VerifyPayload {
    otp: string;
}

// STEP 1 — POST mengirim email verivikasi
export async function sendVerification(payload: SendVerificationPayload) {
    const res = await url.post('/api/change-email/send', payload);
    return res.data;
}


// STEP 2 — POST veriviakasi token
export async function verifyToken(payload: VerifyPayload) {
    const res = await url.post('/api/change-email/verify', payload);
    return res.data;
}


