"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DetailThumbnail from "@/components/karya/DetailThumbnail";
import DetailPoster from "@/components/karya/DetailPoster";
import DetailPreview from "@/components/karya/DetailPreview";
import DetailForm from "@/components/karya/DetailForm";
import DetailAction from "@/components/karya/DetailAction";

import { PostKarya } from "@/components/karya/apiKarya";
import { KaryaItem } from "@/types/karya";

const initialForm: KaryaItem = {
  id: 0,
  title: "",
  category: "",
  image: "",
  thumbnail: "",
  year: "",
  semester: "",
  description: "",
  booth: "", // ✅ fix: jangan hardcode nama file SVG (booth = id_stan)
  link: "",
  pameranId: undefined, // ✅ fix: jangan hardcode 1, user wajib pilih
};

export default function AddKaryaPage() {
  const router = useRouter();

  const [form, setForm] = useState<KaryaItem>(initialForm);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [posterPreview, setPosterPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof KaryaItem, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    }
    if (type === "poster") {
      setPosterPreview(preview);
      setPosterFile(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("id_pameran", String(form.pameranId ?? ""));
      formData.append("id_stan", form.booth ?? "");
      formData.append("judul", form.title);
      formData.append("deskripsi", form.description ?? "");
      formData.append("tautan", form.link ?? "");
      if (thumbnailFile) formData.append("gambar_sampul", thumbnailFile);
      if (posterFile) formData.append("gambar_poster", posterFile);

      const result = await PostKarya(formData);

      if (!result.success && result.status !== "success") {
        throw new Error(result.message || "Gagal menambahkan karya");
      }

      router.push("/ketua-pbl/karya");
    } catch (error: any) {
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.errors);
      }
      console.error("Gagal menyimpan karya:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setForm(initialForm);
    setThumbnailPreview("");
    setPosterPreview("");
    setThumbnailFile(null);
    setPosterFile(null);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 py-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-3">
            <DetailThumbnail
              preview={thumbnailPreview}
              onUpload={(e) => handleImageUpload(e, "thumbnail")}
            />
            <DetailPoster
              preview={posterPreview}
              onUpload={(e) => handleImageUpload(e, "poster")}
            />
          </div>

          <div>
            <DetailPreview
              booth={form.booth}
              pameranId={form.pameranId}
              onChange={(value) => handleChange("booth", value)}
            />
            <DetailForm form={form} onChange={handleChange} />
            <DetailAction
              onDelete={handleDelete}
              onSave={handleSave}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
