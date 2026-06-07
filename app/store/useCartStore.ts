import { create } from "zustand";

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  color: string;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string) => void;
  updateQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item: CartItem) =>
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.productId === item.productId && i.color === item.color
      );

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId && i.color === item.color
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }

      return { items: [...state.items, item] };
    }),

  removeItem: (productId: string, color: string) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.color === color)
      ),
    })),

  updateQuantity: (productId: string, color: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.color === color
          ? { ...i, quantity }
          : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));