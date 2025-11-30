import { motion } from 'framer-motion';
import { Shield, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

interface CodeHealthScoreProps {
    score?: number;
}

export const CodeHealthScore = ({ score = 87 }: CodeHealthScoreProps) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return { color: 'text-green-500', bg: 'from-green-500 to-emerald-600', ring: 'ring-green-500/20' };
        if (score >= 60) return { color: 'text-yellow-500', bg: 'from-yellow-500 to-orange-600', ring: 'ring-yellow-500/20' };
        return { color: 'text-red-500', bg: 'from-red-500 to-rose-600', ring: 'ring-red-500/20' };
    };

    const scoreConfig = getScoreColor(score);
    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const metrics = [
        { label: 'Security', status: 'good', icon: Shield, color: 'text-green-500' },
        { label: 'Performance', status: 'fair', icon: Zap, color: 'text-yellow-500' },
        { label: 'Best Practices', status: 'excellent', icon: CheckCircle, color: 'text-green-500' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-6"
        >
            <h3 className="text-lg font-semibold text-foreground mb-6">Code Health Score</h3>

            {/* Circular Progress */}
            <div className="flex flex-col items-center mb-6">
                <div className="relative w-48 h-48">
                    <svg className="transform -rotate-90 w-48 h-48">
                        {/* Background circle */}
                        <circle
                            cx="96"
                            cy="96"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-muted/20"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="96"
                            cy="96"
                            r="70"
                            stroke="url(#scoreGradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" className={scoreConfig.color} />
                                <stop offset="100%" className={scoreConfig.color} stopOpacity="0.6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Score text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-bold ${scoreConfig.color}`}>{score}</span>
                        <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/5 border border-border/50"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${metric.color}`} />
                                <span className="text-sm font-medium text-foreground">{metric.label}</span>
                            </div>
                            <span className={`text-xs font-semibold uppercase ${metric.color}`}>
                                {metric.status}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Improvement suggestion */}
            <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-medium text-blue-400 mb-1">Improvement Tip</p>
                        <p className="text-xs text-muted-foreground">
                            Optimize database queries in UserService.ts to improve performance score
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
