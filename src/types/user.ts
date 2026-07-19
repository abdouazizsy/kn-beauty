export type UserRole = "visiteur" | "cliente" | "admin";

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  role: Exclude<UserRole, "visiteur">;
  address?: string;
  district?: string;
  email?: string;
  photoUrl?: string;
  createdAt: string;
}
