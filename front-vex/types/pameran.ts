export type ProdiOption =
  | 'Animasi'
  | 'Teknik Informatika'
  | 'Teknologi Rekayasa Perangkat Lunak'
  | 'Rekayasa Keamanan Siber'
  | 'Teknologi Permainan'
  | 'Teknologi Rekayasa Multimedia'
  | 'Teknik Geomatika';
  
export const PRODI_OPTIONS: ProdiOption[] = [
  'Animasi',
  'Teknik Informatika',
  'Teknologi Rekayasa Perangkat Lunak',
  'Rekayasa Keamanan Siber',
  'Teknologi Permainan',
  'Teknologi Rekayasa Multimedia',
  'Teknik Geomatika',
];
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

export type PameranForm = {
  prodi: ProdiOption | '';
  title: string;
  publishDate: string;
  endDate: string;
  prepareStart: string;
  prepareEnd: string;
  description: string;
  image: File | null;
};
