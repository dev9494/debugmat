import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ErrorItem {
    id: string;
    severity: 'critical' | 'warning' | 'info' | 'fixed';
    file: string;
    line: number;
    message: string;
    timestamp: string;
}

const mockErrors: ErrorItem[] = [
    { id: '1', severity: 'critical', file: 'UserAuth.ts', line: 42, message: 'Null pointer exception', timestamp: '2 sec ago' },
    { id: '2', severity: 'warning', file: 'api/payment.js', line: 89, message: 'Deprecated API usage', timestamp: '5 sec ago' },
    { id: '3', severity: 'info', file: 'logger.ts', line: 12, message: 'Performance optimization available', timestamp: '8 sec ago' },
    { id: '4', severity: 'fixed', file: 'database.ts', line: 156, message: 'Connection timeout resolved', timestamp: '12 sec ago' },
    { id: '5', severity: 'warning', file: 'components/Form.tsx', line: 234, message: 'Missing prop validation', timestamp: '15 sec ago' }
];

export const HotErrorsFeed = () => {
    const [errors, setErrors] = useState<ErrorItem[]>(mockErrors);

    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate new error
            const newError: ErrorItem = {
                id: Date.now().toString(),
                severity: ['critical', 'warning', 'info', 'fixed'][Math.floor(Math.random() * 4)] as any,
                file: ['UserService.ts', 'api/auth.js', 'utils/helper.ts', 'App.tsx'][Math.floor(Math.random() * 4)],
                line: Math.floor(Math.random() * 500),
                message: [
                    'Type mismatch detected',
                    'Memory leak warning',
                    'Unused variable',
                    'Security vulnerability',
                    'Performance issue'
                ][Math.floor(Math.random() * 5)],
                timestamp: 'Just now'
            };

            setErrors(prev => [newError, ...prev.slice(0, 9)]);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const getSeverityConfig = (severity: ErrorItem['severity']) => {
        switch (severity) {
            case 'critical':
                return {
                    icon: AlertCircle,
                    color: 'text-red-500',
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/20',
                    label: 'CRITICAL'
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    color: 'text-yellow-500',
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    label: 'WARNING'
                };
            case 'info':
                return {
                    icon: Info,
                    color: 'text-blue-500',
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20',
                    label: 'INFO'
                };
            case 'fixed':
                return {
                    icon: CheckCircle,
                    color: 'text-green-500',
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    label: 'FIXED'
                };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-lg font-semibold text-foreground">Live Error Feed</h3>
                </div>
                <Clock className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {errors.map((error) => {
                        const config = getSeverityConfig(error.severity);
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={error.id}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${config.border} ${config.bg} hover:scale-[1.02] transition-transform cursor-pointer`}
                            >
                                <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold ${config.color}`}>
                                            {config.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {error.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {error.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {error.file}:{error.line}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
