export type PaymentMethod = "especes" | "mobile_money" | "carte" | "autre";

export interface Transaction {
  id: string;
  description: string;
  clientName?: string;
  amount: number;
  method: PaymentMethod;
  note?: string;
  createdAt: string;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  especes: "Espèces",
  mobile_money: "Mobile Money",
  carte: "Carte bancaire",
  autre: "Autre",
};
