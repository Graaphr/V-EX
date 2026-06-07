import url from '@/lib/axios';

export async function GetRole(role: string){
    const res = await url.get(`/api/pengguna/role/${role}`)
    return res.data
}

export async function CreateUser(data: {
  nama: string;
  email: string;
  role: string;
  prodi: string;
  kelas: number;
}) {
  const res = await url.post(
    "/api/pengguna/register-through-admin",
    data
  );

  return res.data;
}

export async function UpdateUser(user: UserType) {
  const payload = {
    nama: user.nama,
    email: user.email,
    role: user.role,
    status: user.status,

    kelas: user.kelas?.id_kelas,
    program_studi: user.program_studi === "string"
        ? user.program_studi : user.prodi?.kode_prodi,
  };

  const res = await url.put(
    `/api/pengguna/${user.id}`,
    payload
  );

  return res.data;
}