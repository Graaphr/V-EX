// app/api/pengguna/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/* ===================== */
/* TYPE */
/* ===================== */

type UserType = {
  id: number;
  nama: string;
  role: string;
  status: string;
  email: string;
  prodi: string;
  kelas: string;
};

/* ===================== */
/* FILE PATH */
/* ===================== */

const filePath = path.join(process.cwd(), 'public', 'data', 'Pengguna.json');

/* ===================== */
/* READ FILE */
/* ===================== */

function readFile(): UserType[] {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');

    return JSON.parse(data);
  } catch {
    return [];
  }
}

/* ===================== */
/* WRITE FILE */
/* ===================== */

function writeFile(data: UserType[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/* ===================== */
/* GET */
/* ===================== */

export async function GET() {
  const users = readFile();

  return NextResponse.json(users);
}

/* ===================== */
/* POST (ADD USER) */
/* ===================== */

export async function POST(req: Request) {
  const body = await req.json();

  const users = readFile();

  const newUser = {
    ...body,
    id: Date.now(),
  };

  users.push(newUser);

  writeFile(users);

  return NextResponse.json({
    message: 'User berhasil ditambah',
    data: newUser,
  });
}

/* ===================== */
/* PUT (EDIT USER) */
/* ===================== */

export async function PUT(req: Request) {
  const body = await req.json();

  const users = readFile();

  const updated = users.map((user) => (user.id === body.id ? body : user));

  writeFile(updated);

  return NextResponse.json({
    message: 'User berhasil diupdate',
  });
}
