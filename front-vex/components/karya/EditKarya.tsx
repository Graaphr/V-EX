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
              // ✅ fix: pakai pameranTitle asli dari API jika ada, fallback ke generik
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
    if (!form) return;
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

      const result = await UpdateKarya(form.id, formData);

      if (result.status !== "success") {
        throw new Error(result.message || "Gagal memperbarui karya");
      }

      router.push("/ketua-pbl/karya");
    } catch (err: any) {
      if (err.response?.status === 422) {
        console.error("Validation errors:", err.response.data.errors);
      }
      console.error("Gagal menyimpan karya:", err);
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
            <DetailForm
              form={form}
              onChange={handleChange}
              currentPameran={currentPameran}
            />
            <DetailAction onSave={handleSave} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
