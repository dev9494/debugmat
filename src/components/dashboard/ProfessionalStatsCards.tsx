import { TrendingUp, Activity, CheckCircle2, Clock, Zap } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useErrorStore } from '../../stores/errorStore';
import { cn } from '../../lib/utils';

export const ProfessionalStatsCards = () => {
    const { usageCount, timesSaved, bugsPrevented } = useUserStore();
    const { errorHistory } = useErrorStore();

    // Calculate real stats from error history
    const totalErrors = errorHistory.length;
    const resolvedErrors = errorHistory.filter(e => e.status === 'resolved').length;
    const estimatedTimeSaved = totalErrors * 15; // Assume 15 minutes saved per error
    const hoursDisplay = estimatedTimeSaved >= 60
        ? `${Math.floor(estimatedTimeSaved / 60)}h ${estimatedTimeSaved % 60}m`
        : `${estimatedTimeSaved}m`;

    const stats = [
        {
            label: "Errors Analyzed",
            value: totalErrors.toString(),
            change: totalErrors > 0 ? `+${totalErrors}` : "Start analyzing",
            icon: Activity,
        },
        {
            label: "Resolved Issues",
            value: resolvedErrors.toString(),
            change: resolvedErrors > 0 ? `+${resolvedErrors}` : "No resolved yet",
            icon: CheckCircle2,
        },
        {
            label: "Time Saved",
            value: hoursDisplay,
            change: estimatedTimeSaved > 0 ? `~${estimatedTimeSaved} min` : "0h",
            icon: Clock,
        },
        {
            label: "System Health",
            value: "99.9%",
            change: "Stable",
            icon: Zap,
        }
    ];

    return (
        <div className="grid grid-cols-4 gap-5">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:border-primary/30 shadow-lg"
                >
                    {/* Value */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
                            {stat.value}
                        </span>
                        <span className="text-base font-semibold text-emerald-500">
                            {stat.change}
                        </span>
                    </div>

                    {/* Label */}
                    <div className="flex items-center gap-2.5">
                        <stat.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-base font-medium text-muted-foreground">
                            {stat.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
