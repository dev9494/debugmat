import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    githubToken: string | null;
    username: string | null;
    avatar: string | null;
    isAuthenticated: boolean;
    login: (token: string, userData: { username: string; avatar: string }) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            githubToken: null,
            username: null,
            avatar: null,
            isAuthenticated: false,
            login: (token, userData) => set({
                githubToken: token,
                username: userData.username,
                avatar: userData.avatar,
                isAuthenticated: true
            }),
            logout: () => set({
                githubToken: null,
                username: null,
                avatar: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'debugmate-auth',
        }
    )
);
