import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SubscriptionState {
    isPremium: boolean;
    analysisCount: number;
    maxFreeAnalysis: number;
    showPricingModal: boolean;

    incrementUsage: () => void;
    resetUsage: () => void;
    upgradeToPremium: () => void;
    setShowPricingModal: (show: boolean) => void;
    checkLimit: () => boolean; // Returns true if allowed, false if limit reached
}

export const useSubscriptionStore = create<SubscriptionState>()(
    persist(
        (set, get) => ({
            isPremium: false,
            analysisCount: 0,
            maxFreeAnalysis: 5,
            showPricingModal: false,

            incrementUsage: () => set((state) => ({ analysisCount: state.analysisCount + 1 })),

            resetUsage: () => set({ analysisCount: 0 }),

            upgradeToPremium: () => set({ isPremium: true, showPricingModal: false }),

            setShowPricingModal: (show) => set({ showPricingModal: show }),

            checkLimit: () => {
                const state = get();
                if (state.isPremium) return true;
                if (state.analysisCount < state.maxFreeAnalysis) return true;

                // Limit reached
                set({ showPricingModal: true });
                return false;
            }
        }),
        {
            name: 'subscription-storage',
        }
    )
);
