export type GalleryCategory = "maquillage" | "coiffure" | "ongles" | "avant-apres";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  createdAt: string;
}

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  maquillage: "Maquillage",
  coiffure: "Coiffure",
  ongles: "Ongles",
  "avant-apres": "Avant / Après",
};
