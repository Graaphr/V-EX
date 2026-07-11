import url from '@/lib/axios';

export async function GetPameran() {
    const res = await url.get("/api/pameran");
    return res.data
}

export async function GetDetailPameran(slug: string) {
    const res = await url.get(`/api/pameran/${slug}`);
    return res.data
}

export async function PostPameran(formData: FormData) {
    const res = await url.post(`/api/admin/pameran/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function UpdatePameran(id: number, formData: FormData) {
    const res = await url.post(`/api/admin/pameran/${id}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}