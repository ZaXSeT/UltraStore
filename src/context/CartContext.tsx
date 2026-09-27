"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, OrderGroup } from "../lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string, offerId: string) => void;
  updateQuantity: (variantId: string, offerId: string, quantity: number) => void;
  clearCart: () => void;
  getGroupedItems: () => OrderGroup[];
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ultrastore_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("ultrastore_cart", JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.variantId === item.variantId && i.offerId === item.offerId
      );
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId && i.offerId === item.offerId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (variantId: string, offerId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.variantId === variantId && i.offerId === offerId))
    );
  };

  const updateQuantity = (variantId: string, offerId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId, offerId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId && i.offerId === offerId
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getGroupedItems = (): OrderGroup[] => {
    const groupsMap = new Map<string, CartItem[]>();

    for (const item of items) {
      const groupKey =
        item.offerType === "READY"
          ? "READY"
          : `PREORDER:${item.batchId || "default"}`;
      const group = groupsMap.get(groupKey) || [];
      group.push(item);
      groupsMap.set(groupKey, group);
    }

    const groups: OrderGroup[] = [];
    const shippingPerGroup = 25000; // Flat domestic baseline IDR 25.000 per shipment group

    for (const [groupKey, groupItems] of groupsMap.entries()) {
      const isReady = groupKey === "READY";
      const sampleItem = groupItems[0];
      const subtotal = groupItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      groups.push({
        groupKey,
        offerType: isReady ? "READY" : "PREORDER",
        batchId: isReady ? null : sampleItem.batchId,
        batchName: isReady ? null : sampleItem.batchName,
        etaRange: isReady ? "1-2 hari kerja" : sampleItem.etaRange,
        items: groupItems,
        subtotal,
        shippingFee: shippingPerGroup,
        total: subtotal + shippingPerGroup,
      });
    }

    return groups;
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getGroupedItems,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
