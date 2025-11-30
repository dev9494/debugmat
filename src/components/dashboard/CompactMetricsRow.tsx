import { Bug, Flame, TrendingUp, Zap } from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { useGamificationStore } from '../../stores/gamificationStore';

export const CompactMetricsRow = () => {
    const { errorHistory } = useErrorStore();
    const { stats } = useGamificationStore();

    const todayErrors = errorHistory.filter(e => {
        const errorDate = new Date(e.timestamp);
        const today = new Date();
        return errorDate.toDateString() === today.toDateString();
    }).length;

    const resolutionRate = errorHistory.length > 0
        ? Math.round((errorHistory.filter(e => e.status === 'resolved').length / errorHistory.length) * 100)
        : 0;

    const metrics = [
        {
            label: 'Errors Today',
            value: todayErrors,
            icon: Bug,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            label: 'Active Streak',
            value: `${stats.streak} days`,
            icon: Flame,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10'
        },
        {
            label: 'Resolution Rate',
            value: `${resolutionRate}%`,
            icon: TrendingUp,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
        },
        {
            label: 'Total Fixed',
            value: stats.totalErrorsFixed || 0,
            icon: Zap,
            color: 'text-green-400',
            bg: 'bg-green-400/10'
        }
    ];

    return (
        <div className="grid grid-cols-4 gap-4 mb-4">
            {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                    <div key={metric.label} className="bg-card/50 border border-border/50 rounded-lg p-3 flex items-center gap-3">
                        <div className={`p-2 rounded-md ${metric.bg}`}>
                            <Icon className={`w-4 h-4 ${metric.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
                            <p className="text-lg font-bold text-foreground leading-none mt-0.5">{metric.value}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
