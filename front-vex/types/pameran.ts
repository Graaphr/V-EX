export const PRODI_OPTIONS = [
  {
    kode: "AN",
    nama: "Animasi",
  },
  {
    kode: "IF",
    nama: "Teknik Informatika",
  },
  {
    kode: "TRPL",
    nama: "Teknologi Rekayasa Perangkat Lunak",
  },
  {
    kode: "RKS",
    nama: "Rekayasa Keamanan Siber",
  },
  {
    kode: "TP",
    nama: "Teknologi Permainan",
  },
  {
    kode: "TRM",
    nama: "Teknologi Rekayasa Multimedia",
  },
  {
    kode: "GM",
    nama: "Teknologi Geomatika",
  },
];

export const KELAS_OPTIONS = [
  {
    id_kelas: 1,
    nama_kelas: "A"
  },
  {
    id_kelas: 2,
    nama_kelas: "B"
  },
  {
    id_kelas: 3,
    nama_kelas: "C"
  },
  {
    id_kelas: 4,
    nama_kelas: "D"
  },
]

export type ProdiOption = (typeof PRODI_OPTIONS)[number];

export type PameranDescription = {
  title: string;
  content: string;
};

export type PameranStats = {
  likes: number;
  karya: number;
  prepareStartDate: string;
  prepareEndDate: string;
  startDate: string;
  endDate: string;
  studyLevel: string;
};

export type Pameran = {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  bannerImage: string;
  likes: number;
  karya: number;
  description: PameranDescription[];
  stats: PameranStats;
  institution: string;
};

export interface PameranForm {
  prodi: string; // mengambil data string dari database
  title: string;
  capacity: number;
  publishDate: string;
  endDate: string;
  prepareStart: string;
  prepareEnd: string;
  description: string;
  image: File | null;
};
