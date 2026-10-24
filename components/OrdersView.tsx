"use client";

import React from "react";
import { Package, Clock, CheckCircle2, MapPin, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "@/types";

interface OrdersViewProps {
  orders: Order[];
  onOpenShop: () => void;
  onViewReceipt: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onOpenShop, onViewReceipt }) => {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "received":
        return <Badge className="bg-amber-500 text-white text-xs">ഓർഡർ ലഭിച്ചു</Badge>;
      case "packed":
        return <Badge className="bg-blue-600 text-white text-xs">പാക്ക് ചെയ്തു</Badge>;
      case "out_for_delivery":
        return <Badge className="bg-purple-600 text-white text-xs">ഡെലിവറിക്ക് ഇറങ്ങി</Badge>;
      case "delivered":
        return <Badge className="bg-emerald-600 text-white text-xs">ഡെലിവറി പൂർത്തിയായി</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-700" />
            എന്റെ ഓർഡറുകൾ (My Orders)
          </h2>
          <p className="text-xs text-muted-foreground">
            നിങ്ങൾ നൽകിയ ഓർഡറുകളുടെ തത്സമയ സ്റ്റാറ്റസ് ഇവിടെ കാണാം.
          </p>
        </div>
        <Button size="sm" onClick={onOpenShop} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs">
          <ShoppingBag className="w-3.5 h-3.5 mr-1" />
          കൂടുതൽ സാധനങ്ങൾ വാങ്ങാം
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-card rounded-2xl border p-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <Package className="w-8 h-8" />
          </div>
          <p className="font-bold text-base">നിങ്ങൾ ഇതുവരെ ഓർഡറുകൾ ഒന്നും നൽകിയിട്ടില്ല.</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            പാലക്കാട് എക്കോ ഷോപ്പിലെ ഓർഗാനിക് ഉൽപ്പന്നങ്ങൾ തിരഞ്ഞെടുത്ത് ഓർഡർ ചെയ്യൂ.
          </p>
          <Button onClick={onOpenShop} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs mt-2">
            ഷോപ്പിലേക്ക് പോകുക
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-2xl border p-4 shadow-xs space-y-3 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-muted px-2 py-0.5 rounded">
                    #{order.id}
                  </span>
                  {getStatusBadge(order.status)}
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-emerald-800 dark:text-emerald-300">
                    ₹{order.total}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewReceipt(order)}
                    className="text-xs h-7"
                  >
                    ബിൽ കാണുക
                  </Button>
                </div>
              </div>

              {/* Items summary */}
              <div className="text-xs space-y-1">
                <div className="flex flex-wrap gap-1.5">
                  {order.items.map((i, idx) => (
                    <span
                      key={idx}
                      className="bg-muted px-2 py-1 rounded-md text-[11px] font-medium"
                    >
                      {i.nameMl} ({i.quantity} x {i.unit})
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  ഡെലിവറി: {order.customer.address}, {order.customer.zone}
                </span>
                <span className="font-semibold uppercase text-foreground">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : "UPI"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
