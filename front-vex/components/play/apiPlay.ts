import url from "@/lib/axios";

// ── yang sudah ada ──
export async function get3DModel(modelId: number) {
    const res = await url.get(`/api/experience/3d-models/${modelId}`)
    return res.data
}

// ── experience.tsx ──
export async function getHallModel(exhibitionId: string) {
    const res = await url.get(`/api/experience/3d-models/${exhibitionId}`)
    return res.data.model_hall
}

export async function getKaryaList(exhibitionId: string) {
    const res = await url.get(`/api/experience/karya/pameran/${exhibitionId}`)
    return { karya: res.data.karya ?? res.data, max_floor: res.data.max_floor ?? {} }
}

export async function getPameranFolder(exhibitionId: string) {
    const res = await url.get(`/api/pameran/${exhibitionId}`)
    const kategori = res.data.pameran?.kode_prodi ?? "default"
    return kategori.toLowerCase().replaceAll(" ", "-")
}

export async function getGameAssets() {
    const res = await url.get("/api/experience/game-assets")
    return res.data
}

// ── page.tsx (ExhibitionPage) ──
export async function getPlayerName() {
    const res = await url.get("/api/player-name")
    return res.data.name as string
}

export async function deletePlayer(playerId: string) {
    await url.delete(`/api/player?id=${playerId}`)
}

// ── PosterViewer ──
export async function getKaryaDetail(exhibitionId: string) {
    const res = await url.get(`/api/experience/karya/pameran/${exhibitionId}`)
    return res.data as any[]
}

export async function getKaryaLikeStatus(karyaId: number, token?: string) {
    const res = await url.get(`/api/karya/${karyaId}/suka`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    return res.data as { liked: boolean; total_suka: number }
}

export async function toggleKaryaLike(karyaId: number, token: string) {
    const res = await url.post(`/api/karya/${karyaId}/suka`, null, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.data as { liked: boolean; total_suka: number }
}

export async function getKomentar(karyaId: number) {
    const res = await api.get(`/api/karya/${karyaId}/komentar`)
    const raw = Array.isArray(res.data) ? res.data : (res.data.komentar ?? [])
    return raw.map((k: any) => ({
        nama: k.pengguna?.nama ?? k.nama ?? "Anonim",
        isi: k.isi_komentar ?? k.isi ?? "",
    })) as { nama: string; isi: string }[]
}

export async function postKomentar(karyaId: number, isi: string, token: string) {
    const res = await api.post(
        `/api/karya/${karyaId}/komentar`,
        { isi_komentar: isi },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return res.data
}