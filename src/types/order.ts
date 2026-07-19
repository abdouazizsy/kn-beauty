export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  userId: string;
  clientName: string;
  clientPhone: string;
  products: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  district: string;
  status: OrderStatus;
  createdAt: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PREPARING: "En préparation",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};
