"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// types
import { PameranForm } from "@/types/pameran";
import FormPameran from "./FormPameran";
import { PostPameran } from "./apiPameran";

export default function AddPameran() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  // DATA
  const [form, setForm] = useState<PameranForm>({
    prodi: "",
    title: "",
    capacity: 0,
    publishDate: "",
    endDate: "",
    prepareStart: "",
    prepareEnd: "",
    description: "",
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({
      prodi: "",
      title: "",
      capacity: 0,
      publishDate: "",
      endDate: "",
      prepareStart: "",
      prepareEnd: "",
      description: "",
      image: null,
    });

    setPreview(null);
  };


  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.publishDate ||
      !form.endDate ||
      !form.prepareStart ||
      !form.prepareEnd ||
      !form.description
    ) {
      alert("Lengkapi semua data terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("category", form.prodi); // sesuai validate Laravel
      formData.append("title", form.title);
      formData.append("capacity", String(form.capacity));
      formData.append("start_date", form.publishDate);
      formData.append("end_date", form.endDate);
      formData.append("prepare_start", form.prepareStart);
      formData.append("prepare_end", form.prepareEnd);
      formData.append("description", form.description);
      if (form.image) formData.append("banner", form.image); // sesuai validate Laravel

      console.log("TOKEN:", localStorage.getItem("token"));
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const data = await PostPameran(formData); // ← langsung dapat data, tidak perlu .json()

      if (data.status === "success") {
        alert("Pameran berhasil ditambahkan!");
        const newId = data.pameran?.id_pameran;
        router.push(`/admin/pameran/detail/${newId}`);
      } else {
        alert("Gagal menambahkan pameran.");
      }
    } catch (error: any) {
      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
        console.log(JSON.stringify(error.response.data, null, 2));
      }

      alert("Terjadi kesalahan.");
      
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
          onChangeImage={handleImage}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
}
