export interface KaryaItem {
  id: number;
  title: string;
  category: string;
  image: string;
  year: string;
  link?: string;
  semester?: string;
  description?: string;
  thumbnail?: string;
  booth?: string;
  pameranId?: number;
  pameranTitle?: string; // ✅ tambah
  isTerbaik?: boolean;   // ✅ tambah untuk KPS
}

export interface PameranItem {
  id: number;
  title: string;
}
