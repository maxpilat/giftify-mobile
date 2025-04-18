import { API } from '@/constants/api';
import { apiFetch } from '@/lib/api';
import { AuthData } from '@/models';
import { create } from 'zustand';

interface AuthStore {
  user: AuthData | null;
  token: string | null;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: AuthData & { name: string; surname: string }) => Promise<void>;
  signOut: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  signIn: async (email, password) => {
    const response: Response = await apiFetch(API.auth.login, 'POST', { email, password });
    const { id, token } = (await response.json()) as { id: number; token: string };

    set({ user: { userId: id, email, password }, token });
  },

  signUp: async (userData) => {
    const response: Response = await apiFetch(API.auth.login, 'POST', userData);
    const { id, token } = (await response.json()) as { id: number; token: string };

    set({ user: { ...userData, userId: id }, token });
  },

  signOut: () => {
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
