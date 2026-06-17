"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailThumbnail from "@/components/karya/DetailThumbnail";
import DetailPoster from "@/components/karya/DetailPoster";
import DetailPreview from "@/components/karya/DetailPreview";
import DetailForm from "@/components/karya/DetailForm";
import DetailAction from "@/components/karya/DetailAction";
import { GetKarya, UpdateKarya } from "@/components/karya/apiKarya";
import { KaryaItem } from "@/types/karya";

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
      errors.link = "Link harus berupa URL yang valid (contoh: https://youtube.com/...).";
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

  const [form, setForm] = useState<KaryaItem | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [posterPreview, setPosterPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [currentPameran, setCurrentPameran] = useState<{
    id: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await GetKarya();
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
                (found as any).pameranTitle?.trim() ||
                `Pameran #${found.pameranId}`,
            });
          }
        }
      } catch (err) {
        console.error("Gagal memuat karya:", err);
      }
    };

    load();
  }, [id]);

  const handleChange = (field: keyof KaryaItem, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
    if (errors[field as string]) {
      setErrors((prev) => { const e = { ...prev }; delete e[field as string]; return e; });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "poster",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === "thumbnail") {
      setThumbnailPreview(preview);
      setThumbnailFile(file);
      setErrors((prev) => { const e = { ...prev }; delete e.thumbnail; return e; });
    }
    if (type === "poster") {
      setPosterPreview(preview);
      setPosterFile(file);
      setErrors((prev) => { const e = { ...prev }; delete e.poster; return e; });
    }
  };

  const handleSave = async () => {
    if (!form) return;

    // Validasi frontend (mode edit: gambar tidak wajib)
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
      // Hanya kirim file jika user memilih yang baru
      if (thumbnailFile) formData.append("gambar_sampul", thumbnailFile);
      if (posterFile) formData.append("gambar_poster", posterFile);

      const result = await UpdateKarya(form.id, formData);

      if (result.status !== "success") {
        throw new Error(result.message || "Gagal memperbarui karya");
      }

      router.push("/ketua-pbl/karya");
    } catch (err: any) {
      if (err.response?.status === 422) {
        const laravelErrors = err.response.data.errors as Record<string, string[]>;
        const mapped: Record<string, string> = {};
        if (laravelErrors.id_pameran) mapped.pameranId = laravelErrors.id_pameran[0];
        if (laravelErrors.id_stan) mapped.booth = laravelErrors.id_stan[0];
        if (laravelErrors.judul) mapped.title = laravelErrors.judul[0];
        if (laravelErrors.deskripsi) mapped.description = laravelErrors.deskripsi[0];
        if (laravelErrors.tautan) mapped.link = laravelErrors.tautan[0];
        if (laravelErrors.gambar_sampul) mapped.thumbnail = laravelErrors.gambar_sampul[0];
        if (laravelErrors.gambar_poster) mapped.poster = laravelErrors.gambar_poster[0];
        setErrors(mapped);
      } else {
        console.error("Gagal menyimpan karya:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="w-full px-4 sm:px-6 lg:px-0 py-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-3">
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

          <div>
            <DetailPreview
              booth={form.booth}
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
            <DetailAction onSave={handleSave} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}