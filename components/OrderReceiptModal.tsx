"use client";

import React from "react";
import { CheckCircle2, MessageSquare, Printer, X, MapPin, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/types";

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const shopWhatsAppNumber = "919447000000"; // Shop WhatsApp Number
  const orderItemsText = order.items
    .map((i) => `• ${i.nameMl} (${i.quantity} x ${i.unit}) - ₹${i.unitPrice * i.quantity}`)
    .join("%0A");

  const whatsappMessage = `*പാലക്കാട് എക്കോ ഷോപ്പ് - പുതിയ ഓർഡർ #${order.id}*%0A%0A*കസ്റ്റമർ വിവരങ്ങൾ:*%0Aപേര്: ${order.customer.name}%0Aഫോൺ: ${order.customer.phone}%0Aവിലാസം: ${order.customer.address}%0ALandmark: ${order.customer.landmark || "N/A"}%0Aഡെലിവറി പ്രദേശം: ${order.customer.zone}%0A%0A*സാധനങ്ങൾ:*%0A${orderItemsText}%0A%0A*ആകെ തുക:* ₹${order.total}%0Aപേയ്‌മെന്റ് രീതി: ${order.paymentMethod === "cod" ? "Cash on Delivery" : "UPI"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">ഓർഡർ വിജയകരമായി നൽകി!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            പാലക്കാട് എക്കോ ഷോപ്പിലേക്ക് നിങ്ങളുടെ ഓർഡർ ലഭിച്ചിട്ടുണ്ട്.
          </p>
          <div className="mt-3 inline-block bg-white/20 px-3 py-1 rounded-full font-mono text-xs font-bold">
            Order #{order.id}
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
          {/* Customer & Delivery Details */}
          <div className="p-3 bg-muted/40 rounded-xl space-y-1">
            <p className="font-bold text-foreground">ഡെലിവറി വിലാസം:</p>
            <p className="font-semibold text-emerald-800 dark:text-emerald-300">
              {order.customer.name} ({order.customer.phone})
            </p>
            <p className="text-muted-foreground">
              {order.customer.address}
              {order.customer.landmark ? `, Landmark: ${order.customer.landmark}` : ""}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              {order.customer.zone} (പിൻകോഡ്: {order.customer.pincode})
            </p>
          </div>

          {/* Items Summary */}
          <div className="space-y-2 border-t pt-3">
            <p className="font-bold text-foreground">വാങ്ങിയ സാധനങ്ങൾ:</p>
            <div className="divide-y text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{item.nameMl}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.quantity} x {item.unit} @ ₹{item.unitPrice}
                    </p>
                  </div>
                  <span className="font-bold">₹{item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment summary */}
          <div className="p-3 rounded-xl bg-muted/20 border space-y-1 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>ഉൽപ്പന്ന തുക</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>ഡെലിവറി ചാർജ്ജ്</span>
              <span>{order.deliveryCharge === 0 ? "സൗജന്യം" : `₹${order.deliveryCharge}`}</span>
            </div>
            <div className="border-t pt-1.5 flex justify-between font-bold text-sm text-foreground">
              <span>ആകെ തുക</span>
              <span className="text-emerald-800 dark:text-emerald-300 text-base">₹{order.total}</span>
            </div>
            <div className="text-[11px] text-muted-foreground pt-1">
              രീതി: <span className="font-semibold uppercase">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-muted/20 flex flex-col sm:flex-row items-center gap-2">
          {/* Send to WhatsApp */}
          <a
            href={`https://wa.me/${shopWhatsAppNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            ഷോപ്പിലേക്ക് WhatsApp അയക്കുക
          </a>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto h-10 text-xs font-medium"
          >
            ശരി, ക്ലോസ് ചെയ്യുക
          </Button>
        </div>
      </div>
    </div>
  );
};
