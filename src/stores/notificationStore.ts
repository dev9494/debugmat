import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ErrorSeverity } from './errorStore';

export interface NotificationRule {
    id: string;
    name: string;
    enabled: boolean;
    conditions: {
        severity?: ErrorSeverity[];
        errorType?: string[];
        frequency?: 'immediate' | 'hourly' | 'daily';
    };
    channels: ('email' | 'slack' | 'discord' | 'teams')[];
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    severity: ErrorSeverity;
    timestamp: number;
    read: boolean;
    actionUrl?: string;
}

interface NotificationState {
    notifications: Notification[];
    rules: NotificationRule[];
    unreadCount: number;

    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;

    addRule: (rule: Omit<NotificationRule, 'id'>) => void;
    updateRule: (id: string, updates: Partial<NotificationRule>) => void;
    deleteRule: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set) => ({
            notifications: [],
            rules: [
                {
                    id: 'default-critical',
                    name: 'Critical Errors',
                    enabled: true,
                    conditions: {
                        severity: ['critical'],
                        frequency: 'immediate',
                    },
                    channels: ['email', 'slack'],
                },
                {
                    id: 'default-daily',
                    name: 'Daily Digest',
                    enabled: true,
                    conditions: {
                        frequency: 'daily',
                    },
                    channels: ['email'],
                },
            ],
            unreadCount: 0,

            addNotification: (notification) => {
                const newNotification: Notification = {
                    ...notification,
                    id: `notif-${Date.now()}`,
                    timestamp: Date.now(),
                    read: false,
                };

                set((state) => ({
                    notifications: [newNotification, ...state.notifications],
                    unreadCount: state.unreadCount + 1,
                }));
            },

            markAsRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                    unreadCount: Math.max(0, state.unreadCount - 1),
                }));
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                    unreadCount: 0,
                }));
            },

            deleteNotification: (id) => {
                set((state) => {
                    const notification = state.notifications.find((n) => n.id === id);
                    return {
                        notifications: state.notifications.filter((n) => n.id !== id),
                        unreadCount: notification && !notification.read
                            ? Math.max(0, state.unreadCount - 1)
                            : state.unreadCount,
                    };
                });
            },

            clearAll: () => {
                set({ notifications: [], unreadCount: 0 });
            },

            addRule: (rule) => {
                const newRule: NotificationRule = {
                    ...rule,
                    id: `rule-${Date.now()}`,
                };

                set((state) => ({
                    rules: [...state.rules, newRule],
                }));
            },

            updateRule: (id, updates) => {
                set((state) => ({
                    rules: state.rules.map((r) =>
                        r.id === id ? { ...r, ...updates } : r
                    ),
                }));
            },

            deleteRule: (id) => {
                set((state) => ({
                    rules: state.rules.filter((r) => r.id !== id),
                }));
            },
        }),
        {
            name: 'notification-storage',
        }
    )
);
