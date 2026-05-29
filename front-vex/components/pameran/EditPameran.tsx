'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Pameran, PameranForm, ProdiOption } from '@/types/pameran';
import FormPameran from './FormPameran';
import ALL_EXHIBITIONS from '@/public/data/Pameran.json';

export default function EditPameran() {
  const params = useParams();
  const router = useRouter();

  const id = Number(Array.isArray(params?.id) ? params.id[0] : params?.id);
  const data = (ALL_EXHIBITIONS as Pameran[]).find((item) => item.id === id);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<PameranForm>({
    prodi: '',
    title: '',
    publishDate: '',
    endDate: '',
    prepareStart: '',
    prepareEnd: '',
    description: '',
    image: null as File | null,
  });

  const toInputDate = (value?: string) => {
    if (!value) return '';

    const [day, month, year] = value.split('/');

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!data) return;

    setForm({
      prodi: (data.stats?.studyLevel as ProdiOption) || '',
      title: data.title || '',
      publishDate: toInputDate(data.stats?.startDate),
      endDate: toInputDate(data.stats?.endDate),
      prepareStart: toInputDate(data.stats?.prepareStartDate),
      prepareEnd: toInputDate(data.stats?.prepareEndDate),
      description: data.description?.[0]?.content || '',
      image: null,
    });

    setPreview(data.bannerImage);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'prodi' ? (value as ProdiOption) : value,
    }));
  };

  const handleImage = (e: any) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('id', String(id));
      formData.append('prodi', form.prodi);
      formData.append('title', form.title);
      formData.append('publishDate', form.publishDate);
      formData.append('endDate', form.endDate);
      formData.append('prepareStart', form.prepareStart);
      formData.append('prepareEnd', form.prepareEnd);
      formData.append('description', form.description);

      if (form.image) {
        formData.append('image', form.image);
      }

      const res = await fetch('/api/pameran', {
        method: 'PUT',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        alert('Pameran berhasil diupdate!');

        router.push('/admin/pameran');

        router.refresh();
      } else {
        alert('Gagal update.');
      }
    } catch (error) {
      console.log(error);

      alert('Terjadi error.');
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return <div className="p-10">Data tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-secondary-color select-none pb-20 md:pb-30">
      <section className="autoMid ">
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
