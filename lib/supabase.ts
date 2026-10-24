import { createClient } from "@supabase/supabase-js";
import { Product, CustomerProfile, Order, OrderStatus } from "@/types";
import { INITIAL_PRODUCTS } from "./sample-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// 1. PRODUCTS API
// ==========================================
export async function getProducts(): Promise<Product[]> {
  if (!supabase) return INITIAL_PRODUCTS;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Supabase fetch returned empty/error, using fallback:", error);
      return INITIAL_PRODUCTS;
    }

    return data.map((item: any) => ({
      id: item.id,
      nameMl: item.name_ml,
      nameEn: item.name_en,
      category: item.category,
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      unit: item.unit,
      image: item.image,
      description: item.description || "",
      inStock: item.in_stock,
    }));
  } catch (err) {
    console.error("Error fetching products from Supabase:", err);
    return INITIAL_PRODUCTS;
  }
}

export async function addProductToDb(product: Product): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("products").insert([
      {
        id: product.id,
        name_ml: product.nameMl,
        name_en: product.nameEn,
        category: product.category,
        price: product.price,
        original_price: product.originalPrice,
        unit: product.unit,
        image: product.image,
        description: product.description,
        in_stock: product.inStock,
      },
    ]);

    if (error) {
      console.error("Error adding product to Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error adding product:", err);
    return false;
  }
}

export async function updateProductInDb(product: Product): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("products")
      .update({
        name_ml: product.nameMl,
        name_en: product.nameEn,
        category: product.category,
        price: product.price,
        original_price: product.originalPrice,
        unit: product.unit,
        image: product.image,
        description: product.description,
        in_stock: product.inStock,
      })
      .eq("id", product.id);

    return !error;
  } catch (err) {
    console.error("Error updating product:", err);
    return false;
  }
}

export async function deleteProductFromDb(productId: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("products").delete().eq("id", productId);
    return !error;
  } catch (err) {
    console.error("Error deleting product:", err);
    return false;
  }
}

// ==========================================
// 2. ORDERS API
// ==========================================
export async function getOrders(): Promise<Order[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((o: any) => ({
      id: o.id,
      customer: {
        name: o.customer_name,
        phone: o.customer_phone,
        address: o.customer_address,
        landmark: o.customer_landmark || "",
        zone: o.customer_zone,
        pincode: o.customer_pincode,
        isRegistered: true,
      },
      items: o.items || [],
      subtotal: Number(o.subtotal),
      deliveryCharge: Number(o.delivery_charge),
      total: Number(o.total),
      paymentMethod: o.payment_method,
      status: o.status as OrderStatus,
      deliveryNotes: o.delivery_notes,
      createdAt: o.created_at,
    }));
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
}

export async function createOrderInDb(order: Order): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("orders").insert([
      {
        id: order.id,
        customer_name: order.customer.name,
        customer_phone: order.customer.phone,
        customer_address: order.customer.address,
        customer_landmark: order.customer.landmark,
        customer_zone: order.customer.zone,
        customer_pincode: order.customer.pincode,
        items: order.items,
        subtotal: order.subtotal,
        delivery_charge: order.deliveryCharge,
        total: order.total,
        payment_method: order.paymentMethod,
        status: order.status,
        delivery_notes: order.deliveryNotes,
        created_at: order.createdAt,
      },
    ]);

    if (error) {
      console.error("Error saving order to Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error creating order:", err);
    return false;
  }
}

export async function updateOrderStatusInDb(orderId: string, status: OrderStatus): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    return !error;
  } catch (err) {
    console.error("Error updating order status:", err);
    return false;
  }
}
