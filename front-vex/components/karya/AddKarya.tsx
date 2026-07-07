'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DetailThumbnail from '@/components/karya/DetailThumbnail';
import DetailPoster from '@/components/karya/DetailPoster';
import DetailPreview from '@/components/karya/DetailPreview';
import DetailForm from '@/components/karya/DetailForm';
import DetailAction from '@/components/karya/DetailAction';
import { showToast } from "@/components/shared/ui/ToastNotification";
import { PostKarya } from '@/components/karya/apiKarya';
import { KaryaItem } from '@/types/karya';

// =============================
// HELPERS
// =============================
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function validate(form: KaryaItem, thumbnailFile: File | null, posterFile: File | null): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.pameranId) errors.pameranId = 'Pameran wajib dipilih.';
  if (!form.booth) errors.booth = 'Stan wajib dipilih.';
  if (!form.title.trim()) errors.title = 'Judul wajib diisi.';
  if (!form.description?.trim()) errors.description = 'Deskripsi wajib diisi.';

  const url = normalizeUrl(form.link ?? '');
  if (!url) {
    errors.link = 'Link YouTube wajib diisi.';
  } else {
    try {
      new URL(url);
    } catch {
      errors.link = 'Link harus URL valid (contoh: https://youtube.com/...).';
    }
  }

  if (!thumbnailFile) errors.thumbnail = 'Gambar sampul wajib diunggah.';
  if (!posterFile) errors.poster = 'Gambar poster wajib diunggah.';

  return errors;
}

function mapLaravelErrors(raw: Record<string, string[]>): Record<string, string> {
  return {
    ...(raw.id_pameran ? { pameranId: raw.id_pameran[0] } : {}),
    ...(raw.id_stan ? { booth: raw.id_stan[0] } : {}),
    ...(raw.judul ? { title: raw.judul[0] } : {}),
    ...(raw.deskripsi ? { description: raw.deskripsi[0] } : {}),
    ...(raw.tautan ? { link: raw.tautan[0] } : {}),
    ...(raw.gambar_sampul ? { thumbnail: raw.gambar_sampul[0] } : {}),
    ...(raw.gambar_poster ? { poster: raw.gambar_poster[0] } : {}),
  };
}

// =============================
// INITIAL STATE
// =============================
const initialForm: KaryaItem = {
  id: 0,
  title: '',
  category: '',
  image: '',
  thumbnail: '',
  year: '',
  semester: '',
  description: '',
  booth: '',
  link: '',
  pameranId: undefined,
};

// =============================
// COMPONENT
// =============================
export default function AddKaryaPage() {
  const router = useRouter();

  const [form, setForm] = useState<KaryaItem>(initialForm);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [posterPreview, setPosterPreview] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [globalError, setGlobalError] = useState('');

  const clearFieldError = (key: string) =>
    setErrors((prev) => {
      const e = { ...prev };
      delete e[key];
      return e;
    });

  const handleChange = (field: keyof KaryaItem, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field as string);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'poster') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === 'thumbnail') {
      setThumbnailPreview(preview);
      setThumbnailFile(file);
      clearFieldError('thumbnail');
    } else {
      setPosterPreview(preview);
      setPosterFile(file);
      clearFieldError('poster');
    }
  };

  const handleSave = async () => {
  const validationErrors = validate(form, thumbnailFile, posterFile);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    showToast("Lengkapi semua data terlebih dahulu.", "warning");
    return;
  }

  setIsLoading(true);
  setErrors({});
  try {
    const formData = new FormData();
    formData.append("id_pameran", String(form.pameranId));
    formData.append("id_model", form.booth ?? "");
    formData.append("judul", form.title.trim());
    formData.append("deskripsi", form.description?.trim() ?? "");
    formData.append("tautan", normalizeUrl(form.link ?? ""));
    formData.append("gambar_sampul", thumbnailFile!);
    formData.append("gambar_poster", posterFile!);

    const result = await PostKarya(formData);

    if (!result.success && result.status !== "success") {
      throw new Error(result.message || "Gagal menambahkan karya");
    }

    showToast("Karya berhasil ditambahkan!", "success");
    window.location.reload();
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 422) {
      const laravelErrors = error.response.data.errors as Record<string, string[]>;
      setErrors(mapLaravelErrors(laravelErrors));
      showToast("Periksa kembali data yang diisi.", "warning");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (status === 409) {
      showToast("Anda sudah mengunggah karya pada pameran ini.", "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (status === 500) {
      setErrors({
        thumbnail: "Server gagal memproses gambar sampul. Coba upload ulang.",
        poster: "Server gagal memproses gambar poster. Coba upload ulang.",
      });
      showToast("Terjadi kesalahan di server (500). Coba simpan lagi.", "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showToast(
        error.response?.data?.message || "Gagal terhubung ke server.",
        "error"
      );
    }
  } finally {
    setIsLoading(false);
  }
};

  // const handleDelete = () => {
  //   setForm(initialForm);
  //   setThumbnailPreview('');
  //   setPosterPreview('');
  //   setThumbnailFile(null);
  //   setPosterFile(null);
  //   setErrors({});
  //   setGlobalError('');
  // };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 py-6">
      <div className="max-w-[1200px] mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-3">
            <DetailThumbnail
              preview={thumbnailPreview}
              onUpload={(e) => handleImageUpload(e, 'thumbnail')}
              error={errors.thumbnail}
            />
            <DetailPoster
              preview={posterPreview}
              onUpload={(e) => handleImageUpload(e, 'poster')}
              error={errors.poster}
            />
          </div>

          <div>
            <DetailPreview
              booth={form.booth ?? ''}
              pameranId={form.pameranId}
              onChange={(value) => handleChange('booth', value)}
              error={errors.booth}
            />
            <DetailForm form={form} onChange={handleChange} errors={errors} />
            <DetailAction onSave={handleSave} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
