import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    tier: 'free' | 'pro' | 'team';
    usageCount: number;
    usageLimit: number;
    timesSaved: number; // in minutes
    bugsPrevented: number;
    incrementUsage: () => void;
    resetUsage: () => void;
    upgradeTier: (tier: 'pro' | 'team') => void;
    addTimeSaved: (minutes: number) => void;
    incrementBugsPrevented: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            tier: 'free',
            usageCount: 0,
            usageLimit: 10,
            timesSaved: 0,
            bugsPrevented: 0,
            incrementUsage: () => set((state) => ({ usageCount: state.usageCount + 1 })),
            resetUsage: () => set({ usageCount: 0 }),
            upgradeTier: (tier) => set({ tier, usageLimit: Infinity }),
            addTimeSaved: (minutes) => set((state) => ({ timesSaved: state.timesSaved + minutes })),
            incrementBugsPrevented: () => set((state) => ({ bugsPrevented: state.bugsPrevented + 1 })),
        }),
        {
            name: 'debugmate-user',
        }
    )
);
