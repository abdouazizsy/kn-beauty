export type ProductCategory = "pyjamas" | "accessoires" | "produits-beaute";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  images: string[];
  sizes: string[];
  colors: string[];
  active: boolean;
  createdAt: string;
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  pyjamas: "Pyjamas",
  accessoires: "Accessoires beauté",
  "produits-beaute": "Produits beauté",
};
