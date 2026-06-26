"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailThumbnail from "@/components/karya/DetailThumbnail";
import DetailPoster from "@/components/karya/DetailPoster";
import DetailPreview from "@/components/karya/DetailPreview";
import DetailForm from "@/components/karya/DetailForm";
import DetailAction from "@/components/karya/DetailAction";
import {
  GetKarya,
  GetKaryaKps,
  UpdateKarya,
  DeleteKarya,
  PilihTerbaik,
  BatalkanTerbaik,
} from "@/components/karya/apiKarya";
import { KaryaItem } from "@/types/karya";
import { useAuth } from "@/context/AuthContext";

// =============================
// HELPERS
// =============================

/** Tambah https:// jika user lupa mengetiknya */
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Validasi sesuai rule Laravel controller (store & update sama).
 * Mode edit: gambar tidak required jika belum diubah (file = null → pakai existing).
 */
function validate(
  form: KaryaItem,
  thumbnailFile: File | null,
  posterFile: File | null,
  isEdit = false,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.pameranId) errors.pameranId = "Pameran wajib dipilih.";
  if (!form.booth) errors.booth = "Stan wajib dipilih.";
  if (!form.title.trim()) errors.title = "Judul wajib diisi.";
  if (!form.description?.trim()) errors.description = "Deskripsi wajib diisi.";

  const normalizedLink = normalizeUrl(form.link ?? "");
  if (!normalizedLink) {
    errors.link = "Link YouTube wajib diisi.";
  } else {
    try {
      new URL(normalizedLink);
    } catch {
      errors.link =
        "Link harus berupa URL yang valid (contoh: https://youtube.com/...).";
    }
  }

  // Mode edit: gambar hanya wajib jika user memilih file baru
  // (backend update controller biasanya pakai 'sometimes|image')
  if (!isEdit) {
    if (!thumbnailFile) errors.thumbnail = "Gambar sampul wajib diunggah.";
    if (!posterFile) errors.poster = "Gambar poster wajib diunggah.";
  }

  return errors;
}

// =============================
// COMPONENT
// =============================

interface Props {
  id: number;
}

export default function EditKarya({ id }: Props) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const isAdmin = user?.role === "Admin";
  const isKps = user?.role === "KPS";
  const isKetuaPbl = user?.role === "Ketua PBL";

  // Read-only untuk Admin dan KPS
  const isReadOnly = isAdmin || isKps;

  const [form, setForm] = useState<KaryaItem | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [posterPreview, setPosterPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPameran, setCurrentPameran] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // ── Guard ──
  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin && !isKps && !isKetuaPbl) {
      router.replace("/unauthorized");
    }
  }, [authLoading, isAdmin, isKps, isKetuaPbl, router]);

  // ── Load data karya ──
  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      try {
        // KPS pakai endpoint sendiri agar filter prodi berlaku
        const res = isKps ? await GetKaryaKps() : await GetKarya();
        const list: KaryaItem[] = res.karya ?? [];
        const found = list.find((item) => item.id === id);

        if (found) {
          setForm(found);
          setThumbnailPreview(found.thumbnail ?? "");
          setPosterPreview(found.image);

          if (found.pameranId) {
            setCurrentPameran({
              id: found.pameranId,
              title:
                found.pameranTitle?.trim() || `Pameran #${found.pameranId}`,
            });
          }
        }
      } catch (err) {
        console.error("Gagal memuat karya:", err);
      }
    };

    load();
  }, [id, authLoading, isKps]);

  // ── Handlers ──

  const handleChange = (field: keyof KaryaItem, value: string) => {
    if (!form || isReadOnly) return;
    setForm({ ...form, [field]: value });
    if (errors[field as string]) {
      setErrors((prev) => {
        const e = { ...prev };
        delete e[field as string];
        return e;
      });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "poster",
  ) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === "thumbnail") {
      setThumbnailPreview(preview);
      setThumbnailFile(file);
      setErrors((prev) => {
        const e = { ...prev };
        delete e.thumbnail;
        return e;
      });
    }
    if (type === "poster") {
      setPosterPreview(preview);
      setPosterFile(file);
      setErrors((prev) => {
        const e = { ...prev };
        delete e.poster;
        return e;
      });
    }
  };

  // Hanya Ketua PBL
  const handleSave = async () => {
    if (!form || isReadOnly) return;

    const validationErrors = validate(form, thumbnailFile, posterFile, true);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const formData = new FormData();
      formData.append("id_pameran", String(form.pameranId));
      formData.append("id_stan", form.booth ?? "");
      formData.append("judul", form.title.trim());
      formData.append("deskripsi", form.description?.trim() ?? "");
      formData.append("tautan", normalizeUrl(form.link ?? ""));
      if (thumbnailFile) formData.append("gambar_sampul", thumbnailFile);
      if (posterFile) formData.append("gambar_poster", posterFile);

      const result = await UpdateKarya(form.id, formData);
      if (result.status !== "success") {
        throw new Error(result.message || "Gagal memperbarui karya");
      }

      router.push("/ketua-pbl/karya");
    } catch (err: any) {
      if (err.response?.status === 422) {
        const laravelErrors = err.response.data.errors as Record<
          string,
          string[]
        >;
        const mapped: Record<string, string> = {};
        if (laravelErrors.id_pameran)
          mapped.pameranId = laravelErrors.id_pameran[0];
        if (laravelErrors.id_stan) mapped.booth = laravelErrors.id_stan[0];
        if (laravelErrors.judul) mapped.title = laravelErrors.judul[0];
        if (laravelErrors.deskripsi)
          mapped.description = laravelErrors.deskripsi[0];
        if (laravelErrors.tautan) mapped.link = laravelErrors.tautan[0];
        if (laravelErrors.gambar_sampul)
          mapped.thumbnail = laravelErrors.gambar_sampul[0];
        if (laravelErrors.gambar_poster)
          mapped.poster = laravelErrors.gambar_poster[0];
        setErrors(mapped);
      } else {
        console.error("Gagal menyimpan karya:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Hanya Admin
  const handleDelete = async () => {
    if (!form || !isAdmin) return;
    setIsDeleting(true);
    try {
      const result = await DeleteKarya(form.id);
      if (result.status !== "success") {
        throw new Error(result.message || "Gagal menghapus karya");
      }
      router.push("/admin/karya");
    } catch (err) {
      console.error("Gagal menghapus karya:", err);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  // Hanya KPS
  const handlePilihTerbaik = async () => {
    if (!form || !isKps) return;
    setIsLoading(true);
    try {
      const result = await PilihTerbaik(form.id);
      if (result.status !== "success") {
        throw new Error(result.message || "Gagal memilih karya terbaik");
      }
      // Update state lokal agar tombol langsung berubah tanpa reload
      setForm((prev) => (prev ? { ...prev, isTerbaik: true } : prev));
    } catch (err) {
      console.error("Gagal memilih terbaik:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Hanya KPS
  const handleBatalkanTerbaik = async () => {
    if (!form || !isKps) return;
    setIsLoading(true);
    try {
      const result = await BatalkanTerbaik(form.id);
      if (result.status !== "success") {
        throw new Error(result.message || "Gagal membatalkan karya terbaik");
      }
      setForm((prev) => (prev ? { ...prev, isTerbaik: false } : prev));
    } catch (err) {
      console.error("Gagal membatalkan terbaik:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading states ──

  if (authLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-5 border-main-blue border-t-transparent" />
          <p className="font-poppins text-sm text-gray-500">
            Memeriksa sesi...
          </p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-5 border-main-blue border-t-transparent" />
          <p className="font-poppins text-sm text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modal Konfirmasi Hapus — hanya Admin */}
      {isAdmin && showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              Hapus Karya?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Tindakan ini tidak dapat dibatalkan. Karya akan dihapus secara
              permanen.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-5 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-lg bg-red-500 text-sm text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-0 py-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Banner read-only — Admin & KPS */}
          {isReadOnly && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-amber-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-amber-700">
                Mode{" "}
                <span className="font-semibold">
                  {isAdmin ? "Admin" : "KPS"}
                </span>{" "}
                —{" "}
                {isAdmin
                  ? "hanya dapat menghapus karya."
                  : "hanya dapat menentukan karya terbaik."}{" "}
                Data tidak dapat diubah.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Gambar — read-only untuk Admin & KPS */}
            <div
              className={`space-y-3 ${isReadOnly ? "pointer-events-none opacity-75" : ""}`}
            >
              <DetailThumbnail
                preview={thumbnailPreview}
                onUpload={(e) => handleImageUpload(e, "thumbnail")}
                error={errors.thumbnail}
              />
              <DetailPoster
                preview={posterPreview}
                onUpload={(e) => handleImageUpload(e, "poster")}
                error={errors.poster}
              />
            </div>

            {/* Form — read-only untuk Admin & KPS */}
            <div className={isReadOnly ? "pointer-events-none opacity-75" : ""}>
              <DetailPreview
                booth={form.booth ?? ''}
                pameranId={form.pameranId}
                onChange={(value) => handleChange("booth", value)}
                error={errors.booth}
              />
              <DetailForm
                form={form}
                onChange={handleChange}
                currentPameran={currentPameran}
                errors={errors}
              />
            </div>
          </div>

          {/* Action buttons */}
          <DetailAction
            // Admin
            onDelete={isAdmin ? () => setShowConfirm(true) : undefined}
            // Ketua PBL
            onSave={isKetuaPbl ? handleSave : undefined}
            // KPS
            onPilihTerbaik={isKps ? handlePilihTerbaik : undefined}
            onBatalkanTerbaik={isKps ? handleBatalkanTerbaik : undefined}
            isTerbaik={form.isTerbaik}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
