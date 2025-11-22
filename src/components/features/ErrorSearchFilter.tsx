import { useState } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { useErrorStore, type ErrorSeverity, type ErrorStatus } from '../../stores/errorStore';
import { cn } from '../../lib/utils';

export const ErrorSearchFilter = () => {
    const { filters, setFilters, resetFilters, getFilteredHistory } = useErrorStore();
    const [showFilters, setShowFilters] = useState(false);

    const filteredCount = getFilteredHistory().length;
    const totalCount = useErrorStore((state) => state.errorHistory.length);
    const hasActiveFilters = filters.searchQuery || filters.severity !== 'all' ||
        filters.status !== 'all' || filters.dateRange !== 'all' ||
        filters.language !== 'all';

    const severityOptions: Array<{ value: ErrorSeverity | 'all'; label: string; color: string }> = [
        { value: 'all', label: 'All Severities', color: 'text-gray-400' },
        { value: 'critical', label: 'Critical', color: 'text-red-500' },
        { value: 'high', label: 'High', color: 'text-orange-500' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
        { value: 'low', label: 'Low', color: 'text-blue-500' },
    ];

    const statusOptions: Array<{ value: ErrorStatus | 'all'; label: string; icon: string }> = [
        { value: 'all', label: 'All Statuses', icon: '📋' },
        { value: 'new', label: 'New', icon: '🆕' },
        { value: 'investigating', label: 'Investigating', icon: '🔍' },
        { value: 'resolved', label: 'Resolved', icon: '✅' },
        { value: 'ignored', label: 'Ignored', icon: '🚫' },
    ];

    const dateRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'Last 7 Days' },
        { value: 'month', label: 'Last 30 Days' },
    ];

    const languageOptions = [
        { value: 'all', label: 'All Languages' },
        { value: 'TypeScript', label: 'TypeScript' },
        { value: 'JavaScript', label: 'JavaScript' },
        { value: 'Python', label: 'Python' },
        { value: 'Java', label: 'Java' },
        { value: 'Go', label: 'Go' },
    ];

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search errors, types, or causes..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ searchQuery: e.target.value })}
                    className="w-full pl-12 pr-24 py-3 bg-[#141414] border border-white/10 rounded-xl text-base text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                {filters.searchQuery && (
                    <button
                        onClick={() => setFilters({ searchQuery: '' })}
                        className="absolute right-16 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                        showFilters || hasActiveFilters
                            ? "bg-blue-500/20 text-blue-400"
                            : "hover:bg-white/10 text-muted-foreground"
                    )}
                >
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">Filters</h3>
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Reset All
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Severity Filter */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Severity
                            </label>
                            <div className="space-y-2">
                                {severityOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFilters({ severity: option.value })}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-lg text-base transition-all",
                                            filters.severity === option.value
                                                ? "bg-white/10 border border-white/20 text-white"
                                                : "bg-white/5 border border-transparent hover:bg-white/10 text-muted-foreground"
                                        )}
                                    >
                                        <span className={option.color}>●</span> {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Status
                            </label>
                            <div className="space-y-2">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFilters({ status: option.value })}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-lg text-base transition-all",
                                            filters.status === option.value
                                                ? "bg-white/10 border border-white/20 text-white"
                                                : "bg-white/5 border border-transparent hover:bg-white/10 text-muted-foreground"
                                        )}
                                    >
                                        {option.icon} {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Date Range
                            </label>
                            <div className="space-y-2">
                                {dateRangeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFilters({ dateRange: option.value as any })}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-lg text-base transition-all",
                                            filters.dateRange === option.value
                                                ? "bg-white/10 border border-white/20 text-white"
                                                : "bg-white/5 border border-transparent hover:bg-white/10 text-muted-foreground"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language Filter */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Language
                            </label>
                            <div className="space-y-2">
                                {languageOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFilters({ language: option.value })}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-lg text-base transition-all",
                                            filters.language === option.value
                                                ? "bg-white/10 border border-white/20 text-white"
                                                : "bg-white/5 border border-transparent hover:bg-white/10 text-muted-foreground"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    Showing <span className="text-white font-semibold">{filteredCount}</span> of{' '}
                    <span className="text-white font-semibold">{totalCount}</span> errors
                </span>
                {hasActiveFilters && (
                    <div className="flex items-center gap-2">
                        <span className="text-blue-400">Filters active</span>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
};
