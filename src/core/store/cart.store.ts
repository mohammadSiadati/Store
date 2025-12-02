'use client';

import { create } from 'zustand';
import type { Product } from '@/features/products/api/types';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void; // ⬅️ جدید
};

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { product, quantity }],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: quantity < 1 ? 1 : quantity }
          : item
      ),
    })),

  clearCart: () => set({ items: [] }),

  // ⬅️ برای پر کردن سبد با آیتم‌های یک سفارش
  setItems: (items) => set({ items }),
}));
