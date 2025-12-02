import { create } from 'zustand';

type OrderState = {
  id: number | string;
  setId: (id: number | string) => void;
};

export const useOrderStore = create<OrderState>((set) => ({
  id: '',
  setId: (id) => set({ id }),
}));
