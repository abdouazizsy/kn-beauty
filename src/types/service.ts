export type ServiceCategory = "maquillage" | "coiffure" | "onglerie" | "beaute";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  imageUrl: string;
  category: ServiceCategory;
  active: boolean;
  createdAt: string;
}

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  maquillage: "Maquillage",
  coiffure: "Coiffure",
  onglerie: "Onglerie",
  beaute: "Beauté générale",
};
