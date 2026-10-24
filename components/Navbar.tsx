"use client";

import React from "react";
import { Leaf, ShoppingBag, User, Store, PackageCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomerProfile } from "@/types";

interface NavbarProps {
  activeTab: "shop" | "my-orders" | "admin";
  setActiveTab: (tab: "shop" | "my-orders" | "admin") => void;
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
  customer: CustomerProfile;
  openProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  openCart,
  customer,
  openProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
      {/* Top Palakkad delivery banner */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
        <span>
          പാലക്കാട് ടൗൺ, ഒലവക്കോട്, കൽപ്പാത്തി, പുതുശ്ശേരി & സമീപ പ്രദേശങ്ങളിൽ ഹോം ഡെലിവറി ലഭ്യമാണ്!
        </span>
      </div>

      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab("shop")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base md:text-lg tracking-tight text-emerald-950 dark:text-emerald-50">
                പാലക്കാട് എക്കോ ഷോപ്പ്
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                Eco Shop
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Organic & Eco-friendly Goods • Palakkad
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center bg-muted/60 p-1 rounded-lg border text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("shop")}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "shop"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span className="hidden xs:inline">ഷോപ്പ്</span>
          </button>
          <button
            onClick={() => setActiveTab("my-orders")}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "my-orders"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PackageCheck className="w-4 h-4 text-blue-600" />
            <span className="hidden xs:inline">ഓർഡറുകൾ</span>
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "admin"
                ? "bg-emerald-700 text-white shadow-xs font-semibold"
                : "text-emerald-700 hover:text-emerald-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>അഡ്മിൻ പാനൽ</span>
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* User Profile Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={openProfile}
            className="text-xs flex items-center gap-1.5 border-dashed"
          >
            <User className="w-4 h-4 text-emerald-700" />
            <span className="hidden md:inline max-w-[100px] truncate">
              {customer.isRegistered && customer.name ? customer.name : "ലോഗിൻ / പ്രൊഫൈൽ"}
            </span>
          </Button>

          {/* Cart Button */}
          <Button
            onClick={openCart}
            size="sm"
            className="bg-emerald-700 hover:bg-emerald-800 text-white relative shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            <span className="font-semibold text-xs">₹{cartTotal}</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
