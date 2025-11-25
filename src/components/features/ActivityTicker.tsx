import { Activity, GitCommit, AlertCircle, CheckCircle2 } from 'lucide-react';

const activities = [
    { id: 1, type: 'fix', message: 'Fixed NullReference in AuthController', time: '2m ago', icon: CheckCircle2, color: 'text-green-400' },
    { id: 2, type: 'error', message: 'New error detected in PaymentService', time: '5m ago', icon: AlertCircle, color: 'text-red-400' },
    { id: 3, type: 'commit', message: 'feat: Updated error handling logic', time: '12m ago', icon: GitCommit, color: 'text-blue-400' },
    { id: 4, type: 'system', message: 'System analysis completed', time: '15m ago', icon: Activity, color: 'text-purple-400' },
];

export const ActivityTicker = () => {
    return (
        <div className="w-full overflow-hidden bg-[#0f172a]/40 border-b border-white/5 backdrop-blur-sm h-10 flex items-center relative z-40">
            <div className="flex animate-slide-left whitespace-nowrap hover:[animation-play-state:paused]">
                {[...activities, ...activities, ...activities].map((activity, i) => (
                    <div key={`${activity.id}-${i}`} className="flex items-center gap-2 mx-8 text-sm text-slate-400">
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        <span className="font-medium text-slate-200">{activity.message}</span>
                        <span className="text-xs opacity-50">({activity.time})</span>
                    </div>
                ))}
            </div>

            {/* Gradient Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#030712] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#030712] to-transparent pointer-events-none" />
        </div>
    );
};
