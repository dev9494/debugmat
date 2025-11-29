import { TrendingUp, TrendingDown, Activity, Clock, Shield, Zap, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { cn } from '../../lib/utils';

export const AnalyticsCards = () => {
    const { usageCount, timesSaved, bugsPrevented } = useUserStore();

    const stats = [
        {
            label: "Errors Analyzed",
            value: usageCount.toLocaleString(),
            change: 24,
            icon: Activity,
            color: "blue",
        },
        {
            label: "Time Saved",
            value: `${(timesSaved / 60).toFixed(1)}`,
            subtext: "hrs",
            change: 12,
            icon: Clock,
            color: "green",
        },
        {
            label: "Bugs Prevented",
            value: bugsPrevented.toLocaleString(),
            change: 0,
            icon: Shield,
            color: "orange",
        },
        {
            label: "Success Rate",
            value: "94",
            subtext: "%",
            change: 2,
            icon: Zap,
            color: "purple",
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isPositive = stat.change > 0;
                const isNegative = stat.change < 0;

                return (
                    <div
                        key={index}
                        className="glass-card p-6 rounded-lg border hover:border-primary/30 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "p-2.5 rounded-lg",
                                stat.color === 'blue' && "bg-blue-500/10",
                                stat.color === 'green' && "bg-green-500/10",
                                stat.color === 'orange' && "bg-orange-500/10",
                                stat.color === 'purple' && "bg-purple-500/10"
                            )}>
                                <Icon className={cn(
                                    "w-5 h-5",
                                    stat.color === 'blue' && "text-blue-500",
                                    stat.color === 'green' && "text-green-500",
                                    stat.color === 'orange' && "text-orange-500",
                                    stat.color === 'purple' && "text-purple-500"
                                )} />
                            </div>
                            {stat.change !== 0 && (
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-mono font-semibold px-2 py-1 rounded",
                                    isPositive && "text-green-500 bg-green-500/10",
                                    isNegative && "text-red-500 bg-red-500/10",
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
                            <div className="flex items-baseline gap-1">
                                <p className="text-4xl font-bold font-mono text-foreground tracking-tight">
                                    {stat.value}
                                </p>
                                {stat.subtext && (
                                    <span className="text-xl font-mono text-muted-foreground">
                                        {stat.subtext}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
