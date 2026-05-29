'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// COMPONENTS
import DetailThumbnail from '@/components/dashboard/admin/karya/DetailThumbnail';
import DetailPoster from '@/components/dashboard/admin/karya/DetailPoster';
import DetailPreview from '@/components/dashboard/admin/karya/DetailPreview';
import DetailForm from '@/components/dashboard/admin/karya/DetailForm';
import DetailAction from '@/components/dashboard/admin/karya/DetailAction';
// TYPES
import { KaryaItem } from '@/types/karya';

const initialForm: KaryaItem = {
  id: 0,
  title: '',
  category: '',
  image: '',
  thumbnail: '',
  year: '',
  semester: '',
  description: '',
  booth: 'img-stan1.svg',
  link: '',
  pameranId: 1,
  // exhibitionId: 0,
};

export default function AddKaryaPage() {
  const router = useRouter();
  const [form, setForm] = useState<KaryaItem>(initialForm);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [posterPreview, setPosterPreview] = useState('');

  const handleChange = (field: keyof KaryaItem, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'poster') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'thumbnail') {
      setThumbnailPreview(url);
      setThumbnailFile(file);
    }
    if (type === 'poster') {
      setPosterPreview(url);
      setPosterFile(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category ?? '');
      formData.append('year', form.year ?? '');
      formData.append('semester', form.semester ?? '');
      formData.append('description', form.description ?? '');
      formData.append('booth', form.booth ?? '');
      formData.append('link', form.link ?? '');
      formData.append('pameranId', String(form.pameranId));

      // Ambil file dari input jika ada
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      if (posterFile) formData.append('image', posterFile);

      const res = await fetch('/api/karya', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      router.push('/ketua-pbl/karya');
    } catch (error) {
      console.error('Gagal simpan:', error);
    }
  };

  const handleDelete = () => {
    setForm(initialForm);
    setThumbnailPreview('');
    setPosterPreview('');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 py-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* KIRI - Form */}
          <div>
            <DetailForm form={form} onChange={handleChange} />
          </div>

          {/* TENGAH - Upload */}
          <div className="space-y-3">
            <DetailThumbnail preview={thumbnailPreview} onUpload={(e) => handleImageUpload(e, 'thumbnail')} />
            <DetailPoster preview={posterPreview} onUpload={(e) => handleImageUpload(e, 'poster')} />
          </div>

          {/* KANAN - Preview & Action */}
          <div>
            <DetailPreview booth={form.booth} onChange={(value) => handleChange('booth', value)} />
            <DetailAction onDelete={handleDelete} onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
}
