'use client';

import { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
// types
import { PameranForm, PRODI_OPTIONS } from '@/types/pameran';
import FormPameran from './FormPameran';

export default function AddPameran() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  // DATA
  const [form, setForm] = useState<PameranForm>({
    prodi: '',
    title: '',
    publishDate: '',
    endDate: '',
    prepareStart: '',
    prepareEnd: '',
    description: '',
    image: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      prodi: '',
      title: '',
      publishDate: '',
      endDate: '',
      prepareStart: '',
      prepareEnd: '',
      description: '',
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
      alert('Lengkapi semua data terlebih dahulu.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
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

      /* POST API add pameran  */
      const res = await fetch('/api/pameran', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert('Pameran berhasil ditambahkan!');
        const newId = data.data.id;
        resetForm();

        router.push(`/admin/pameran/${newId}`);
      } else {
        alert('Gagal menambahkan pameran.');
      }
    } catch (error) {
      console.log(error);

      alert('Terjadi kesalahan.');
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
