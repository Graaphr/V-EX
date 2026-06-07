"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PameranForm, PRODI_OPTIONS } from "@/types/pameran";
import FormPameran from "./FormPameran";
import { GetDetailPameran, UpdatePameran } from "./apiPameran";

export default function EditPameran() {
  const params = useParams();
  const router = useRouter();
  const id = Number(Array.isArray(params?.id) ? params.id[0] : params?.id);

  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [preview, setPreview]   = useState<string | null>(null);

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

  // Handle format "2024-12-31T00:00:00" → "2024-12-31"
  const toInputDate = (value?: string) => {
    if (!value) return "";
    if (value.includes("/")) {
      const [day, month, year] = value.split("/");
      return `${year}-${month}-${day}`;
    }
    return value.split("T")[0];
  };

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setFetching(true);
        const res = await GetDetailPameran(id);

        if (res.status !== "success" || !res.pameran) {
          setNotFound(true);
          return;
        }

        const p = res.pameran;

        // Cari nama prodi berdasarkan category dari API
        // category berisi nama_prodi, langsung pakai untuk value dropdown
        // const namaProdi = p.category || "";

        setForm({
          prodi:        p.kode_prodi || "",
          title:        p.title || "",
          capacity:     p.stats?.kapasitas ?? 0,
          publishDate:  toInputDate(p.stats?.startDate),
          endDate:      toInputDate(p.stats?.endDate),
          prepareStart: toInputDate(p.stats?.prepareStartDate),
          prepareEnd:   toInputDate(p.stats?.prepareEndDate),
          description:  p.description?.[0]?.content || "",
          image:        null,
        });

        setPreview(p.bannerImage || null);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.publishDate || !form.endDate ||
        !form.prepareStart || !form.prepareEnd || !form.description) {
      alert("Lengkapi semua data terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      // formData.append("_method", "PUT");           // Laravel method spoofing
      formData.append("kategori", form.prodi);     // nama_prodi langsung
      formData.append("judul", form.title);
      formData.append("kapasitas", String(form.capacity));
      formData.append("tanggal_mulai", form.publishDate);
      formData.append("tanggal_akhir", form.endDate);
      formData.append("tanggal_mulai_persiapan", form.prepareStart);
      formData.append("tanggal_akhir_persiapan", form.prepareEnd);
      formData.append("deskripsi", form.description);
      if (form.image) formData.append("banner", form.image);

      const data = await UpdatePameran(id, formData);

      if (data.status === "success") {
        alert("Pameran berhasil diupdate!");
        router.push(`/admin/pameran/detail/${id}`);
      } else {
        alert("Gagal update pameran.");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("DATA:", JSON.stringify(error.response.data, null, 2));
      }
      alert("Terjadi kesalahan saat update.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-secondary-color flex items-center justify-center">
      <p className="text-white">Memuat data pameran...</p>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-secondary-color flex items-center justify-center">
      <p className="text-white">Data pameran tidak ditemukan.</p>
    </div>
  );

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