"use client";

import React from "react";
import {
  Wheat,
  ShoppingBag,
  User,
  Store,
  PackageCheck,
  MapPin,
  LogIn,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomerProfile } from "@/types";
import { InstallPwaPrompt } from "./InstallPwaPrompt";

interface NavbarProps {
  activeTab: "shop" | "my-orders" | "admin";
  setActiveTab: (tab: "shop" | "my-orders" | "admin") => void;
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
  customer: CustomerProfile;
  openProfile: () => void;
  openAuth: () => void;
  onLogout: () => void;
  announcement?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  openCart,
  customer,
  openProfile,
  openAuth,
  onLogout,
  announcement,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
      {/* PWA Install Banner */}
      <InstallPwaPrompt />

      {/* Top Announcement Bar */}
      <div className="bg-emerald-900 text-emerald-100 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <span className="text-amber-400">🌾</span>
        <span className="truncate">
          {announcement ||
            "പാലക്കാട് നഗരസഭയിലെ കർഷകരുടെ രണ്ടാം വിള നാടൻ കുത്തരി വീട്ടുപടിക്കൽ എത്തിക്കുന്നു!"}
        </span>
      </div>

      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab("shop")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Wheat className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-emerald-950 dark:text-emerald-50">
                ടീം പാഡി പാലക്കാട്
              </span>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex text-[10px] bg-amber-50 text-amber-900 border-amber-300 font-bold"
              >
                അരി കൂട്ടായ്മ
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              പാലക്കാട് • അരി ഉല്പാദകരുടെയും ഉപഭോക്താക്കളുടെയും കൂട്ടായ്മ
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center bg-muted/60 p-1 rounded-lg border text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("shop")}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "shop"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Store className="w-4 h-4 text-emerald-700" />
            <span className="hidden xs:inline">അരി ഓർഡർ ചെയ്യുക</span>
            <span className="xs:hidden">ഷോപ്പ്</span>
          </button>
          <button
            onClick={() => setActiveTab("my-orders")}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "my-orders"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PackageCheck className="w-4 h-4 text-blue-600" />
            <span className="hidden xs:inline">എന്റെ ഓർഡറുകൾ</span>
            <span className="xs:hidden">ഓർഡറുകൾ</span>
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "admin"
                ? "bg-emerald-800 text-white shadow-xs font-bold"
                : "text-emerald-800 hover:text-emerald-900 font-semibold"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>അഡ്മിൻ പാനൽ</span>
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* User Auth / Profile Button */}
          {customer.isRegistered && customer.name ? (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={openProfile}
                className="text-xs flex items-center gap-1.5 border-dashed h-8 px-2.5"
                title="വിലാസവും പ്രൊഫൈലും മാറ്റുക"
              >
                {customer.photoURL ? (
                  <img
                    src={customer.photoURL}
                    alt={customer.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                )}
                <span className="max-w-[90px] truncate font-medium">
                  {customer.name}
                </span>
              </Button>
              <button
                onClick={onLogout}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg transition-colors"
                title="ലോഗൗട്ട് (Logout)"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={openAuth}
              className="text-xs flex items-center gap-1.5 h-8 px-2.5 border-emerald-300 text-emerald-800 dark:text-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 font-semibold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>ലോഗിൻ</span>
            </Button>
          )}

          {/* Cart Button */}
          <Button
            onClick={openCart}
            size="sm"
            className="bg-emerald-800 hover:bg-emerald-900 text-white relative shadow-sm h-8"
          >
            <ShoppingBag className="w-4 h-4 mr-1.5 text-amber-300" />
            <span className="font-semibold text-xs">₹{cartTotal}</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-emerald-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
