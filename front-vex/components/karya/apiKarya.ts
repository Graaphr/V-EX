import url from "@/lib/axios";

// =============================
// DAFTAR KARYA MILIK KETUA PBL
// =============================
export async function GetKarya() {
  const res = await url.get("/api/ketua-pbl/karya"); // ✅ fix: /api/karya tidak ada
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
  const res = await url.post(`/api/ketua-pbl/karya/${id}/update`, formData, { // ✅ fix
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// =============================
// PAMERAN TERSEDIA (TAHAP PERSIAPAN, SESUAI PRODI)
// =============================
export async function GetPameranTersedia() {
  const res = await url.get("/api/ketua-pbl/pameran-tersedia");
  return res.data;
}

// =============================
// STAN KARYA
// =============================
export async function GetStanTersedia(id_pameran: number) {
  const res = await url.get(`/api/ketua-pbl/stan/${id_pameran}`);
  return res.data;
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
// HAPUS KARYA (ADMIN ONLY)
// =============================
export async function DeleteKarya(id: number) {
  const res = await url.delete(`/api/admin/karya/${id}`); // ✅ fix: sesuai role:Admin di api.php
  return res.data;
}