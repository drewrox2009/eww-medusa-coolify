import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer } from "@/lib/types";
import * as authApi from "@/lib/medusa/auth";

interface UserStore {
  user: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (updates: Partial<Customer>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          const user = {
            id: response.customer?.id || response.user?.id,
            email: response.customer?.email || response.user?.email,
            first_name:
              response.customer?.first_name || response.user?.first_name,
            last_name: response.customer?.last_name || response.user?.last_name,
            phone: response.customer?.phone || response.user?.phone,
            has_account: true,
          };
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Login failed",
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          const user = {
            id: response.customer?.id,
            email: response.customer?.email,
            first_name: response.customer?.first_name,
            last_name: response.customer?.last_name,
            phone: response.customer?.phone,
            has_account: true,
          };
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Registration failed",
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Even if logout fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || "Logout failed",
          });
        }
      },

      loadUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.getCurrentUser();
          const user = {
            id: response.customer?.id || response.user?.id,
            email: response.customer?.email || response.user?.email,
            first_name:
              response.customer?.first_name || response.user?.first_name,
            last_name: response.customer?.last_name || response.user?.last_name,
            phone: response.customer?.phone || response.user?.phone,
            has_account: true,
          };
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null, // Don't show error for failed session check
          });
        }
      },

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
