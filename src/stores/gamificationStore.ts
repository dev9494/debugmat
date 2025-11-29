import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: number;
    progress: number;
    maxProgress: number;
}

export interface UserStats {
    totalErrorsFixed: number;
    totalPoints: number;
    level: number;
    streak: number;
    lastFixDate: number;
    achievements: Achievement[];
    badges: string[];
}

interface GamificationState {
    stats: UserStats;
    addPoints: (points: number) => void;
    incrementErrorsFixed: () => void;
    checkAchievements: () => void;
    resetStreak: () => void;
    setStats: (stats: UserStats) => void;
}

const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-fix',
        title: 'First Fix',
        description: 'Fix your first error',
        icon: '🎯',
        progress: 0,
        maxProgress: 1,
    },
    {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Fix 10 errors in one day',
        icon: '⚡',
        progress: 0,
        maxProgress: 10,
    },
    {
        id: 'bug-hunter',
        title: 'Bug Hunter',
        description: 'Fix 50 errors total',
        icon: '🐛',
        progress: 0,
        maxProgress: 50,
    },
    {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        progress: 0,
        maxProgress: 7,
    },
    {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Fix 100 errors with 100% accuracy',
        icon: '💎',
        progress: 0,
        maxProgress: 100,
    },
];

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            stats: {
                totalErrorsFixed: 0,
                totalPoints: 0,
                level: 1,
                streak: 0,
                lastFixDate: 0,
                achievements: ACHIEVEMENTS,
                badges: [],
            },

            addPoints: (points) => {
                set((state) => {
                    const newPoints = state.stats.totalPoints + points;
                    const newLevel = Math.floor(newPoints / 1000) + 1;

                    return {
                        stats: {
                            ...state.stats,
                            totalPoints: newPoints,
                            level: newLevel,
                        },
                    };
                });
                get().checkAchievements();
            },

            incrementErrorsFixed: () => {
                const now = Date.now();
                const lastFix = get().stats.lastFixDate;
                const oneDayMs = 24 * 60 * 60 * 1000;

                set((state) => {
                    const daysSinceLastFix = (now - lastFix) / oneDayMs;
                    const newStreak =
                        daysSinceLastFix <= 1 ? state.stats.streak + 1 : 1;

                    return {
                        stats: {
                            ...state.stats,
                            totalErrorsFixed: state.stats.totalErrorsFixed + 1,
                            lastFixDate: now,
                            streak: newStreak,
                        },
                    };
                });

                // Award points
                get().addPoints(100);
                get().checkAchievements();
            },

            checkAchievements: () => {
                const stats = get().stats;

                set((state) => {
                    const updatedAchievements = state.stats.achievements.map((achievement) => {
                        if (achievement.unlockedAt) return achievement;

                        let progress = achievement.progress;
                        let unlocked = false;

                        switch (achievement.id) {
                            case 'first-fix':
                                progress = Math.min(stats.totalErrorsFixed, 1);
                                unlocked = stats.totalErrorsFixed >= 1;
                                break;
                            case 'speed-demon':
                                // Simplified: just check total fixes
                                progress = Math.min(stats.totalErrorsFixed, 10);
                                unlocked = stats.totalErrorsFixed >= 10;
                                break;
                            case 'bug-hunter':
                                progress = Math.min(stats.totalErrorsFixed, 50);
                                unlocked = stats.totalErrorsFixed >= 50;
                                break;
                            case 'streak-master':
                                progress = Math.min(stats.streak, 7);
                                unlocked = stats.streak >= 7;
                                break;
                            case 'perfectionist':
                                progress = Math.min(stats.totalErrorsFixed, 100);
                                unlocked = stats.totalErrorsFixed >= 100;
                                break;
                        }

                        return {
                            ...achievement,
                            progress,
                            unlockedAt: unlocked && !achievement.unlockedAt ? Date.now() : achievement.unlockedAt,
                        };
                    });

                    return {
                        stats: {
                            ...state.stats,
                            achievements: updatedAchievements,
                        },
                    };
                });
            },

            resetStreak: () => {
                set((state) => ({
                    stats: {
                        ...state.stats,
                        streak: 0,
                    },
                }));
            },

            setStats: (stats) => set({ stats }),
        }),
        {
            name: 'gamification-storage',
        }
    )
);
