export type ProdiType = {
  kode_prodi: string;
  nama_prodi?: string;
};

export type KelasType = {
  id_kelas: number | string;
  nama_kelas?: string;
};

export type UserType = {
  id: number;
  nama: string;
  role: string;
  status: string;
  email: string;
  prodi: ProdiType | string;  // bisa object atau string
  kelas: KelasType | string;  // bisa object atau string
};