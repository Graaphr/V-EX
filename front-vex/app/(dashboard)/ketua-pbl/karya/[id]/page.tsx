"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, ButtonPutih } from "@/components/ui/Button";

type Karya = {
  id: number;
  title: string;
  image: string;
  link: string
  description: string;
  thumbnail: string;
  booth: string;
  pameranId: string;
};

export default function Page() {
  const { id } = useParams();

  const [form, setForm] = useState<Karya | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [posterPreview, setPosterPreview] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/data/karya.json");
      const json = await res.json();

      const found = json.find(
        (item: Karya) => item.id === Number(id)
      );

      if (found) {
        setForm(found);
        setThumbnailPreview(found.thumbnail);
        setPosterPreview(found.image);
      }
    };

    load();
  }, [id]);

  const handleChange = (field: keyof Karya, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "poster"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (type === "thumbnail") setThumbnailPreview(url);
    if (type === "poster") setPosterPreview(url);
  };

  if (!form) return <div className="p-6">Loading...</div>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 py-6">
      <div className="max-w-[1200px] mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* LEFT */}
          <div className="space-y-6">

            {/* Thumbnail */}
            <div>
              <p className="mb-2 font-medium">Thumbnail</p>

              <label className="border rounded-xl h-[240px] flex items-center justify-center cursor-pointer overflow-hidden">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-gray-400">Upload</span>
                )}

                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(e, "thumbnail")
                  }
                />
              </label>

              <p className="text-xs text-gray-500 mt-1">
                PNG/JPG, rasio 16:9
              </p>
            </div>

            {/* Poster */}
            <div>
              <p className="mb-2 font-medium">Poster</p>

              <label className="border rounded-xl h-[520px] flex items-center justify-center cursor-pointer overflow-hidden">
                {posterPreview ? (
                  <img
                    src={posterPreview}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-gray-400">Upload</span>
                )}

                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(e, "poster")
                  }
                />
              </label>

              <p className="text-xs text-gray-500 mt-1">
                PNG/JPG, rasio 9:16
              </p>
            </div>
          </div>

          {/* MIDDLE (PREVIEW) */}
          <div className="space-y-4">
            <p className="mb-2 font-medium">Preview</p>

            <div className="bg-black rounded-xl w-full max-w-[420px] h-[260px] mx-auto flex items-center justify-center overflow-hidden">
              <img
                src={`/image/${form.booth}`}
                alt="booth"
                className="h-full object-contain p-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/image/img-stan1.svg";
                }}
              />
            </div>

            {/* Stan */}
            <div>
              <label className="mb-2 font-medium">Stan</label>
              <select
                value={form.booth}
                onChange={(e) =>
                  handleChange("booth", e.target.value)
                }
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="img-stan1.svg">Booth 1</option>
                <option value="img-stan2.svg">Booth 2</option>
                <option value="img-stan3.svg">Booth 3</option>
              </select>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            {/* Pameran */}
            <div>
              <label className="mb-2 font-medium">Pameran</label>
              <select
                value={form.pameranId}
                onChange={(e) =>
                  handleChange("pameranId", e.target.value)
                }
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="1">TRPL EXPO</option>
                <option value="2">ANIMOTION FEST 2026</option>
                <option value="3">MULTIMEDIA CREATIVE EXPO</option>
                <option value="4">GEOMATIKA DIGITAL MAP</option>
                <option value="5">CYBER DEFENSE EXPO 2026</option>
                <option value="6">IOT SMART CITY EXPO</option>
                <option value="7">GAME TECHNOLOGY FEST 2026</option>
              </select>
            </div>

            {/* Judul */}
            <div>
              <label className="mb-2 font-medium">Judul</label>
              <input
                value={form.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            {/* Youtube */}
            <div>
              <label className="mb-2 font-medium">Link Youtube</label>
              <input
                value={form.link || ""}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="Masukkan link Youtube"
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="mb-2 font-medium">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  handleChange(
                    "description",
                    e.target.value
                  )
                }
                className="w-full border rounded-lg p-2 mt-1 h-[180px]"
              />
            </div>

            {/* Button */}
            <div className="flex justify-end gap-4 pt-4">

              <ButtonPutih
                className="px-4 py-2 rounded-lg"
                onClick={() => {
                  console.log("Hapus data", form.id);
                }}
              >
                Hapus
              </ButtonPutih>

              <Button
                className="px-4 py-2 rounded-lg"
                onClick={() => {
                  console.log("Simpan data", form);
                }}
              >
                Simpan
              </Button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}