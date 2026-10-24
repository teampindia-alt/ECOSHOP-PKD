"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  ShoppingBag,
  Leaf,
  ShieldCheck,
  Truck,
  HeartHandshake,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { CustomerProfileModal } from "@/components/CustomerProfileModal";
import { OrderReceiptModal } from "@/components/OrderReceiptModal";
import { AdminDashboard } from "@/components/AdminDashboard";
import { OrdersView } from "@/components/OrdersView";
import { Product, CustomerProfile, CartItem, Order, OrderStatus } from "@/types";
import { INITIAL_PRODUCTS, PALAKKAD_DELIVERY_ZONES } from "@/lib/sample-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"shop" | "my-orders" | "admin">("shop");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("എല്ലാം");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Customer Profile State
  const [customer, setCustomer] = useState<CustomerProfile>({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    zone: "pkd-town",
    pincode: "678001",
    isRegistered: false,
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("palakkad_eco_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedOrders = localStorage.getItem("palakkad_eco_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCustomer = localStorage.getItem("palakkad_eco_customer");
      if (savedCustomer) setCustomer(JSON.parse(savedCustomer));

      const savedCart = localStorage.getItem("palakkad_eco_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
  }, []);

  // Sync products to localStorage
  const handleAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem("palakkad_eco_products", JSON.stringify(updated));
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => (p.id === updatedProd.id ? updatedProd : p));
    setProducts(updated);
    localStorage.setItem("palakkad_eco_products", JSON.stringify(updated));
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    localStorage.setItem("palakkad_eco_products", JSON.stringify(updated));
  };

  // Sync Cart
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { product, quantity: 1 }];
      }
      localStorage.setItem("palakkad_eco_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = prev.filter((item) => item.product.id !== productId);
      } else {
        updated = prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      }
      localStorage.setItem("palakkad_eco_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem("palakkad_eco_cart");
  };

  // Save Customer Profile
  const handleSaveProfile = (updated: CustomerProfile) => {
    setCustomer(updated);
    localStorage.setItem("palakkad_eco_customer", JSON.stringify(updated));
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("palakkad_eco_orders", JSON.stringify(updatedOrders));
    handleClearCart();
    setLastOrder(newOrder);
  };

  // Order Status update by Admin
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem("palakkad_eco_orders", JSON.stringify(updated));
  };

  // Filter Categories
  const categories = [
    "എല്ലാം",
    "ജൈവ പച്ചക്കറികൾ",
    "പ്രകൃതിദത്ത എണ്ണകൾ",
    "പരമ്പരാഗത പലഹാരങ്ങൾ",
    "ധാന്യങ്ങൾ",
    "മസാലകൾ",
    "ഇക്കോ ക്ലീനിംഗ്",
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === "എല്ലാം" || prod.category === selectedCategory;
    const matchesSearch =
      prod.nameMl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased text-foreground selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        openCart={() => setIsCartOpen(true)}
        customer={customer}
        openProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        {activeTab === "shop" && (
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white p-6 sm:p-10 shadow-xl">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold backdrop-blur-xs border border-emerald-500/30">
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                  <span>100% പ്രകൃതിദത്തം & രാസവളമുക്തം</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  പാലക്കാടൻ നാട്ടുനന്മകൾ, <br />
                  <span className="text-emerald-300">നിങ്ങളുടെ വീട്ടുപടിക്കൽ!</span>
                </h1>

                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-xl">
                  പാലക്കാട്ടെ പ്രാദേശിക കർഷകരിൽ നിന്ന് ശേഖരിച്ച ശുദ്ധമായ മട്ടയരി, മരച്ചക്കിലാട്ടിയ വെളിച്ചെണ്ണ,
                  വനതേൻ, നാടൻ പനങ്കരുപ്പട്ടി എന്നിവ എളുപ്പത്തിൽ ഓർഡർ ചെയ്യാം.
                </p>

                {/* Features Badges */}
                <div className="pt-2 flex flex-wrap gap-3 text-xs text-emerald-100/90">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-emerald-300" /> പാലക്കാട് ഫ്രീ ഡെലിവറി
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" /> ഗുണനിലവാരം ഉറപ്പ്
                  </span>
                  <span className="flex items-center gap-1">
                    <HeartHandshake className="w-4 h-4 text-emerald-300" /> ക്യാഷ് ഓൺ ഡെലിവറി (COD)
                  </span>
                </div>
              </div>
            </div>

            {/* Search & Category Filter Section */}
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ഉൽപ്പന്നങ്ങളുടെ പേര് തിരയുക (ഉദാ: മട്ടയരി, വെളിച്ചെണ്ണ)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">
                  <span>ഉൽപ്പന്നങ്ങൾ</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    ({filteredProducts.length} എണ്ണം)
                  </span>
                </h2>

                {!customer.isRegistered && (
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    📍 ഡെലിവറി ലൊക്കേഷൻ സെറ്റ് ചെയ്യുക
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-card rounded-2xl border p-6 space-y-2">
                  <Leaf className="w-10 h-10 mx-auto text-muted-foreground opacity-50" />
                  <p className="font-bold text-sm">ക്ഷമിക്കുക, ഉൽപ്പന്നങ്ങൾ ഒന്നും കണ്ടെത്താനായില്ല!</p>
                  <p className="text-xs text-muted-foreground">
                    മറ്റൊരു പേരോ കാറ്റഗറിയോ തിരഞ്ഞു നോക്കൂ.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => {
                    const cartItem = cart.find((i) => i.product.id === product.id);
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantityInCart={cartItem ? cartItem.quantity : 0}
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY ORDERS VIEW */}
        {activeTab === "my-orders" && (
          <OrdersView
            orders={orders}
            onOpenShop={() => setActiveTab("shop")}
            onViewReceipt={(order) => setLastOrder(order)}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {activeTab === "admin" && (
          <AdminDashboard
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Floating Cart Pill on Mobile */}
      {cartCount > 0 && activeTab === "shop" && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30 animate-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-emerald-800 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between font-bold text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                {cartCount}
              </span>
              <span>കാർട്ടിൽ {cartCount} ഉൽപ്പന്നങ്ങൾ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>₹{cartTotal} • ഓർഡർ ചെയ്യുക</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 text-xs text-muted-foreground mt-12">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-foreground">പാലക്കാട് എക്കോ ഷോപ്പ്</span>
            <span>• ഓർഗാനിക് & ഇക്കോ ഫ്രണ്ട്‌ലി സ്റ്റോർ, പാലക്കാട്</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>📞 ഹെൽപ്‌ലൈൻ: 9447000000</span>
            <span>📍 പാലക്കാട്, കേരളം</span>
          </div>
        </div>
      </footer>

      {/* Customer Profile Modal */}
      <CustomerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={customer}
        onSave={handleSaveProfile}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        customer={customer}
        onOpenProfile={() => {
          setIsCartOpen(false);
          setIsProfileOpen(true);
        }}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Success Receipt Modal */}
      <OrderReceiptModal order={lastOrder} onClose={() => setLastOrder(null)} />
    </div>
  );
}
