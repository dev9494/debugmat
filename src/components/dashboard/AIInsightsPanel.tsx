import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Brain } from 'lucide-react';

interface Insight {
    type: 'pattern' | 'prediction' | 'recommendation' | 'learning';
    title: string;
    description: string;
    confidence?: number;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
}

const insights: Insight[] = [
    {
        type: 'pattern',
        title: 'Pattern Detected',
        description: 'Null pointer errors spike every Monday morning. Consider adding validation to weekend batch jobs.',
        icon: Brain,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20'
    },
    {
        type: 'prediction',
        title: 'High Risk Alert',
        description: 'Memory leak likely in PaymentProcessor.ts based on usage patterns.',
        confidence: 87,
        icon: AlertTriangle,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20'
    },
    {
        type: 'recommendation',
        title: 'Optimization Opportunity',
        description: 'Team velocity increased 23% after adopting auto-fix for TypeScript errors.',
        icon: TrendingUp,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
    },
    {
        type: 'learning',
        title: 'AI Learning',
        description: 'Your error resolution time improved 40% over the last 2 weeks. Keep it up!',
        icon: Lightbulb,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
    }
];

export const AIInsightsPanel = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
                    <p className="text-xs text-muted-foreground">Powered by machine learning</p>
                </div>
            </div>

            <div className="space-y-4">
                {insights.map((insight, index) => {
                    const Icon = insight.icon;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${insight.borderColor} ${insight.bgColor} hover:scale-[1.02] transition-transform cursor-pointer`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg bg-background/50 ${insight.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className={`text-sm font-semibold ${insight.color}`}>
                                            {insight.title}
                                        </h4>
                                        {insight.confidence && (
                                            <span className="text-xs text-muted-foreground">
                                                {insight.confidence}% confidence
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {insight.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Action button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full mt-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-sm font-medium text-primary transition-colors"
            >
                View All Insights →
            </motion.button>
        </motion.div>
    );
};
