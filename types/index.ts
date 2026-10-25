export interface Product {
  id: string;
  nameMl: string;
  nameEn: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CustomerProfile {
  uid?: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  landmark: string;
  zone: string;
  pincode: string;
  isRegistered: boolean;
  authProvider?: "firebase" | "google" | "local";
  photoURL?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'received' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer: CustomerProfile;
  items: {
    productId: string;
    nameMl: string;
    nameEn: string;
    unitPrice: number;
    quantity: number;
    unit: string;
  }[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: 'cod' | 'upi';
  upiTransactionId?: string;
  status: OrderStatus;
  deliveryNotes?: string;
  createdAt: string;
}

export interface DeliveryZone {
  id: string;
  nameMl: string;
  nameEn: string;
  pincode: string;
  deliveryFee: number;
  minFreeDelivery: number;
  estimateTime: string;
}

export interface ShopSettings {
  shopName: string;
  upiId: string;
  upiName: string;
  phone: string;
  whatsappNumber: string;
  freeDeliveryThreshold: number;
  announcement: string;
}
