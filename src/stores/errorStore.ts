import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ErrorStatus = 'new' | 'investigating' | 'resolved' | 'ignored';

export interface ErrorAnalysis {
    errorType: string;
    rootCause: string;
    explanation: string;
    severity: ErrorSeverity;
    solutions: Array<{
        rank: 'best' | 'fastest' | 'robust';
        title: string;
        description: string;
        code: string;
        reasoning: string;
        difficulty: 'easy' | 'medium' | 'hard';
        estimatedTime: string;
        steps: string[];
    }>;
    filesLikelyAffected: Array<{
        path: string;
        lineNumber: number;
        snippet: string;
    }>;
}

export interface ErrorHistoryItem {
    id: string;
    timestamp: number;
    errorMessage: string;
    language: string;
    analysis: ErrorAnalysis;
    status?: ErrorStatus;
    tags?: string[];
    assignedTo?: string;
}

export interface ErrorFilters {
    searchQuery: string;
    severity: ErrorSeverity | 'all';
    status: ErrorStatus | 'all';
    dateRange: 'today' | 'week' | 'month' | 'all';
    language: string | 'all';
}

interface ErrorState {
    currentError: string;
    errorHistory: ErrorHistoryItem[];
    currentAnalysis: ErrorAnalysis | null;
    isAnalyzing: boolean;
    filters: ErrorFilters;

    setCurrentError: (error: string) => void;
    setCurrentAnalysis: (analysis: ErrorAnalysis | null) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
    setHistory: (history: ErrorHistoryItem[]) => void;
    addToHistory: (item: ErrorHistoryItem) => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
    updateErrorStatus: (id: string, status: ErrorStatus) => void;
    updateErrorTags: (id: string, tags: string[]) => void;
    setFilters: (filters: Partial<ErrorFilters>) => void;
    resetFilters: () => void;
    getFilteredHistory: () => ErrorHistoryItem[];
}

const defaultFilters: ErrorFilters = {
    searchQuery: '',
    severity: 'all',
    status: 'all',
    dateRange: 'all',
    language: 'all',
};

export const useErrorStore = create<ErrorState>()(
    persist(
        (set, get) => ({
            currentError: '',
            errorHistory: [],
            currentAnalysis: null,
            isAnalyzing: false,
            filters: defaultFilters,

            setCurrentError: (error) => set({ currentError: error }),

            setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

            setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

            setHistory: (history) => set({ errorHistory: history }),

            addToHistory: (item) =>
                set((state) => ({
                    errorHistory: [item, ...state.errorHistory].slice(0, 50), // Keep last 50
                })),

            removeFromHistory: (id) =>
                set((state) => ({
                    errorHistory: state.errorHistory.filter((item) => item.id !== id),
                })),

            clearHistory: () => set({ errorHistory: [] }),

            updateErrorStatus: (id, status) =>
                set((state) => ({
                    errorHistory: state.errorHistory.map((item) =>
                        item.id === id ? { ...item, status } : item
                    ),
                })),

            updateErrorTags: (id, tags) =>
                set((state) => ({
                    errorHistory: state.errorHistory.map((item) =>
                        item.id === id ? { ...item, tags } : item
                    ),
                })),

            setFilters: (newFilters) =>
                set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                })),

            resetFilters: () => set({ filters: defaultFilters }),

            getFilteredHistory: () => {
                const { errorHistory, filters } = get();

                return errorHistory.filter((item) => {
                    // Search query filter
                    if (filters.searchQuery) {
                        const query = filters.searchQuery.toLowerCase();
                        const matchesSearch =
                            item.errorMessage.toLowerCase().includes(query) ||
                            item.analysis.errorType.toLowerCase().includes(query) ||
                            item.analysis.rootCause.toLowerCase().includes(query);

                        if (!matchesSearch) return false;
                    }

                    // Severity filter
                    if (filters.severity !== 'all' && item.analysis.severity !== filters.severity) {
                        return false;
                    }

                    // Status filter
                    if (filters.status !== 'all' && item.status !== filters.status) {
                        return false;
                    }

                    // Language filter
                    if (filters.language !== 'all' && item.language !== filters.language) {
                        return false;
                    }

                    // Date range filter
                    if (filters.dateRange !== 'all') {
                        const now = Date.now();
                        const itemDate = item.timestamp;
                        const dayMs = 24 * 60 * 60 * 1000;

                        switch (filters.dateRange) {
                            case 'today':
                                if (now - itemDate > dayMs) return false;
                                break;
                            case 'week':
                                if (now - itemDate > 7 * dayMs) return false;
                                break;
                            case 'month':
                                if (now - itemDate > 30 * dayMs) return false;
                                break;
                        }
                    }

                    return true;
                });
            },
        }),
        {
            name: 'error-storage',
        }
    )
);
