import url from '@/lib/axios';
import { UserType, KelasType, ProdiType } from '@/types/pengguna';

export async function GetRole(role: string) {
  const res = await url.get(`/api/admin/pengguna/role/${role}`);
  return res.data;
}

export async function CreateUser(data: { nama: string; email: string; role: string; prodi: string; kelas: string }) {
  const res = await url.post('/api/admin/pengguna/register-through-admin', data);

  return res.data;
}

export async function UpdateUser(user: UserType) {
  const payload = {
    nama: user.nama,
    email: user.email,
    role: user.role,
    status: user.status,

    kelas: typeof user.kelas === 'object' ? user.kelas.id_kelas : user.kelas,
    program_studi: typeof user.prodi === 'object' ? user.prodi.kode_prodi : user.prodi,
  };

  const res = await url.put(`/api/admin/pengguna/${user.id}`, payload);
  return res.data;
}
