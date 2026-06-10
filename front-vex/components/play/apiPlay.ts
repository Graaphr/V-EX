import api from "@/lib/axios";

export async function get3DModel(modelId: number) {
    const res = await api.get(`/api/3d-models/${modelId}`)
    return res.data
}