import url from '@/lib/axios';

// =============================
// DAFTAR KARYA MILIK KETUA PBL
// =============================
export async function GetKarya() {
  const res = await url.get('/api/ketua-pbl/karya');
  return res.data;
}

// // =============================
// // DETAIL SATU KARYA BY ID       ← baru, dipakai di EditKarya
// // =============================
// export async function GetKaryaById(id: number) {
//   const res = await url.get(`/api/ketua-pbl/karya/${id}`);
//   return res.data; // { status, karya: {...} }
// }

// =============================
// TAMBAH KARYA
// =============================
export async function PostKarya(formData: FormData) {
  const res = await url.post('/api/ketua-pbl/karya', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// =============================
// EDIT KARYA
// =============================
export async function UpdateKarya(id: number, formData: FormData) {
  const res = await url.post(`/api/ketua-pbl/karya/${id}/update`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// =============================
// PAMERAN TERSEDIA
// =============================
export async function GetPameranTersedia() {
  try {
    const res = await url.get('/api/ketua-pbl/pameran-tersedia');
    return res.data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      const res = await url.get('/api/ketua-pbl/pameran');
      return res.data;
    }
    throw err;
  }
}

// =============================
// STAN TERSEDIA
// =============================
export async function GetStanTersedia(id_pameran: number) {
  const res = await url.get(`/api/ketua-pbl/stan/${id_pameran}`);
  return res.data;
}

// =============================
// KPS
// =============================
export async function GetKaryaKps() {
  const res = await url.get('/api/kps/karya');
  return res.data;
}

export async function PilihTerbaik(id_karya: number) {
  const res = await url.patch(`/api/kps/karya/${id_karya}/terbaik`);
  return res.data;
}

export async function BatalkanTerbaik(id_karya: number) {
  const res = await url.patch(`/api/kps/karya/${id_karya}/batalkan`);
  return res.data;
}

// =============================
// HAPUS KARYA (ADMIN ONLY)
// =============================
export async function DeleteKarya(id: number) {
  const res = await url.delete(`/api/admin/karya/${id}`);
  return res.data;
}
