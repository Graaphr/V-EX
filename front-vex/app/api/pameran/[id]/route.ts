import { NextResponse } from "next/server";
import url from "@/lib/axios";

/* ===================== */
/* GET /api/pameran/[id] */
/* ===================== */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const response = await url.get(`/api/pameran/${id}`);
    const item = response.data.pameran;

    const transformed = {
      id: item.id_pameran,
      title: item.judul,
      subtitle: item.prodi?.nama_prodi ?? item.kategori,
      category: item.prodi?.nama_prodi ?? item.kategori,
      date: item.tanggal_mulai,
      bannerImage: `http://localhost:8000/storage/${item.banner}`,
      likes: 0,
      karya: 0,
      description: [
        {
          title: "Deskripsi",
          content: item.deskripsi,
        },
      ],
      stats: {
        likes: 0,
        karya: 0,
        prepareStartDate: item.tanggal_mulai_persiapan,
        prepareEndDate: item.tanggal_akhir_persiapan,
        startDate: item.tanggal_mulai, // format: YYYY-MM-DD dari Laravel
        endDate: item.tanggal_akhir, // format: YYYY-MM-DD dari Laravel
        studyLevel: item.prodi?.nama_prodi ?? item.kategori,
      },
      institution: "Politeknik Negeri Batam",
    };

    return NextResponse.json({ status: "success", pameran: transformed });
  } catch (error: any) {

    const status = error.response?.status ?? 500;
    const message = error.response?.data?.message ?? error.message;

    return NextResponse.json({ status: "error", message }, { status });
  }
}
