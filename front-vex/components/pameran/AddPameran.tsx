"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PameranForm } from "@/types/pameran";
import FormPameran from "./FormPameran";
import { PostPameran } from "./apiPameran";
import { showToast } from "@/components/shared/ui/ToastNotification";

type FormErrors = Partial<Record<keyof PameranForm | "image", string>>;

export default function AddPameran() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<PameranForm>({
    prodi: "",
    title: "",
    capacity: 24,
    publishDate: "",
    endDate: "",
    prepareStart: "",
    prepareEnd: "",
    description: "",
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Hapus error field yang sedang diubah
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
    // Hapus error image
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const resetForm = () => {
    setForm({
      prodi: "",
      title: "",
      capacity: 24,
      publishDate: "",
      endDate: "",
      prepareStart: "",
      prepareEnd: "",
      description: "",
      image: null,
    });
    setPreview(null);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.image) newErrors.image = "Thumbnail wajib diupload";
    if (!form.prodi) newErrors.prodi = "Program studi wajib dipilih";
    if (!form.title) newErrors.title = "Judul pameran wajib diisi";
    if (!form.publishDate) newErrors.publishDate = "Tanggal mulai wajib diisi";
    if (!form.endDate) newErrors.endDate = "Tanggal berakhir wajib diisi";
    if (!form.prepareStart) newErrors.prepareStart = "Tanggal persiapan mulai wajib diisi";
    if (!form.prepareEnd) newErrors.prepareEnd = "Tanggal persiapan berakhir wajib diisi";
    if (!form.description) newErrors.description = "Deskripsi wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showToast("Lengkapi semua data terlebih dahulu.", "warning");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("category", form.prodi);
      formData.append("title", form.title);
      formData.append("capacity", String(form.capacity));
      formData.append("start_date", form.publishDate);
      formData.append("end_date", form.endDate);
      formData.append("prepare_start", form.prepareStart);
      formData.append("prepare_end", form.prepareEnd);
      formData.append("description", form.description);
      if (form.image) formData.append("banner", form.image);

      const data = await PostPameran(formData);

      if (data.status === "success") {
        showToast("Pameran berhasil ditambahkan!", "success");
        const newSlug = data.pameran?.slug;
        router.push(`/admin/pameran/detail/${newSlug}`);
      } else {
        showToast("Gagal menambahkan pameran.", "error");
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 422) {
          // Kembalikan error validasi Laravel ke masing-masing field
          const laravelErrors = data.errors as Record<string, string[]>;
          const fieldMap: Record<string, keyof FormErrors> = {
            category: "prodi",
            title: "title",
            capacity: "capacity",
            start_date: "publishDate",
            end_date: "endDate",
            prepare_start: "prepareStart",
            prepare_end: "prepareEnd",
            description: "description",
            banner: "image",
          };

          const mappedErrors: FormErrors = {};
          Object.entries(laravelErrors).forEach(([key, messages]) => {
            const fieldKey = fieldMap[key];
            if (fieldKey) mappedErrors[fieldKey] = messages[0];
          });

          setErrors(mappedErrors);
          showToast("Periksa kembali data yang diisi.", "error");
        } else if (status === 404) {
          showToast(data.message ?? "Data tidak ditemukan.", "error");
        } else if (status === 500) {
          showToast(data.message ?? "Terjadi kesalahan pada server.", "error");
        } else {
          showToast(`Error ${status}: ${data.message ?? "Terjadi kesalahan."}`, "error");
        }
      } else {
        showToast("Tidak dapat terhubung ke server.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-color select-none pb-20 md:pb-30">
      <section className="autoMid">
        <FormPameran
          form={form}
          preview={preview}
          loading={loading}
          errors={errors}
          onChangeImage={handleImage}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
}