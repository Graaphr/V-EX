import url from "@/lib/axios";

// =============================
// DAFTAR KARYA MILIK KETUA PBL
// =============================
export async function GetKarya() {
  const res = await url.get("/api/karya");
  return res.data;
}

// =============================
// TAMBAH KARYA
// =============================
export async function PostKarya(formData: FormData) {
  const res = await url.post("/api/ketua-pbl/karya", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// =============================
// EDIT KARYA
// =============================
export async function UpdateKarya(id: number, formData: FormData) {
  const res = await url.post(`/api/karya/${id}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// =============================
// PAMERAN TERSEDIA (TAHAP PERSIAPAN, SESUAI PRODI)
// =============================
export async function GetPameranTersedia() {
  const res = await url.get("/api/ketua-pbl/pameran-tersedia");
  return res.data; // { status, pameran: [{ id, title }] }
}

// =============================
// STAN KARYA
// =============================
export async function GetStanTersedia(id_pameran: number) {
    const res = await url.get(`/api/ketua-pbl/stan/${id_pameran}`);
    return res.data; // { status, stan: [{ id, model_stan }] }
}

// =============================
// KPS - DAFTAR KARYA PER PRODI
// =============================
export async function GetKaryaKps() {
    const res = await url.get("/api/kps/karya");
    return res.data;
}

// =============================
// KPS - PILIH KARYA TERBAIK
// =============================
export async function PilihTerbaik(id_karya: number) {
    const res = await url.patch(`/api/kps/karya/${id_karya}/terbaik`);
    return res.data;
}

// =============================
// KPS - BATALKAN KARYA TERBAIK
// =============================
export async function BatalkanTerbaik(id_karya: number) {
    const res = await url.patch(`/api/kps/karya/${id_karya}/batalkan`);
    return res.data;
}

// =============================
// HAPUS KARYA
// =============================
export async function DeleteKarya(id: number) {
  const res = await url.delete(`/api/karya/${id}`);
  return res.data;
}
