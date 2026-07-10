export interface KaryaItem {
  id: number;
  title: string;
  category: string;
  image: string;
  imageLarge?: string;
  imageSmall?: string;
  year: string;
  link?: string;
  semester?: string;
  description?: string;
  thumbnail?: string;
  thumbnailMedium?: string;
  booth?: string;
  pameranId?: number;
  pameranTitle?: string;
  isTerbaik?: boolean;
  canEdit?: boolean;
  editMessage?: string | null;
}

export interface PameranItem {
  id: number;
  title: string;
}
