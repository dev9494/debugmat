import { useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    AlertTriangle,
    BarChart3,
    FileCode,
    Calendar,
} from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { calculateAnalytics, generateTrendChartData } from '../../lib/analytics';
import { getSeverityColor } from '../../lib/severityDetection';
import { cn } from '../../lib/utils';

export const AnalyticsDashboard = () => {
    const { errorHistory } = useErrorStore();
    const analytics = useMemo(() => calculateAnalytics(errorHistory), [errorHistory]);
    const trendData = useMemo(
        () => generateTrendChartData(analytics.errorsByDay),
        [analytics.errorsByDay]
    );

    if (errorHistory.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 animate-pulse">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Analytics Yet</h3>
                <p className="text-base text-slate-400 max-w-sm">
                    Analyze some errors first, and I'll generate beautiful insights and trends.
                </p>
            </div>
        );
    }

    const maxErrorsInDay = Math.max(...trendData.map(d => d.count), 1);

    return (
        <div className="space-y-6 animate-up">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                    Analytics Dashboard
                </h2>
                <p className="text-base text-slate-400">
                    Insights and trends from your error data
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Errors */}
                <div className="glass-card p-5 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <AlertTriangle className="w-5 h-5 text-blue-400" />
                            </div>
                            <div
                                className={cn(
                                    'flex items-center gap-1 text-sm font-semibold',
                                    analytics.trends.percentageChange > 0
                                        ? 'text-red-400'
                                        : analytics.trends.percentageChange < 0
                                            ? 'text-green-400'
                                            : 'text-slate-400'
                                )}
                            >
                                {analytics.trends.percentageChange > 0 ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : analytics.trends.percentageChange < 0 ? (
                                    <TrendingDown className="w-4 h-4" />
                                ) : null}
                                {Math.abs(analytics.trends.percentageChange)}%
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{analytics.totalErrors}</p>
                        <p className="text-sm text-blue-300">Total Errors</p>
                    </div>
                </div>

                {/* MTTR */}
                <div className="glass-card p-5 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <Clock className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{analytics.mttr}</p>
                        <p className="text-sm text-purple-300">MTTR (minutes)</p>
                    </div>
                </div>

                {/* Resolution Rate */}
                <div className="glass-card p-5 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-green-500/20">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{analytics.resolutionRate}%</p>
                        <p className="text-sm text-green-300">Resolution Rate</p>
                    </div>
                </div>

                {/* Error Rate */}
                <div className="glass-card p-5 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-lg bg-orange-500/20">
                                <Calendar className="w-5 h-5 text-orange-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{analytics.errorRate}</p>
                        <p className="text-sm text-orange-300">Errors/Day</p>
                    </div>
                </div>
            </div>

            {/* Error Trend Chart */}
            <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Error Trend (Last 30 Days)
                </h3>
                <div className="space-y-2">
                    {trendData.length > 0 ? (
                        trendData.map((day, index) => (
                            <div key={day.date} className="flex items-center gap-3 group">
                                <span className="text-xs text-slate-500 w-24 shrink-0 font-mono">
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg transition-all group-hover:brightness-110"
                                        style={{
                                            width: `${(day.count / maxErrorsInDay) * 100}%`,
                                        }}
                                    />
                                    {day.count > 0 && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white shadow-black/50 drop-shadow-md">
                                            {day.count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-8">
                            No data available
                        </p>
                    )}
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Errors by Severity */}
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Errors by Severity</h3>
                    <div className="space-y-3">
                        {Object.entries(analytics.errorsBySeverity).map(([severity, count]) => (
                            <div key={severity} className="flex items-center gap-3 group">
                                <span
                                    className={cn(
                                        'text-xs font-bold uppercase w-20 tracking-wider',
                                        getSeverityColor(severity as any)
                                    )}
                                >
                                    {severity}
                                </span>
                                <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                                    <div
                                        className={cn(
                                            'h-full rounded-lg transition-all group-hover:brightness-110',
                                            severity === 'critical'
                                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                                : severity === 'high'
                                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                                                    : severity === 'medium'
                                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                        )}
                                        style={{
                                            width: `${(count / analytics.totalErrors) * 100}%`,
                                        }}
                                    />
                                    {count > 0 && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white drop-shadow-md">
                                            {count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Error Types */}
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Top Error Types</h3>
                    <div className="space-y-3">
                        {analytics.errorsByType.slice(0, 5).map((item, index) => (
                            <div key={item.type} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <span className="text-sm font-bold text-blue-400 w-6">
                                    #{index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-200 truncate">{item.type}</p>
                                </div>
                                <span className="text-sm font-semibold text-slate-500">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Error Producers */}
            {analytics.topErrorProducers.length > 0 && (
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-purple-400" />
                        Top Error Producers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analytics.topErrorProducers.map((item, index) => (
                            <div
                                key={item.file}
                                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs font-semibold text-purple-400">
                                        #{index + 1}
                                    </span>
                                    <span className="text-lg font-bold text-white">{item.count}</span>
                                </div>
                                <p className="text-sm text-slate-400 font-mono truncate" title={item.file}>
                                    {item.file.split('/').pop()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
