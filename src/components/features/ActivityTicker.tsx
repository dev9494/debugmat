import { Activity, GitCommit, AlertCircle, CheckCircle2, Zap, Shield, Code2, TrendingUp } from 'lucide-react';

const activities = [
    { id: 1, type: 'fix', message: 'Resolved memory leak in UserService', icon: CheckCircle2 },
    { id: 2, type: 'error', message: 'New error detected in PaymentService', icon: AlertCircle },
    { id: 3, type: 'commit', message: 'Updated error handling logic', icon: GitCommit },
    { id: 4, type: 'system', message: 'System analysis completed', icon: Activity },
    { id: 5, type: 'prevention', message: 'Prevented SQL injection vulnerability', icon: Shield },
    { id: 6, type: 'optimization', message: 'Performance optimization applied', icon: TrendingUp },
];

export const ActivityTicker = () => {
    const repeatedActivities = [...activities, ...activities, ...activities];

    return (
        <div className="w-full overflow-hidden border-b border-border bg-muted/30 h-12 flex items-center relative">
            {/* Animated Content */}
            <div className="flex animate-slide-left-slow whitespace-nowrap">
                {repeatedActivities.map((activity, i) => (
                    <div
                        key={`${activity.id}-${i}`}
                        className="flex items-center gap-3 mx-6 text-base text-muted-foreground"
                    >
                        <activity.icon className="w-4 h-4" />
                        <span>{activity.message}</span>
                        <span className="text-sm opacity-40">·</span>
                    </div>
                ))}
            </div>

            {/* Gradient Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
    );
};
