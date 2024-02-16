import { create } from "zustand";

const useAuthStore = create((set) => ({
  auth: {
    username: "",
    isAdmin: false,
    userId: null,
  },
  setUsername: (name) =>
    set((state) => ({ auth: { ...state.auth, username: name } })),
  setIsAdmin: (isAdmin) =>
    set((state) => ({ auth: { ...state.auth, isAdmin } })),
  setUserId: (userId) => set((state) => ({ auth: { ...state.auth, userId } })),
  getIsAdmin: () => (state) => state.auth.isAdmin,
  getUserId: () => (state) => state.auth.userId,
}));

export { useAuthStore };
