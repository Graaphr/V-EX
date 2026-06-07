import url from '@/lib/axios';
import { PameranForm } from '@/types/pameran';

export async function GetPameran() {
    const res = await url.get("/api/pameran");
    return res.data
}

export async function GetDetailPameran(id : number) {
    const res = await url.get(`/api/pameran/${id}`);
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