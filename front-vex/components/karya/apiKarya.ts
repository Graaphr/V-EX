import url from '@/lib/axios';

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
    const res = await url.post("/api/karya/add", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

// =============================
// EDIT KARYA
// =============================
export async function UpdateKarya(id: number, formData: FormData) {
    const res = await url.post(`/api/karya/${id}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

// =============================
// HAPUS KARYA
// =============================
export async function DeleteKarya(id: number) {
    const res = await url.delete(`/api/karya/${id}`);
    return res.data;
}