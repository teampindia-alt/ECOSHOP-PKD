"use client";

import React from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group relative bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Section */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges on Image */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <Badge className="bg-emerald-800/90 text-white border-0 text-[10px] font-semibold tracking-wide backdrop-blur-xs">
            {product.category}
          </Badge>
          {discountPercent && (
            <Badge className="bg-amber-600 text-white border-0 text-[10px] font-bold">
              {discountPercent}% OFF
            </Badge>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              സ്റ്റോക്ക് തീർന്നു (Out of Stock)
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {product.unit}
            </span>
            {product.inStock && (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                ലഭ്യമാണ്
              </span>
            )}
          </div>

          <h3 className="font-bold text-sm md:text-base text-foreground leading-snug line-clamp-2">
            {product.nameMl}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {product.nameEn}
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="pt-2 border-t flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg md:text-xl font-extrabold text-emerald-900 dark:text-emerald-100">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">വില / {product.unit}</span>
          </div>

          {/* Cart Controls */}
          {product.inStock ? (
            quantityInCart > 0 ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 rounded-xl p-1">
                <button
                  onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 flex items-center justify-center font-bold hover:bg-emerald-100 shadow-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-emerald-900 dark:text-emerald-100">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                  className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold hover:bg-emerald-800 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart(product)}
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium px-3 h-8 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                വാങ്ങുക
              </Button>
            )
          ) : (
            <Button disabled size="sm" variant="outline" className="text-xs h-8">
              ലഭ്യമല്ല
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
