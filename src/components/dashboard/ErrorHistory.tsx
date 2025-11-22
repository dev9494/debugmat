import { formatDistanceToNow } from 'date-fns';
import { Clock, X, Info } from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { ErrorSearchFilter } from '../features/ErrorSearchFilter';
import { cn } from '../../lib/utils';

export const ErrorHistory = () => {
    const { getFilteredHistory, setCurrentAnalysis, removeFromHistory } = useErrorStore();
    const errorHistory = getFilteredHistory();

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-500/10 border-red-500/20 text-red-400';
            case 'high':
                return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
            case 'medium':
                return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            case 'low':
                return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            default:
                return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="flex flex-col h-full flex-1 min-h-0">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
                <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-wider">Recent Analyses</h3>
                <span className="text-lg px-2.5 py-1 rounded-full bg-white/5 text-muted-foreground font-semibold">{errorHistory.length}</span>
            </div>

            {/* Search & Filter */}
            <div className="px-4 py-4 border-b border-white/5">
                <ErrorSearchFilter />
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                {errorHistory.length > 0 ? (
                    errorHistory.map((item) => (
                        <div key={item.id} className="group/item relative">
                            <button
                                onClick={() => setCurrentAnalysis(item.analysis)}
                                className="group/btn w-full text-left p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={cn(
                                        "mt-1 px-2 py-0.5 rounded text-xs font-bold border",
                                        getSeverityColor(item.analysis.severity)
                                    )}>
                                        {item.analysis.severity.toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-2xl text-gray-200 truncate group-hover/btn:text-white transition-colors">
                                                {item.analysis.errorType}
                                            </span>
                                            <span className="text-lg text-muted-foreground whitespace-nowrap ml-2">
                                                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                            </span>
                                        </div>

                                        <p className="text-xl text-muted-foreground line-clamp-1 font-mono opacity-70">
                                            {item.errorMessage}
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => removeFromHistory(item.id)}
                                className="absolute top-2 right-2 p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-lg font-medium text-muted-foreground">No errors found</p>
                        <p className="text-base text-muted-foreground/50 mt-1">Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* Pro Tip */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-base font-semibold text-blue-100 mb-1">Pro Tip</p>
                        <p className="text-base text-blue-200/70 leading-relaxed">
                            Add code context for 3x better results and more accurate solutions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
