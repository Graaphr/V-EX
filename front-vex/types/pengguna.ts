// types/pengguna.ts

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
  prodi: ProdiType | string;
  kelas: KelasType | string;
};

// Helper untuk ekstrak nilai prodi/kelas
export function getProdiKode(prodi: ProdiType | string): string {
  return typeof prodi === 'string' ? prodi : prodi.kode_prodi;
}

export function getKelasId(kelas: KelasType | string): string {
  return typeof kelas === 'string' ? kelas : String(kelas.id_kelas);
}

export function getKelasNama(kelas: KelasType | string): string {
  return typeof kelas === 'string' ? kelas : (kelas.nama_kelas ?? '');
}