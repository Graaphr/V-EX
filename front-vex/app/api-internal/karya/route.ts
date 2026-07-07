// app/api/karya/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { KaryaItem } from "@/types/karya";

const jsonPath = path.join(process.cwd(), "public/data/Karya.json");
const uploadDir = path.join(process.cwd(), "public/uploads");

/* ===================== */
/* GET                   */
/* ===================== */
export async function GET() {
  const file = fs.readFileSync(jsonPath, "utf-8");
  return NextResponse.json(JSON.parse(file));
}

/* ===================== */
/* POST                  */
/* ===================== */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const year = formData.get("year") as string;
    const semester = formData.get("semester") as string;
    const description = formData.get("description") as string;
    const booth = formData.get("booth") as string;
    const link = formData.get("link") as string;
    const pameranId = Number(formData.get("pameranId"));
    const fileThumbnail = formData.get("thumbnail") as File | null;
    const filePoster = formData.get("image") as File | null;

    const file = fs.readFileSync(jsonPath, "utf-8");
    const data: KaryaItem[] = JSON.parse(file);
    const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;

    // Buat folder per karya
    const karyaFolder = path.join(uploadDir, String(newId));
    if (!fs.existsSync(karyaFolder)) {
      fs.mkdirSync(karyaFolder, { recursive: true });
    }

    // Upload thumbnail
    let thumbnail = "";
    if (fileThumbnail && fileThumbnail.size > 0) {
      const bytes = await fileThumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = fileThumbnail.name.split(".").pop();
      const fileName = `thumbnail.${ext}`;
      fs.writeFileSync(path.join(karyaFolder, fileName), buffer);
      thumbnail = `/uploads/${newId}/${fileName}`;
    }

    // Upload poster
    let image = "";
    if (filePoster && filePoster.size > 0) {
      const bytes = await filePoster.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = filePoster.name.split(".").pop();
      const fileName = `poster.${ext}`;
      fs.writeFileSync(path.join(karyaFolder, fileName), buffer);
      image = `/uploads/${newId}/${fileName}`;
    }

    const newItem: KaryaItem = {
      id: newId,
      title,
      category,
      year,
      semester,
      description,
      booth,
      link,
      pameranId,
      thumbnail,
      image,
    };

    data.push(newItem);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan data" },
      { status: 500 },
    );
  }
}

/* ===================== */
/* PUT                   */
/* ===================== */
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const year = formData.get("year") as string;
    const semester = formData.get("semester") as string;
    const description = formData.get("description") as string;
    const booth = formData.get("booth") as string;
    const link = formData.get("link") as string;
    const pameranId = Number(formData.get("pameranId"));
    const fileThumbnail = formData.get("thumbnail") as File | null;
    const filePoster = formData.get("image") as File | null;

    const file = fs.readFileSync(jsonPath, "utf-8");
    const data: KaryaItem[] = JSON.parse(file);
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    const karyaFolder = path.join(uploadDir, String(id));
    if (!fs.existsSync(karyaFolder)) {
      fs.mkdirSync(karyaFolder, { recursive: true });
    }

    // Update thumbnail jika ada file baru
    let thumbnail = data[index].thumbnail;
    if (fileThumbnail && fileThumbnail.size > 0) {
      const bytes = await fileThumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = fileThumbnail.name.split(".").pop();
      const fileName = `thumbnail.${ext}`;
      fs.writeFileSync(path.join(karyaFolder, fileName), buffer);
      thumbnail = `/uploads/${id}/${fileName}`;
    }

    // Update poster jika ada file baru
    let image = data[index].image;
    if (filePoster && filePoster.size > 0) {
      const bytes = await filePoster.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = filePoster.name.split(".").pop();
      const fileName = `poster.${ext}`;
      fs.writeFileSync(path.join(karyaFolder, fileName), buffer);
      image = `/uploads/${id}/${fileName}`;
    }

    data[index] = {
      ...data[index],
      title,
      category,
      year,
      semester,
      description,
      booth,
      link,
      pameranId,
      thumbnail,
      image,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, data: data[index] });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate data" },
      { status: 500 },
    );
  }
}

/* ===================== */
/* DELETE                */
/* ===================== */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const file = fs.readFileSync(jsonPath, "utf-8");
    const data: KaryaItem[] = JSON.parse(file);
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    // Hapus folder upload karya
    const karyaFolder = path.join(uploadDir, String(id));
    if (fs.existsSync(karyaFolder)) {
      fs.rmSync(karyaFolder, { recursive: true, force: true });
    }

    data.splice(index, 1);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data" },
      { status: 500 },
    );
  }
}
