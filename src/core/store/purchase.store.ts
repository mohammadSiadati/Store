'use client';

import { create } from 'zustand';
import type { CartItem } from '@/core/store/cart.store';

export type PurchaseOrder = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

type PurchaseState = {
  orders: PurchaseOrder[];
  addOrder: (payload: Omit<PurchaseOrder, 'id' | 'createdAt'>) => void;
  clearOrders: () => void;
  removeOrder: (id: string) => void; // ⬅️ جدید
};

export const usePurchaseStore = create<PurchaseState>((set) => ({
  orders: [],

  addOrder: (payload) =>
    set((state) => {
      const id = `ORD-${Date.now()}`;
      const createdAt = new Date().toISOString();

      const newOrder: PurchaseOrder = {
        id,
        createdAt,
        ...payload,
      };

      return {
        orders: [newOrder, ...state.orders],
      };
    }),

  clearOrders: () => set({ orders: [] }),

  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
    })),
}));
