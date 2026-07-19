export type PaymentType = "acompte_rdv" | "commande";
export type PaymentStatus = "PENDING" | "RECEIVED" | "REFUSED";

export interface Payment {
  id: string;
  userId: string;
  type: PaymentType;
  relatedId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}
