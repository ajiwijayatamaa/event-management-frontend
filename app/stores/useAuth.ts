import { create } from "zustand";
import { persist } from "zustand/middleware";

//apa yang ingin di simpan di global state
export type UserAuth = {
  id: number;
  name: string;
  email: string;
  role: string;
  provider: string;
  referralCode: string;
  referredBy: number | null;
  profilePicture: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
};

type Store = {
  user: UserAuth | null;
  login: (payload: UserAuth) => void;
  logout: () => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      login: (payload) => set(() => ({ user: payload })),
      logout: () => set(() => ({ user: null })),
    }),
    { name: "user-auth-storage" },
  ),
);
