import { formatDistanceToNow } from 'date-fns';
import { Clock, X, Info, AlertTriangle, AlertOctagon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { ErrorSearchFilter } from '../features/ErrorSearchFilter';
import { cn } from '../../lib/utils';

export const ErrorHistory = () => {
    const { getFilteredHistory, setCurrentAnalysis, removeFromHistory } = useErrorStore();
    const errorHistory = getFilteredHistory();

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'critical':
                return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertOctagon };
            case 'high':
                return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle };
            case 'medium':
                return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertCircle };
            case 'low':
                return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info };
            default:
                return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Info };
        }
    };

    return (
        <div className="flex flex-col h-full flex-1 min-h-0 bg-transparent">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Analyses
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/20">
                    {errorHistory.length}
                </span>
            </div>

            {/* Search & Filter */}
            <div className="px-4 py-4 border-b border-white/5 bg-white/[0.02]">
                <ErrorSearchFilter />
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                {errorHistory.length > 0 ? (
                    errorHistory.map((item) => {
                        const config = getSeverityConfig(item.analysis.severity);
                        const Icon = config.icon;

                        return (
                            <div key={item.id} className="group/item relative">
                                <button
                                    onClick={() => setCurrentAnalysis(item.analysis)}
                                    className="group/btn w-full text-left p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 transition-all duration-200 overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />

                                    <div className="flex items-start gap-3 relative z-10">
                                        <div className={cn(
                                            "mt-1 p-1.5 rounded-lg border transition-colors",
                                            config.bg, config.border, config.color
                                        )}>
                                            <Icon className="w-4 h-4" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-sm text-slate-200 truncate group-hover/btn:text-white transition-colors">
                                                    {item.analysis.errorType}
                                                </span>
                                                <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-400 line-clamp-2 font-mono opacity-80 group-hover/btn:opacity-100 transition-opacity">
                                                {item.errorMessage}
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => removeFromHistory(item.id)}
                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover/item:opacity-100 transition-all backdrop-blur-sm border border-red-500/20"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <Clock className="w-5 h-5 text-slate-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">No errors found</p>
                        <p className="text-xs text-slate-600 mt-1">Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* Pro Tip */}
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-blue-300 mb-1 uppercase tracking-wide">Pro Tip</p>
                        <p className="text-xs text-blue-200/70 leading-relaxed">
                            Add code context for 3x better results and more accurate solutions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
