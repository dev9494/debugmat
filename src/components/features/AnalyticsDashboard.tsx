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
    ArrowUp,
    ArrowDown,
    Minus,
} from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { calculateAnalytics, generateTrendChartData } from '../../lib/analytics';
import { getSeverityColor } from '../../lib/severityDetection';
import { VisualErrorMap } from './VisualErrorMap';
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
            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                    <BarChart3 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">No Analytics Yet</h3>
                <p className="text-base text-muted-foreground max-w-md leading-relaxed">
                    Analyze some errors first, and I'll generate beautiful insights and trends.
                </p>
            </div>
        );
    }

    const maxErrorsInDay = Math.max(...trendData.map(d => d.count), 1);

    // Stat cards configuration
    const stats = [
        {
            label: 'Errors Analyzed',
            value: analytics.totalErrors.toLocaleString(),
            change: analytics.trends.percentageChange,
            icon: AlertTriangle,
            color: 'blue',
        },
        {
            label: 'Time Saved',
            value: `${analytics.mttr}m`,
            subtext: 'MTTR',
            icon: Clock,
            color: 'purple',
        },
        {
            label: 'Success Rate',
            value: `${analytics.resolutionRate}%`,
            icon: CheckCircle,
            color: 'green',
        },
        {
            label: 'Daily Average',
            value: analytics.errorRate.toFixed(1),
            subtext: 'errors/day',
            icon: Calendar,
            color: 'orange',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Analytics</h2>
                    <p className="text-base text-muted-foreground">
                        Insights and trends from your error data
                    </p>
                </div>
            </div>

            {/* Professional Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const isPositive = stat.change !== undefined && stat.change > 0;
                    const isNegative = stat.change !== undefined && stat.change < 0;

                    return (
                        <div
                            key={index}
                            className="glass-card p-6 rounded-lg border hover:border-primary/30 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    "p-2.5 rounded-lg",
                                    stat.color === 'blue' && "bg-blue-500/10",
                                    stat.color === 'purple' && "bg-purple-500/10",
                                    stat.color === 'green' && "bg-green-500/10",
                                    stat.color === 'orange' && "bg-orange-500/10"
                                )}>
                                    <Icon className={cn(
                                        "w-5 h-5",
                                        stat.color === 'blue' && "text-blue-500",
                                        stat.color === 'purple' && "text-purple-500",
                                        stat.color === 'green' && "text-green-500",
                                        stat.color === 'orange' && "text-orange-500"
                                    )} />
                                </div>
                                {stat.change !== undefined && (
                                    <div className={cn(
                                        "flex items-center gap-1 text-xs font-mono font-semibold px-2 py-1 rounded",
                                        isPositive && "text-red-500 bg-red-500/10",
                                        isNegative && "text-green-500 bg-green-500/10",
                                        !isPositive && !isNegative && "text-muted-foreground bg-muted"
                                    )}>
                                        {isPositive && <ArrowUp className="w-3 h-3" />}
                                        {isNegative && <ArrowDown className="w-3 h-3" />}
                                        {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
                                        {Math.abs(stat.change)}%
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-4xl font-bold font-mono text-foreground tracking-tight">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-muted-foreground font-medium">
                                    {stat.label}
                                    {stat.subtext && <span className="text-xs ml-1">({stat.subtext})</span>}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Error Trend Chart - Professional */}
            <div className="glass-card p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Error Trend
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">Last 30 Days</span>
                </div>
                <div className="space-y-2">
                    {trendData.length > 0 ? (
                        trendData.map((day) => (
                            <div key={day.date} className="flex items-center gap-4 group">
                                <span className="text-xs text-muted-foreground w-20 shrink-0 font-mono">
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <div className="flex-1 h-7 bg-muted rounded overflow-hidden relative">
                                    <div
                                        className="h-full bg-primary rounded transition-all group-hover:brightness-110"
                                        style={{
                                            width: `${(day.count / maxErrorsInDay) * 100}%`,
                                        }}
                                    />
                                    {day.count > 0 && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-foreground">
                                            {day.count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No data available
                        </p>
                    )}
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Errors by Severity */}
                <div className="glass-card p-6 rounded-lg border">
                    <h3 className="text-lg font-bold text-foreground mb-6">Errors by Severity</h3>
                    <div className="space-y-4">
                        {Object.entries(analytics.errorsBySeverity).map(([severity, count]) => (
                            <div key={severity} className="flex items-center gap-4 group">
                                <span
                                    className={cn(
                                        'text-xs font-bold uppercase w-20 tracking-wider font-mono',
                                        getSeverityColor(severity as any)
                                    )}
                                >
                                    {severity}
                                </span>
                                <div className="flex-1 h-7 bg-muted rounded overflow-hidden relative">
                                    <div
                                        className={cn(
                                            'h-full rounded transition-all group-hover:brightness-110',
                                            severity === 'critical'
                                                ? 'bg-red-500'
                                                : severity === 'high'
                                                    ? 'bg-orange-500'
                                                    : severity === 'medium'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-blue-500'
                                        )}
                                        style={{
                                            width: `${(count / analytics.totalErrors) * 100}%`,
                                        }}
                                    />
                                    {count > 0 && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-foreground">
                                            {count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Error Types */}
                <div className="glass-card p-6 rounded-lg border">
                    <h3 className="text-lg font-bold text-foreground mb-6">Top Error Types</h3>
                    <div className="space-y-2">
                        {analytics.errorsByType.slice(0, 5).map((item, index) => (
                            <div key={item.type} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group">
                                <span className="text-xs font-mono font-bold text-primary w-8">
                                    #{index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground truncate font-medium">{item.type}</p>
                                </div>
                                <span className="text-sm font-mono font-semibold text-muted-foreground">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Visual Error Map */}
            <div className="glass-card p-6 rounded-lg border">
                <VisualErrorMap />
            </div>
        </div>
    );
};
