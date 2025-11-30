import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
};

export const StatCard = ({ title, value, trend, icon, color }: StatCardProps) => {
    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend > 0) return <TrendingUp className="w-4 h-4" />;
        if (trend < 0) return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    const getTrendColor = () => {
        if (!trend) return 'text-gray-400';
        return trend > 0 ? 'text-green-400' : 'text-red-400';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
                        {getTrendIcon()}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-3xl font-bold text-foreground">{value}</p>
            </div>
        </motion.div>
    );
};
