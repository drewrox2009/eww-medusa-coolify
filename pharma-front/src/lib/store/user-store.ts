import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer } from "@/lib/types";

interface UserStore {
  user: Customer | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: Customer | null) => void;
  logout: () => void;
  updateUser: (updates: Partial<Customer>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "pharma-user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
