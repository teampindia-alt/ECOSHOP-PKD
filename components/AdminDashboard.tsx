"use client";

import React, { useState } from "react";
import {
  PackagePlus,
  Boxes,
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Image as ImageIcon,
  IndianRupee,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product, Order, OrderStatus } from "@/types";
import { PRODUCT_IMAGE_PRESETS } from "@/lib/sample-data";

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<"products" | "add-product" | "orders">("add-product");

  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    nameMl: "",
    nameEn: "",
    category: "ജൈവ പച്ചക്കറികൾ",
    price: 100,
    originalPrice: 120,
    unit: "1 Kg",
    image: PRODUCT_IMAGE_PRESETS[0].url,
    description: "",
    inStock: true,
  });

  const [formSuccess, setFormSuccess] = useState(false);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.nameMl?.trim() || !newProduct.price) {
      alert("ദയവായി ഉൽപ്പന്നത്തിന്റെ പേരും വിലയും നൽകുക.");
      return;
    }

    const created: Product = {
      id: `prod-${Date.now()}`,
      nameMl: newProduct.nameMl,
      nameEn: newProduct.nameEn || newProduct.nameMl,
      category: newProduct.category || "ജനറൽ",
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      unit: newProduct.unit || "1 യൂണിറ്റ്",
      image: newProduct.image || PRODUCT_IMAGE_PRESETS[0].url,
      description: newProduct.description || "പാലക്കാട് എക്കോ ഷോപ്പ് ഉൽപ്പന്നം",
      inStock: newProduct.inStock ?? true,
    };

    onAddProduct(created);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveAdminTab("products");
    }, 1200);

    // Reset Form
    setNewProduct({
      nameMl: "",
      nameEn: "",
      category: "ജൈവ പച്ചക്കറികൾ",
      price: 100,
      originalPrice: 120,
      unit: "1 Kg",
      image: PRODUCT_IMAGE_PRESETS[0].url,
      description: "",
      inStock: true,
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "received":
        return <Badge className="bg-amber-500 text-white">ഓർഡർ ലഭിച്ചു</Badge>;
      case "packed":
        return <Badge className="bg-blue-600 text-white">പാക്ക് ചെയ്തു</Badge>;
      case "out_for_delivery":
        return <Badge className="bg-purple-600 text-white">ഡെലിവറിക്ക് ഇറങ്ങി</Badge>;
      case "delivered":
        return <Badge className="bg-emerald-600 text-white">ഡെലിവറി പൂർത്തിയായി</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Admin Top Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card p-4 rounded-2xl border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">ആകെ ഉൽപ്പന്നങ്ങൾ</p>
            <p className="text-xl font-bold">{products.length}</p>
          </div>
        </div>

        <div className="bg-card p-4 rounded-2xl border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">ആകെ ഓർഡറുകൾ</p>
            <p className="text-xl font-bold">{orders.length}</p>
          </div>
        </div>

        <div className="bg-card p-4 rounded-2xl border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">ആകെ വിറ്റുവരവ്</p>
            <p className="text-xl font-bold">₹{totalRevenue}</p>
          </div>
        </div>

        <div className="bg-card p-4 rounded-2xl border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">പെൻഡിങ് ഓർഡറുകൾ</p>
            <p className="text-xl font-bold">
              {orders.filter((o) => o.status === "received" || o.status === "packed").length}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b pb-3">
        <Button
          variant={activeAdminTab === "add-product" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveAdminTab("add-product")}
          className={`text-xs ${
            activeAdminTab === "add-product" ? "bg-emerald-700 hover:bg-emerald-800 text-white" : ""
          }`}
        >
          <PackagePlus className="w-4 h-4 mr-1.5" />
          പുതിയ ഉൽപ്പന്നം ചേർക്കുക (Add Product)
        </Button>

        <Button
          variant={activeAdminTab === "products" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveAdminTab("products")}
          className={`text-xs ${
            activeAdminTab === "products" ? "bg-emerald-700 hover:bg-emerald-800 text-white" : ""
          }`}
        >
          <Boxes className="w-4 h-4 mr-1.5" />
          ഉൽപ്പന്ന ലിസ്റ്റ് ({products.length})
        </Button>

        <Button
          variant={activeAdminTab === "orders" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveAdminTab("orders")}
          className={`text-xs ${
            activeAdminTab === "orders" ? "bg-emerald-700 hover:bg-emerald-800 text-white" : ""
          }`}
        >
          <ClipboardList className="w-4 h-4 mr-1.5" />
          ഓർഡറുകൾ ({orders.length})
        </Button>
      </div>

      {/* TAB 1: ADD NEW PRODUCT */}
      {activeAdminTab === "add-product" && (
        <div className="bg-card rounded-2xl border p-6 shadow-sm max-w-2xl">
          <div className="mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <PackagePlus className="w-5 h-5 text-emerald-700" />
              പുതിയ ഉൽപ്പന്നം ചേർക്കൽ (Add New Product)
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              ഉൽപ്പന്നത്തിന്റെ പേര്, ഫോട്ടോ, വില, അളവ് എന്നിവ നൽകി ആപ്പിലേക്ക് നേരിട്ട് ആഡ് ചെയ്യാം.
            </p>
          </div>

          {formSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              ഉൽപ്പന്നം വിജയകരമായി ആപ്പിലേക്ക് ചേർത്തു!
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            {/* Malayalam Name */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">ഉൽപ്പന്നത്തിന്റെ പേര് (മലയാളത്തിൽ) *</label>
              <Input
                type="text"
                placeholder="ഉദാ: നാടൻ വെളിച്ചെണ്ണ / കൽപ്പാത്തി മട്ടയരി"
                value={newProduct.nameMl}
                onChange={(e) => setNewProduct({ ...newProduct, nameMl: e.target.value })}
                required
                className="h-10 text-sm"
              />
            </div>

            {/* English Name */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">പേര് (English - ഓപ്ഷണൽ)</label>
              <Input
                type="text"
                placeholder="eg: Cold-Pressed Coconut Oil"
                value={newProduct.nameEn}
                onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                className="h-10 text-sm"
              />
            </div>

            {/* Category and Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">കാറ്റഗറി (Category)</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="ജൈവ പച്ചക്കറികൾ">ജൈവ പച്ചക്കറികൾ (Vegetables)</option>
                  <option value="പ്രകൃതിദത്ത എണ്ണകൾ">പ്രകൃതിദത്ത എണ്ണകൾ (Oils)</option>
                  <option value="പരമ്പരാഗത പലഹാരങ്ങൾ">പരമ്പരാഗത പലഹാരങ്ങൾ (Jaggery / Honey)</option>
                  <option value="ധാന്യങ്ങൾ">ധാന്യങ്ങൾ (Rice & Millets)</option>
                  <option value="മസാലകൾ">മസാലകൾ (Spices)</option>
                  <option value="ഇക്കോ ക്ലീനിംഗ്">ഇക്കോ ക്ലീനിംഗ് (Eco Living)</option>
                  <option value="മറ്റുള്ളവ">മറ്റുള്ളവ (Others)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">അളവ് / യൂണിറ്റ് (Unit) *</label>
                <Input
                  type="text"
                  placeholder="ഉദാ: 1 Kg, 500 ml, 1 Packet"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  required
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Price and MRP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">വിൽപന വില (Selling Price ₹) *</label>
                <Input
                  type="number"
                  placeholder="150"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  required
                  min={1}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">യഥാർത്ഥ വില / MRP (ഓപ്ഷണൽ ₹)</label>
                <Input
                  type="number"
                  placeholder="180"
                  value={newProduct.originalPrice || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      originalPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Product Image Section */}
            <div className="space-y-2">
              <label className="font-semibold text-foreground flex items-center justify-between">
                <span>ഉൽപ്പന്നത്തിന്റെ ചിത്രം (Image URL)</span>
                <span className="text-[11px] text-muted-foreground">താഴെയുള്ള സാമ്പിൾ ചിത്രങ്ങളും തിരഞ്ഞെടുക്കാം</span>
              </label>
              <Input
                type="url"
                placeholder="https://..."
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="h-10 text-xs font-mono"
              />

              {/* Quick Image Presets */}
              <div className="pt-1">
                <span className="text-[11px] text-muted-foreground block mb-1">റെഡിമെയ്ഡ് ചിത്രങ്ങൾ:</span>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, image: preset.url })}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                        newProduct.image === preset.url
                          ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-600 font-bold text-emerald-900 dark:text-emerald-100"
                          : "bg-muted/40 hover:bg-muted"
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-4 h-4 rounded-full object-cover" />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {newProduct.image && (
                <div className="mt-2 flex items-center gap-3 p-2 border rounded-xl bg-muted/20">
                  <img
                    src={newProduct.image}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover bg-muted"
                  />
                  <div>
                    <span className="text-xs font-medium text-foreground">ചിത്രത്തിന്റെ പ്രിവ്യൂ</span>
                    <p className="text-[10px] text-muted-foreground">ഉപഭോക്താക്കൾക്ക് ഈ ചിത്രമായിരിക്കും കാണിക്കുക</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">ഉൽപ്പന്ന വിവരണം (Description)</label>
              <textarea
                rows={2}
                placeholder="ഗുണമേന്മ, എങ്ങനെ ഉപയോഗിക്കാം, ഉറവിടം തുടങ്ങിയ വിവരങ്ങൾ..."
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* In Stock toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="stockCheck"
                checked={newProduct.inStock}
                onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                className="w-4 h-4 accent-emerald-700"
              />
              <label htmlFor="stockCheck" className="text-sm font-medium cursor-pointer">
                ഈ ഉൽപ്പന്നം ഇപ്പോൾ സ്റ്റോക്കുണ്ട് (In Stock)
              </label>
            </div>

            {/* Submit button */}
            <div className="pt-3">
              <Button
                type="submit"
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                ഉൽപ്പന്നം ആപ്പിൽ ഉൾപ്പെടുത്തുക (Save Product)
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: MANAGE PRODUCTS LIST */}
      {activeAdminTab === "products" && (
        <div className="bg-card rounded-2xl border p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">നിലവിലെ ഉൽപ്പന്നങ്ങൾ ({products.length})</h2>
              <p className="text-xs text-muted-foreground">
                വില മാറ്റാനും സ്റ്റോക്ക് അപ്‌ഡേറ്റ് ചെയ്യാനും താഴെയുള്ള ലിസ്റ്റ് ഉപയോഗിക്കാം.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setActiveAdminTab("add-product")}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              പുതിയത് ചേർക്കുക
            </Button>
          </div>

          <div className="divide-y border rounded-xl overflow-hidden bg-background">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.nameEn}
                    className="w-14 h-14 rounded-lg object-cover bg-muted shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{prod.nameMl}</h4>
                      <Badge variant="outline" className="text-[10px]">
                        {prod.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{prod.nameEn} • {prod.unit}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm">
                        ₹{prod.price}
                      </span>
                      {prod.inStock ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
                          സ്റ്റോക്കില്ല
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onUpdateProduct({
                        ...prod,
                        inStock: !prod.inStock,
                      })
                    }
                    className="text-xs h-8"
                  >
                    {prod.inStock ? "സ്റ്റോക്കില്ല എന്ന് മാറ്റുക" : "സ്റ്റോക്കുണ്ട് ആക്കുക"}
                  </Button>

                  <button
                    onClick={() => {
                      if (confirm(`'${prod.nameMl}' നീക്കം ചെയ്യണമെന്ന് ഉറപ്പാണോ?`)) {
                        onDeleteProduct(prod.id);
                      }
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted transition-colors"
                    title="ഡിലീറ്റ് ചെയ്യുക"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS DASHBOARD */}
      {activeAdminTab === "orders" && (
        <div className="bg-card rounded-2xl border p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">ഉപഭോക്തൃ ഓർഡറുകൾ (Customer Orders)</h2>
              <p className="text-xs text-muted-foreground">
                പാലക്കാട് നഗരത്തിൽ നിന്നും വന്ന ഓർഡറുകളും കസ്റ്റമർ ഫോൺ നമ്പറുകളും
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              {orders.length} ഓർഡറുകൾ
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <ClipboardList className="w-10 h-10 mx-auto opacity-50" />
              <p className="font-semibold text-sm">ഇതുവരെ പുതിയ ഓർഡറുകൾ ഒന്നും വന്നിട്ടില്ല.</p>
              <p className="text-xs">കസ്റ്റമർ ആപ്പിൽ നിന്ന് ഓർഡർ ചെയ്യുമ്പോൾ ഇവിടെ തത്സമയം കാണാം.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border bg-background space-y-3 hover:border-emerald-500/50 transition-colors"
                >
                  {/* Order Top Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-muted px-2 py-1 rounded">
                        #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : "UPI Payment"}
                      </span>
                      <span className="font-extrabold text-base text-emerald-800 dark:text-emerald-300">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info Box with Quick Call / WhatsApp */}
                  <div className="bg-muted/40 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-bold text-foreground">
                        {order.customer.name} • <span className="font-mono text-emerald-800 dark:text-emerald-300 font-semibold">{order.customer.phone}</span>
                      </p>
                      <p className="text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 inline mr-1 text-emerald-600" />
                        {order.customer.address}
                        {order.customer.landmark ? ` (Landmark: ${order.customer.landmark})` : ""}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        ലൊക്കേഷൻ: {order.customer.zone} (പിൻകോഡ്: {order.customer.pincode})
                      </p>
                    </div>

                    {/* Quick Call / WhatsApp */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold text-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        വിളിക്കുക
                      </a>
                      <a
                        href={`https://wa.me/91${order.customer.phone}?text=പാലക്കാട് എക്കോ ഷോപ്പിൽ നിന്നുള്ള ഓർഡർ #${order.id} സംബന്ധിച്ച്:`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="text-xs space-y-1">
                    <span className="font-semibold text-muted-foreground">ഓർഡർ ചെയ്ത സാധനങ്ങൾ:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-foreground pl-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{item.nameMl}</span> ({item.quantity} x {item.unit}) - ₹{item.unitPrice * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Status Updater Buttons */}
                  <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      സ്റ്റാറ്റസ് മാറ്റുക:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        variant={order.status === "received" ? "default" : "outline"}
                        onClick={() => onUpdateOrderStatus(order.id, "received")}
                        className="text-[11px] h-7"
                      >
                        ലഭിച്ചു
                      </Button>
                      <Button
                        size="sm"
                        variant={order.status === "packed" ? "default" : "outline"}
                        onClick={() => onUpdateOrderStatus(order.id, "packed")}
                        className="text-[11px] h-7"
                      >
                        പാക്ക് ചെയ്തു
                      </Button>
                      <Button
                        size="sm"
                        variant={order.status === "out_for_delivery" ? "default" : "outline"}
                        onClick={() => onUpdateOrderStatus(order.id, "out_for_delivery")}
                        className="text-[11px] h-7"
                      >
                        ഡെലിവറിക്ക് ഇറങ്ങി
                      </Button>
                      <Button
                        size="sm"
                        variant={order.status === "delivered" ? "default" : "outline"}
                        onClick={() => onUpdateOrderStatus(order.id, "delivered")}
                        className="text-[11px] h-7 bg-emerald-700 hover:bg-emerald-800 text-white"
                      >
                        പൂർത്തിയായി
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
