import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as cartApi from "@/lib/medusa/cart";

interface CartStore {
  cartId: string | null;
  itemCount: number;
  isLoading: boolean;

  // Actions
  setCartId: (id: string) => void;
  setItemCount: (count: number) => void;
  incrementItemCount: () => void;
  decrementItemCount: () => void;
  resetCart: () => void;

  // Async actions
  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartId: null,
      itemCount: 0,
      isLoading: false,

      setCartId: (id) => set({ cartId: id }),

      setItemCount: (count) => set({ itemCount: count }),

      incrementItemCount: () =>
        set((state) => ({ itemCount: state.itemCount + 1 })),

      decrementItemCount: () =>
        set((state) => ({ itemCount: Math.max(0, state.itemCount - 1) })),

      resetCart: () => set({ cartId: null, itemCount: 0 }),

      initializeCart: async () => {
        const { cartId } = get();

        if (!cartId) {
          set({ isLoading: true });
          try {
            const cart = await cartApi.createCart();
            set({ cartId: cart.cart.id, isLoading: false });
          } catch (error) {
            console.error("Failed to create cart:", error);
            set({ isLoading: false });
          }
        }
      },

      addItem: async (variantId: string, quantity: number) => {
        const { cartId, initializeCart } = get();

        if (!cartId) {
          await initializeCart();
        }

        const currentCartId = get().cartId;
        if (!currentCartId) return;

        set({ isLoading: true });
        try {
          await cartApi.addLineItem(currentCartId, variantId, quantity);
          set((state) => ({
            itemCount: state.itemCount + quantity,
            isLoading: false,
          }));
        } catch (error) {
          console.error("Failed to add item:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      updateItem: async (lineItemId: string, quantity: number) => {
        const { cartId } = get();
        if (!cartId) return;

        set({ isLoading: true });
        try {
          await cartApi.updateLineItem(cartId, lineItemId, quantity);
          set({ isLoading: false });
          // Item count will be updated when cart is refreshed
        } catch (error) {
          console.error("Failed to update item:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      removeItem: async (lineItemId: string) => {
        const { cartId } = get();
        if (!cartId) return;

        set({ isLoading: true });
        try {
          await cartApi.removeLineItem(cartId, lineItemId);
          set((state) => ({
            itemCount: Math.max(0, state.itemCount - 1),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Failed to remove item:", error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "pharma-cart-storage",
      partialize: (state) => ({
        cartId: state.cartId,
        itemCount: state.itemCount,
      }),
    }
  )
);
