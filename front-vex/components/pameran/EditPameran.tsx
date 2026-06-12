'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PameranForm } from '@/types/pameran';
import FormPameran from './FormPameran';
import { GetDetailPameran, UpdatePameran } from './apiPameran';
import { showToast } from '@/components/shared/ui/ToastNotification';

type FormErrors = Partial<Record<keyof PameranForm | 'image', string>>;

export default function EditPameran() {
  const params = useParams();
  const router = useRouter();
  const id = Number(Array.isArray(params?.id) ? params.id[0] : params?.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<PameranForm>({
    prodi: '',
    title: '',
    capacity: 24,
    publishDate: '',
    endDate: '',
    prepareStart: '',
    prepareEnd: '',
    description: '',
    image: null,
  });

  const toInputDate = (value?: string) => {
    if (!value) return '';
    if (value.includes('/')) {
      const [day, month, year] = value.split('/');
      return `${year}-${month}-${day}`;
    }
    return value.split('T')[0];
  };

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setFetching(true);
        const res = await GetDetailPameran(id);

        if (res.status !== 'success' || !res.pameran) {
          setNotFound(true);
          return;
        }

        const p = res.pameran;

        setForm({
          prodi: p.kode_prodi || '',
          title: p.title || '',
          capacity: p.stats?.kapasitas ?? 24,
          publishDate: toInputDate(p.stats?.startDate),
          endDate: toInputDate(p.stats?.endDate),
          prepareStart: toInputDate(p.stats?.prepareStartDate),
          prepareEnd: toInputDate(p.stats?.prepareEndDate),
          description: p.description?.[0]?.content || '',
          image: null,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));

    if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.prodi) newErrors.prodi = 'Program studi wajib dipilih';
    if (!form.title) newErrors.title = 'Judul pameran wajib diisi';
    if (!form.publishDate) newErrors.publishDate = 'Tanggal mulai wajib diisi';
    if (!form.endDate) newErrors.endDate = 'Tanggal berakhir wajib diisi';
    if (!form.prepareStart) newErrors.prepareStart = 'Tanggal persiapan mulai wajib diisi';
    if (!form.prepareEnd) newErrors.prepareEnd = 'Tanggal persiapan berakhir wajib diisi';
    if (!form.description) newErrors.description = 'Deskripsi wajib diisi';
    // Image tidak wajib di edit (boleh tetap pakai gambar lama)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showToast('Lengkapi semua data terlebih dahulu.', 'warning');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('kategori', form.prodi);
      formData.append('judul', form.title);
      formData.append('kapasitas', String(form.capacity));
      formData.append('tanggal_mulai', form.publishDate);
      formData.append('tanggal_akhir', form.endDate);
      formData.append('tanggal_mulai_persiapan', form.prepareStart);
      formData.append('tanggal_akhir_persiapan', form.prepareEnd);
      formData.append('deskripsi', form.description);
      if (form.image) formData.append('banner', form.image);

      const data = await UpdatePameran(id, formData);

      if (data.status === 'success') {
        showToast('Pameran berhasil diupdate!', 'success');
        router.push(`/admin/pameran/detail/${id}`);
      } else {
        showToast('Gagal mengupdate pameran.', 'error');
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 422) {
          const laravelErrors = data.errors as Record<string, string[]>;
          const fieldMap: Record<string, keyof FormErrors> = {
            kategori: 'prodi',
            judul: 'title',
            kapasitas: 'capacity',
            tanggal_mulai: 'publishDate',
            tanggal_akhir: 'endDate',
            tanggal_mulai_persiapan: 'prepareStart',
            tanggal_akhir_persiapan: 'prepareEnd',
            deskripsi: 'description',
            banner: 'image',
          };

          const mappedErrors: FormErrors = {};
          if (laravelErrors) {
            Object.entries(laravelErrors).forEach(([key, messages]) => {
              const fieldKey = fieldMap[key];
              if (fieldKey) mappedErrors[fieldKey] = messages[0];
            });
          }

          setErrors(mappedErrors);
          showToast('Periksa kembali data yang diisi.', 'error');
        } else if (status === 404) {
          showToast(data.message ?? 'Data tidak ditemukan.', 'error');
        } else if (status === 500) {
          showToast('Terjadi kesalahan pada server.', 'error');
        } else {
          showToast(`Terjadi kesalahan (${status}).`, 'error');
        }

        console.error('STATUS:', status);
        console.error('DATA:', JSON.stringify(data, null, 2));
      } else {
        showToast('Tidak dapat terhubung ke server.', 'error');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="min-h-screen bg-secondary-color flex items-center justify-center">
        <p className="text-white">Memuat data pameran...</p>
      </div>
    );

  if (notFound)
    return (
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
          errors={errors}
          onChangeImage={handleImage}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
}
