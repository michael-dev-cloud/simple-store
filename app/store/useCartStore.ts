import { create } from "zustand";

export const useCart = create((set) => ({
  items: [],
  addItem: (item:any) =>
    set((state:any) => ({
      items: [...state.items, item]
    })),
}));