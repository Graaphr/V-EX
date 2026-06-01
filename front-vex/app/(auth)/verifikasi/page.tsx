"use client";
// React
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Component
import { Button, ButtonPutih } from "@/components/shared/ui/Button";
// API
import api from "@/lib/axios";

export default function VerifikasiPage() {
  // handel
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // router
  const router = useRouter();
  // timer
  const [timeLeft, setTimeLeft] = useState(0);
  // DATA
  const [otp, setOtp] = useState("");

  // control timer
  useEffect(() => {
    const exp = localStorage.getItem("otp_expires_at");
    if (!exp) return;

    const expiresAt = Number(exp);

    const interval = setInterval(() => {
      const diff = Math.floor((expiresAt - Date.now()) / 1000);

      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        localStorage.removeItem("otp_expires_at");
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (t: number) => {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // handler otp
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP harus 6 digit");
      return;
    }

    try {
      setIsLoading(true);

      // post api
      const res = await api.post("/api/auth/verify-otp", {
        // get token from local
        token: localStorage.getItem("token"),
        otp,
      });

      const {message} = res.data
      setSuccess(message);

      localStorage.removeItem("token");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal verifikasi OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // handler resend otp
  const handleResend = async () => {
    try {
      const res = await api.post("/api/auth/resend-otp", {
        token: localStorage.getItem("token"),
      });

      localStorage.setItem(
        "otp_expires_at",
        res.data.otp_expires_at.toString(),
      );

     setTimeout(() => {
       window.location.reload();
     }, 1000);

      setSuccess("OTP berhasil di kirim");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal kirim ulang OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-blue px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Verifikasi Email</h1>

          <p className="text-sm text-gray-500 mt-2">Masukkan 6 digit OTP</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h1 className="items-center flex w-100 self-center">
            Countdown: {formatTime(timeLeft)}
          </h1>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            className="w-full text-center tracking-[0.5em] text-2xl font-bold px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Memverifikasi..." : "Verifikasi"}
          </Button>
        </form>

        {/* RESEND */}
        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-gray-600">
            Tidak menerima kode?
          </p>

          <ButtonPutih
            type="button"
            onClick={handleResend}
            className="w-full py-3 rounded-lg"
          >
            Kirim Ulang OTP
          </ButtonPutih>
        </div>
      </div>
    </div>
  );
}
