import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: string;
  is_active: boolean;
  student?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
}

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined') return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  logout: async () => {
    try { await api.post('/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    const { data } = await api.get('/me');
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));
