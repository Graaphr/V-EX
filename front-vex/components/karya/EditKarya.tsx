'use client';

import { useEffect, useState } from 'react';
import DetailThumbnail from '@/components/karya/DetailThumbnail';
import DetailPoster from '@/components/karya/DetailPoster';
import DetailPreview from '@/components/karya/DetailPreview';
import DetailForm from '@/components/karya/DetailForm';
import DetailAction from '@/components/karya/DetailAction';
import { KaryaItem } from '@/types/karya';

interface Props {
  id: number;
}

export default function EditKarya({ id }: Props) {
  const [form, setForm] = useState<KaryaItem | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [posterPreview, setPosterPreview] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/data/Karya.json');
      const json = await res.json();
      const found = json.find((item: KaryaItem) => item.id === id);

      if (found) {
        setForm(found);
        setThumbnailPreview(found.thumbnail);
        setPosterPreview(found.image);
      }
    };

    load();
  }, [id]);

  const handleChange = (field: keyof KaryaItem, value: string | number) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'poster') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'thumbnail') setThumbnailPreview(url);
    if (type === 'poster') setPosterPreview(url);
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div>
            <DetailForm form={form} onChange={handleChange} />
          </div>

          <div className="space-y-3">
            <DetailThumbnail preview={thumbnailPreview} onUpload={(e) => handleImageUpload(e, 'thumbnail')} />
            <DetailPoster preview={posterPreview} onUpload={(e) => handleImageUpload(e, 'poster')} />
          </div>

          <div>
            <DetailPreview booth={form.booth} onChange={(value) => handleChange('booth', value)} />
            <DetailAction onDelete={() => console.log('hapus', form.id)} onSave={() => console.log('simpan', form)} />
          </div>
        </div>
      </div>
    </div>
  );
}
