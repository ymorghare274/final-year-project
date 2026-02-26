import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    phone?: string;
    addresses?: any[];
    saved_cards?: any[];
}

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    updateUser: (updatedData: Partial<User>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            updateUser: (updatedData) => set((state) => ({
                user: state.user ? { ...state.user, ...updatedData } : null
            })),
            logout: () => {
                set({ user: null });
                localStorage.removeItem('auth-storage');
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);
