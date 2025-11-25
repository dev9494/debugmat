import { TrendingUp, TrendingDown, Activity, Clock, Shield, Zap } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { cn } from '../../lib/utils';

export const AnalyticsCards = () => {
    const { usageCount, timesSaved, bugsPrevented } = useUserStore();

    const stats = [
        {
            label: "Errors Analyzed",
            value: usageCount,
            change: "+24%",
            trend: "up",
            icon: Activity,
            gradient: "from-blue-500/20 to-purple-500/20",
            iconColor: "text-blue-400",
            borderColor: "group-hover:border-blue-500/30",
            sparkline: "M0 20 Q 10 18, 20 15 T 40 10 T 60 18 T 80 5 T 100 12"
        },
        {
            label: "Time Saved",
            value: `${(timesSaved / 60).toFixed(1)} hrs`,
            change: "+1.2h",
            trend: "up",
            icon: Clock,
            gradient: "from-green-500/20 to-emerald-500/20",
            iconColor: "text-green-400",
            borderColor: "group-hover:border-green-500/30",
            sparkline: "M0 25 Q 20 20, 40 15 T 60 10 T 80 5 T 100 2"
        },
        {
            label: "Bugs Prevented",
            value: bugsPrevented,
            change: "0%",
            trend: "neutral",
            icon: Shield,
            gradient: "from-orange-500/20 to-red-500/20",
            iconColor: "text-orange-400",
            borderColor: "group-hover:border-orange-500/30",
            sparkline: "M0 20 L 20 20 L 40 20 L 60 15 L 80 15 L 100 15"
        },
        {
            label: "Success Rate",
            value: "94%",
            change: "+2%",
            trend: "up",
            icon: Zap,
            gradient: "from-yellow-500/20 to-amber-500/20",
            iconColor: "text-yellow-400",
            borderColor: "group-hover:border-yellow-500/30",
            sparkline: "M0 15 Q 25 15, 50 10 T 100 5"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={cn(
                        "glass-card group relative overflow-hidden rounded-xl p-6",
                        stat.borderColor
                    )}
                >
                    {/* Gradient Background Glow */}
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
                        stat.gradient
                    )} />

                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[100px]">
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn("p-2.5 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm", stat.iconColor)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm",
                                stat.trend === 'up' ? "text-green-400" : "text-muted-foreground"
                            )}>
                                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-lg">{stat.value}</h3>
                            <p className="text-base text-muted-foreground font-medium">{stat.label}</p>
                        </div>

                        {/* Mini Sparkline */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 group-hover:opacity-40 transition-opacity">
                            <svg className="w-full h-full" preserveAspectRatio="none">
                                <path
                                    d={stat.sparkline}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className={stat.iconColor}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d={`${stat.sparkline} L 100 100 L 0 100 Z`}
                                    fill="currentColor"
                                    className={stat.iconColor}
                                    opacity="0.2"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
