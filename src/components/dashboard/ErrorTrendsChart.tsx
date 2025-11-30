import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ErrorTrendsChartProps {
    data?: Array<{ time: string; errors: number; fixed: number }>;
}

const defaultData = [
    { time: '00:00', errors: 12, fixed: 8 },
    { time: '04:00', errors: 8, fixed: 6 },
    { time: '08:00', errors: 23, fixed: 18 },
    { time: '12:00', errors: 34, fixed: 28 },
    { time: '16:00', errors: 28, fixed: 24 },
    { time: '20:00', errors: 15, fixed: 12 },
    { time: 'Now', errors: 9, fixed: 7 }
];

export const ErrorTrendsChart = ({ data = defaultData }: ErrorTrendsChartProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Error Trends</h3>
                    <p className="text-sm text-muted-foreground">Last 24 hours</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">Errors</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">Fixed</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fixedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                        dataKey="time"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#f3f4f6'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="errors"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fill="url(#errorGradient)"
                    />
                    <Area
                        type="monotone"
                        dataKey="fixed"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#fixedGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
};
