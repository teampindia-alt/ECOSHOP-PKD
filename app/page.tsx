"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Wheat,
  ShoppingBag,
  Leaf,
  ShieldCheck,
  Truck,
  HeartHandshake,
  CheckCircle,
  Database,
  QrCode,
  Flame,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { CustomerProfileModal } from "@/components/CustomerProfileModal";
import { AuthModal } from "@/components/AuthModal";
import { AdminLoginGate } from "@/components/AdminLoginGate";
import { OrderReceiptModal } from "@/components/OrderReceiptModal";
import { AdminDashboard } from "@/components/AdminDashboard";
import { OrdersView } from "@/components/OrdersView";
import { Product, CustomerProfile, CartItem, Order, OrderStatus, ShopSettings } from "@/types";
import { INITIAL_PRODUCTS, PALAKKAD_DELIVERY_ZONES, DEFAULT_SHOP_SETTINGS } from "@/lib/sample-data";
import {
  isSupabaseConfigured,
  getProducts,
  addProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  getOrders,
  createOrderInDb,
  updateOrderStatusInDb,
} from "@/lib/supabase";
import {
  isFirebaseConfigured,
  onAuthStateChange,
  logoutUser,
} from "@/lib/firebase";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"shop" | "my-orders" | "admin">("shop");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("എല്ലാം");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shopSettings, setShopSettings] = useState<ShopSettings>(DEFAULT_SHOP_SETTINGS);

  // Admin Auth Gate State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Customer Profile State
  const [customer, setCustomer] = useState<CustomerProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    zone: "pkd-muni-central",
    pincode: "678001",
    isRegistered: false,
    authProvider: "local",
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Check admin session
  useEffect(() => {
    try {
      const adminSession = sessionStorage.getItem("teampaddy_admin_logged_in");
      if (adminSession === "true") setIsAdminLoggedIn(true);
    } catch (e) {}
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    try {
      sessionStorage.setItem("teampaddy_admin_logged_in", "true");
    } catch (e) {}
  };

  const handleAdminLock = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem("teampaddy_admin_logged_in");
    } catch (e) {}
    setActiveTab("shop");
  };

  // Listen to Firebase Auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setCustomer((prev) => {
          const updated: CustomerProfile = {
            ...prev,
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || prev.name || "ഉപഭോക്താവ്",
            email: firebaseUser.email || prev.email || "",
            phone: firebaseUser.phoneNumber || prev.phone || "",
            photoURL: firebaseUser.photoURL || prev.photoURL || "",
            isRegistered: true,
            authProvider: firebaseUser.providerData[0]?.providerId.includes("google")
              ? "google"
              : "firebase",
          };
          localStorage.setItem("teampaddy_customer", JSON.stringify(updated));
          return updated;
        });
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Load Initial Data from storage & Supabase
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured) {
        try {
          const dbProducts = await getProducts();
          if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);

          const dbOrders = await getOrders();
          if (dbOrders) setOrders(dbOrders);
        } catch (e) {
          console.error("Failed to load from Supabase:", e);
        }
      } else {
        try {
          const savedProducts = localStorage.getItem("teampaddy_products");
          if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
          } else {
            setProducts(INITIAL_PRODUCTS);
            localStorage.setItem("teampaddy_products", JSON.stringify(INITIAL_PRODUCTS));
          }

          const savedOrders = localStorage.getItem("teampaddy_orders");
          if (savedOrders) setOrders(JSON.parse(savedOrders));
        } catch (e) {
          console.error("Failed to load local storage", e);
        }
      }

      try {
        const savedCustomer = localStorage.getItem("teampaddy_customer") || localStorage.getItem("palakkad_eco_customer");
        if (savedCustomer) setCustomer(JSON.parse(savedCustomer));

        const savedCart = localStorage.getItem("teampaddy_cart");
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedSettings = localStorage.getItem("teampaddy_settings");
        if (savedSettings) {
          setShopSettings(JSON.parse(savedSettings));
        } else {
          setShopSettings(DEFAULT_SHOP_SETTINGS);
          localStorage.setItem("teampaddy_settings", JSON.stringify(DEFAULT_SHOP_SETTINGS));
        }
      } catch (e) {
        console.error("Failed to load customer/cart/settings", e);
      }
    }

    loadData();
  }, []);

  // Handle successful login/registration from AuthModal
  const handleAuthSuccess = (userData: {
    uid: string;
    name: string;
    email: string;
    phone: string;
    authProvider: "firebase" | "google" | "local";
    photoURL?: string;
  }) => {
    setCustomer((prev) => {
      const updated: CustomerProfile = {
        ...prev,
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || prev.phone,
        photoURL: userData.photoURL,
        isRegistered: true,
        authProvider: userData.authProvider,
      };
      localStorage.setItem("teampaddy_customer", JSON.stringify(updated));
      return updated;
    });

    if (!customer.address) {
      setTimeout(() => setIsProfileOpen(true), 400);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    const guestCustomer: CustomerProfile = {
      name: "",
      email: "",
      phone: "",
      address: "",
      landmark: "",
      zone: "pkd-muni-central",
      pincode: "678001",
      isRegistered: false,
      authProvider: "local",
    };
    setCustomer(guestCustomer);
    localStorage.removeItem("teampaddy_customer");
  };

  // Update Shop Settings
  const handleUpdateShopSettings = (newSettings: ShopSettings) => {
    setShopSettings(newSettings);
    localStorage.setItem("teampaddy_settings", JSON.stringify(newSettings));
  };

  // Sync products to Supabase & localStorage
  const handleAddProduct = async (newProd: Product) => {
    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem("teampaddy_products", JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await addProductToDb(newProd);
    }
  };

  const handleUpdateProduct = async (updatedProd: Product) => {
    const updated = products.map((p) => (p.id === updatedProd.id ? updatedProd : p));
    setProducts(updated);
    localStorage.setItem("teampaddy_products", JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await updateProductInDb(updatedProd);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    localStorage.setItem("teampaddy_products", JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await deleteProductFromDb(productId);
    }
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
      localStorage.setItem("teampaddy_cart", JSON.stringify(updated));
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
      localStorage.setItem("teampaddy_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem("teampaddy_cart");
  };

  // Save Customer Profile
  const handleSaveProfile = (updated: CustomerProfile) => {
    setCustomer(updated);
    localStorage.setItem("teampaddy_customer", JSON.stringify(updated));
  };

  // Order Placement
  const handleOrderPlaced = async (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("teampaddy_orders", JSON.stringify(updatedOrders));
    handleClearCart();
    setLastOrder(newOrder);

    if (isSupabaseConfigured) {
      await createOrderInDb(newOrder);
    }
  };

  // Order Status update by Admin
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem("teampaddy_orders", JSON.stringify(updated));

    if (isSupabaseConfigured) {
      await updateOrderStatusInDb(orderId, status);
    }
  };

  // Filter Categories
  const categories = [
    "എല്ലാം",
    "നാടൻ കുത്തരി (മട്ടയരി)",
    "അരിപ്പൊടികളും അവലും",
    "മറ്റ് കാർഷിക ഉൽപ്പന്നങ്ങൾ",
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
    <div className="min-h-screen bg-background flex flex-col antialiased text-foreground selection:bg-amber-100 selection:text-emerald-950">
      {/* Navigation with PWA prompt, Auth, and Announcement */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        openCart={() => setIsCartOpen(true)}
        customer={customer}
        openProfile={() => setIsProfileOpen(true)}
        openAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        announcement={shopSettings.announcement}
      />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        {activeTab === "shop" && (
          <div className="space-y-6">
            {/* Hero Banner: Team Paddy Palakkad */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-amber-400/30">
                  <span className="text-sm">🌾</span>
                  <span>അരി ഉല്പാദകരുടെയും ഉപഭോക്താക്കളുടെയും കൂട്ടായ്മ (Team Paddy PKD)</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  രണ്ടാം വിള നാടൻ കുത്തരി, <br />
                  <span className="text-amber-300">പാടത്തുനിന്ന് നേരിട്ട് നിങ്ങളുടെ വീട്ടിലേക്ക്!</span>
                </h1>

                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
                  ഇടനിലക്കാരില്ലാതെ പാലക്കാട് നഗരസഭയിലെ കർഷകർ സ്വന്തം പാടത്ത് വിളവെടുത്ത രണ്ടാം വിള നെല്ല്
                  പരമ്പരാഗതമായി പുഴുങ്ങി കുത്തിയെടുത്ത മായമില്ലാത്ത തനി നാടൻ മട്ടയരി.
                  10Kg, 25Kg, 50Kg ചാക്കുകളിൽ ഓർഡർ ചെയ്യാം.
                </p>

                {/* Features Badges */}
                <div className="pt-2 flex flex-wrap gap-2.5 text-xs text-emerald-100">
                  <span className="flex items-center gap-1 bg-emerald-800/60 px-3 py-1 rounded-lg border border-emerald-700/50">
                    <Truck className="w-3.5 h-3.5 text-amber-300" /> പാലക്കാട് ഡോർ ഡെലിവറി
                  </span>
                  <span className="flex items-center gap-1 bg-emerald-800/60 px-3 py-1 rounded-lg border border-emerald-700/50">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> 100% തവിടുള്ള നാടൻ കുത്തരി
                  </span>
                  <span className="flex items-center gap-1 bg-emerald-800/60 px-3 py-1 rounded-lg border border-emerald-700/50">
                    <QrCode className="w-3.5 h-3.5 text-amber-300" /> UPI / Cash on Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* User welcome or registration prompt strip */}
            {!customer.isRegistered ? (
              <div className="p-3.5 rounded-2xl border bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌾</span>
                  <span>
                    <strong>കസ്റ്റമർ രജിസ്ട്രേഷൻ:</strong> ഫോൺ നമ്പറും വീട്ടുപേരും നൽകി രജിസ്റ്റർ ചെയ്താൽ അരി നിങ്ങളുടെ വീട്ടുപടിക്കൽ നേരിട്ടെത്തിക്കും.
                  </span>
                </div>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="font-bold text-emerald-900 dark:text-amber-300 hover:underline shrink-0"
                >
                  ലോഗിൻ / രജിസ്റ്റർ ചെയ്യുക &rarr;
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl border bg-muted/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>
                    സ്വാഗതം, <strong>{customer.name}</strong>! പാലക്കാട് നഗരസഭാ പരിധിയിൽ ഡെലിവറി ലഭ്യമാണ്.
                  </span>
                </div>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="text-emerald-800 dark:text-emerald-300 font-semibold hover:underline"
                >
                  📍 {customer.address ? "വിലാസം മാറ്റുക" : "+ ഡെലിവറി വിലാസം നൽകുക"}
                </button>
              </div>
            )}

            {/* Search & Category Filter Section */}
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="അരി ചാക്കുകൾ തിരയുക (10 കിലോ, 25 കിലോ, 50 കിലോ, പുട്ടുപൊടി)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
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
                        ? "bg-emerald-800 text-white shadow-xs"
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
                  <span>രണ്ടാം വിള നാടൻ മട്ടയരി & ഉൽപ്പന്നങ്ങൾ</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    ({filteredProducts.length} ഇനങ്ങൾ)
                  </span>
                </h2>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-card rounded-2xl border p-6 space-y-2">
                  <Wheat className="w-10 h-10 mx-auto text-muted-foreground opacity-50" />
                  <p className="font-bold text-sm">ഉൽപ്പന്നങ്ങൾ ഒന്നും കണ്ടെത്താനായില്ല!</p>
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

        {/* ADMIN DASHBOARD - WITH SECURE PASSWORD GATE */}
        {activeTab === "admin" && (
          <div className="space-y-4">
            {!isAdminLoggedIn ? (
              <AdminLoginGate
                currentPassword={shopSettings.adminPassword || "teampaddy@pkd"}
                onSuccess={handleAdminLoginSuccess}
                onCancel={() => setActiveTab("shop")}
              />
            ) : (
              <>
                {/* Backend & Auth Status Alert Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isFirebaseConfigured
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : "bg-blue-50 border-blue-200 text-blue-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold">
                        Firebase Auth: {isFirebaseConfigured ? "🔥 Connected" : "⚡ Ready (Demo Mode)"}
                      </span>
                    </div>
                    <span className="text-[11px] opacity-80">
                      {isFirebaseConfigured ? "തത്സമയ ലോഗിൻ സജീവം" : ".env.local-ൽ കീകൾ നൽകാം"}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isSupabaseConfigured
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-muted border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold">
                        ഡാറ്റാബേസ്: {isSupabaseConfigured ? "⚡ Supabase Cloud" : "💾 Local Storage"}
                      </span>
                    </div>
                    <span className="text-[11px] opacity-80">
                      {isSupabaseConfigured ? "ക്ലൗഡ് സിങ്ക് സജീവം" : "റെഡി"}
                    </span>
                  </div>
                </div>

                <AdminDashboard
                  products={products}
                  orders={orders}
                  shopSettings={shopSettings}
                  onUpdateShopSettings={handleUpdateShopSettings}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onLockAdmin={handleAdminLock}
                />
              </>
            )}
          </div>
        )}
      </main>

      {/* Floating Cart Pill on Mobile */}
      {cartCount > 0 && activeTab === "shop" && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30 animate-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-emerald-900 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between font-bold text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center text-[10px] font-black">
                {cartCount}
              </span>
              <span>കാർട്ടിൽ {cartCount} ഇനങ്ങൾ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>₹{cartTotal} • ഓർഡർ ചെയ്യുക</span>
              <ShoppingBag className="w-4 h-4 text-amber-300" />
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 text-xs text-muted-foreground mt-12">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wheat className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-foreground">{shopSettings.shopName}</span>
            <span>• അരി ഉല്പാദകരുടെയും ഉപഭോക്താക്കളുടെയും കൂട്ടായ്മ</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>📞 ഹെൽപ്‌ലൈൻ: {shopSettings.phone}</span>
            <span>💳 UPI: {shopSettings.upiId}</span>
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

      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Cart Drawer with dynamic UPI */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        customer={customer}
        shopSettings={shopSettings}
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
