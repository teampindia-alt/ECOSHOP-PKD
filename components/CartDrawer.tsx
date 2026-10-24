"use client";

import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem, CustomerProfile, Order } from "@/types";
import { PALAKKAD_DELIVERY_ZONES } from "@/lib/sample-data";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  customer: CustomerProfile;
  onOpenProfile: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  customer,
  onOpenProfile,
  onUpdateQuantity,
  onClearCart,
  onOrderPlaced,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentZone =
    PALAKKAD_DELIVERY_ZONES.find((z) => z.id === customer.zone) ||
    PALAKKAD_DELIVERY_ZONES[0];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryCharge =
    subtotal === 0 || subtotal >= currentZone.minFreeDelivery ? 0 : currentZone.deliveryFee;

  const total = subtotal + deliveryCharge;

  const handleCheckout = () => {
    if (!customer.isRegistered || !customer.phone || !customer.address) {
      onOpenProfile();
      return;
    }

    setIsSubmitting(true);

    const orderId = `PKD-ECO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customer: { ...customer },
      items: cart.map((c) => ({
        productId: c.product.id,
        nameMl: c.product.nameMl,
        nameEn: c.product.nameEn,
        unitPrice: c.product.price,
        quantity: c.quantity,
        unit: c.product.unit,
      })),
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      deliveryNotes,
      status: "received",
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onOrderPlaced(newOrder);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h2 className="font-bold text-base">നിങ്ങളുടെ കാർട്ട് (Cart)</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} ഇനങ്ങൾ
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-semibold text-sm">നിങ്ങളുടെ കാർട്ട് കാലിയാണ്!</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                പാലക്കാട് എക്കോ ഷോപ്പിലെ ഓർഗാനിക് ഉൽപ്പന്നങ്ങൾ കാർട്ടിലേക്ക് ചേർക്കൂ.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="mt-2 text-xs text-emerald-700"
              >
                ഷോപ്പിംഗ് തുടരുക
              </Button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2.5">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border bg-background/50 hover:bg-muted/30 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.nameEn}
                      className="w-14 h-14 rounded-lg object-cover bg-muted shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-foreground truncate">
                        {product.nameMl}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        ₹{product.price} / {product.unit}
                      </p>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                        ₹{product.price * quantity}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg p-1 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 rounded bg-background flex items-center justify-center text-xs hover:bg-card shadow-xs"
                      >
                        {quantity === 1 ? (
                          <Trash2 className="w-3 h-3 text-destructive" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </button>
                      <span className="w-4 text-center text-xs font-bold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 rounded bg-emerald-700 text-white flex items-center justify-center text-xs hover:bg-emerald-800 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Summary Box */}
              <div className="rounded-xl border p-3 bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    ഡെലിവറി വിലാസം (Palakkad)
                  </span>
                  <button
                    onClick={onOpenProfile}
                    className="text-[11px] font-semibold text-emerald-700 hover:underline"
                  >
                    {customer.isRegistered ? "മാറ്റുക (Edit)" : "+ വിലാസം ചേർക്കുക"}
                  </button>
                </div>

                {customer.isRegistered && customer.phone ? (
                  <div className="text-xs space-y-1 text-muted-foreground border-t pt-2">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {customer.name} ({customer.phone})
                    </p>
                    <p className="line-clamp-2">
                      {customer.address}
                      {customer.landmark ? `, Landmark: ${customer.landmark}` : ""}
                    </p>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {currentZone.nameMl} • {currentZone.estimateTime}
                    </p>
                  </div>
                ) : (
                  <div className="text-xs p-2.5 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                    ഓർഡർ ചെയ്യുന്നതിന് ദയവായി നിങ്ങളുടെ പേരും പാലക്കാട്ടെ ഡെലിവറി വിലാസവും ഫോൺ നമ്പറും നൽകുക.
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border p-3 space-y-2">
                <span className="text-xs font-bold text-foreground">പേയ്‌മെന്റ് രീതി (Payment Method)</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950 font-bold text-emerald-900 dark:text-emerald-100"
                        : "hover:bg-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-emerald-700"
                    />
                    <span>ക്യാഷ് ഓൺ ഡെലിവറി (COD)</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === "upi"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950 font-bold text-emerald-900 dark:text-emerald-100"
                        : "hover:bg-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="accent-emerald-700"
                    />
                    <span>UPI / GPay / QR</span>
                  </label>
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <input
                  type="text"
                  placeholder="ഡെലിവറി നിർദ്ദേശങ്ങൾ (ഉദാ: കോളിംഗ് ബെൽ അടിക്കുക)"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border bg-background"
                />
              </div>

              {/* Bill Details */}
              <div className="rounded-xl border p-3 space-y-1.5 text-xs bg-muted/20">
                <div className="flex justify-between text-muted-foreground">
                  <span>ഉൽപ്പന്നങ്ങളുടെ തുക (Subtotal)</span>
                  <span className="font-medium text-foreground">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>ഡെലിവറി ചാർജ്ജ് ({currentZone.nameEn})</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">സൗജന്യം (FREE)</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-[10px] text-amber-600">
                    💡 ₹{currentZone.minFreeDelivery} രൂപയ്ക്ക് മുകളിൽ സൗജന്യ ഡെലിവറി (ഇനിയും ₹
                    {currentZone.minFreeDelivery - subtotal} വാങ്ങിയാൽ മതി).
                  </p>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-sm text-foreground">
                  <span>ആകെ തുക (Grand Total)</span>
                  <span className="text-emerald-800 dark:text-emerald-300 text-base">
                    ₹{total}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-background space-y-2">
            <Button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md"
            >
              {isSubmitting ? (
                "ഓർഡർ സമർപ്പിക്കുന്നു..."
              ) : !customer.isRegistered ? (
                "വിലാസം നൽകി ഓർഡർ പൂർത്തിയാക്കുക"
              ) : (
                <>
                  <span>ഓർഡർ സ്ഥിരീകരിക്കുക (₹{total})</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
