import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Pameran } from "@/types/pameran";
import url from "@/lib/axios";

const jsonPath = path.join(process.cwd(), "public/data/Pameran.json");
const imageDir = path.join(process.cwd(), "public/image");
const uploadDir = path.join(process.cwd(), "public/uploads");

/* ===================== */
/* GET */
/* ===================== */

export async function GET() {
  try {
    const response = await url.get("/api/pameran");
    // mengambil api dari backend
    const transformed = response.data.pameran.map((item: any) => ({
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

        startDate: item.tanggal_mulai,

        endDate: item.tanggal_akhir,

        studyLevel: item.prodi?.nama_prodi ?? item.kategori,
      },

      institution: "Politeknik Negeri Batam",
    }));

    return NextResponse.json({
      status: "success",
      pameran: transformed,
    });
  } catch (error: any) {
    console.error("PAMERAN ERROR:", error.message);
    console.error("DETAIL:", error.response?.data);
    console.error("CODE:", error.code);

    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        code: error.code,
        detail: error.response?.data ?? null,
      },
      {
        status: 500,
      },
    );
  }
}

// export async function GET() {
//   const file = fs.readFileSync(jsonPath, 'utf-8');
//   return NextResponse.json(JSON.parse(file));
// }

/* ===================== */
/* POST */
/* ===================== */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const authHeader = req.headers.get("authorization");

    const backendForm = new FormData();

    backendForm.append("kategori", formData.get("prodi") as string);

    backendForm.append("semester", "6");

    backendForm.append("judul", formData.get("title") as string);

    backendForm.append("deskripsi", formData.get("description") as string);

    backendForm.append("tanggal_mulai", formData.get("publishDate") as string);

    backendForm.append("tanggal_akhir", formData.get("endDate") as string);

    backendForm.append(
      "tanggal_mulai_persiapan",
      formData.get("prepareStart") as string,
    );

    backendForm.append(
      "tanggal_akhir_persiapan",
      formData.get("prepareEnd") as string,
    );

    const image = formData.get("image");

    if (image) {
      backendForm.append("banner", image as File);
    }

    const response = await url.post("/api/admin/pameran", backendForm, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json({
      success: true,
      data: response.data.pameran,
    });
  } catch (error: any) {
    console.error(error.response?.data);
    console.log("ERROR LARAVEL:", error.response?.data);
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data,
      },
      {
        status: 500,
      },
    );
  }
}
// PUT
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const prodi = formData.get("prodi") as string;
    const publishDate = formData.get("publishDate") as string;
    const endDate = formData.get("endDate") as string;
    const prepareStart = formData.get("prepareStart") as string;
    const prepareEnd = formData.get("prepareEnd") as string;
    const description = formData.get("description") as string;
    const fileImage = formData.get("image") as File | null;
    const file = fs.readFileSync(jsonPath, "utf-8");
    const data: Pameran[] = JSON.parse(file);
    const index = data.findIndex((item: any) => String(item.id) === String(id));

    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak ditemukan",
        },
        { status: 404 },
      );
    }

    let bannerImage = data[index].bannerImage;

    /* upload image baru */
    if (fileImage && fileImage.size > 0) {
      const bytes = await fileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = fileImage.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;

      fs.writeFileSync(path.join(imageDir, fileName), buffer);

      bannerImage = `/image/${fileName}`;
    }

    data[index] = {
      ...data[index],

      title,
      subtitle: prodi,
      category: prodi,
      date: formatLongDate(publishDate),
      bannerImage,
      description: [
        {
          title: "Deskripsi",
          content: description,
        },
      ],

      stats: {
        ...data[index].stats,
        prepareStartDate: toSlashDate(prepareStart),
        prepareEndDate: toSlashDate(prepareEnd),
        startDate: toSlashDate(publishDate),
        endDate: toSlashDate(endDate),
        studyLevel: prodi,
      },
    };

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 },
    );
  }
}

function toSlashDate(value: string) {
  const [year, month, day] = value.split("-");

  return `${day}/${month}/${year}`;
}

function formatLongDate(value: string) {
  const [year, month, day] = value.split("-");

  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${day} ${bulan[Number(month) - 1]} ${year}`;
}
