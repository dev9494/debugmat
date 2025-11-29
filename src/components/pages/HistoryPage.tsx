import { useState } from 'react';
import { useErrorStore } from '../../stores/errorStore';
import { Trash2, Eye, X, Check, AlertTriangle, Info, Clock, Calendar, Code, Search } from 'lucide-react';

// Simple date formatter to avoid date-fns dependency issues
const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'Unknown date';
    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    } catch (e) {
        return 'Invalid date';
    }
};

// Simple class joiner to avoid external dependency issues
const cls = (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ');
};

const severityConfig: Record<string, { color: string; bg: string; border: string; icon: any }> = {
    critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: X },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertTriangle },
    low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info },
    default: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Info },
};

export const HistoryPage = () => {
    const { errorHistory, removeFromHistory, clearHistory, setCurrentAnalysis } = useErrorStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Safety check
    if (!errorHistory) return <div className="p-8 text-white">Loading...</div>;

    const filteredHistory = errorHistory.filter(item => {
        if (!item || !item.analysis) return false;
        const query = searchQuery.toLowerCase();
        return (item.errorMessage || '').toLowerCase().includes(query) ||
            (item.analysis.errorType || '').toLowerCase().includes(query);
    });

    const handleViewDetails = (item: any) => {
        setSelectedItem(item);
        if (item.analysis) setCurrentAnalysis(item.analysis);
    };

    return (
        <div className="min-h-screen bg-[#030712] p-6 text-slate-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-600/20">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Error History</h1>
                            <p className="text-slate-400">Timeline of {errorHistory.length} events</p>
                        </div>
                    </div>
                    {errorHistory.length > 0 && (
                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 border border-red-500/20"
                        >
                            <Trash2 className="w-4 h-4" /> Clear All
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search history..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 outline-none"
                    />
                </div>

                {/* List */}
                <div className="space-y-4">
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((item) => {
                            const severity = item.analysis?.severity || 'medium';
                            const config = severityConfig[severity] || severityConfig.default;
                            const Icon = config.icon;

                            return (
                                <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className={cls("p-2 rounded-lg", config.bg)}>
                                            <Icon className={cls("w-5 h-5", config.color)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-white truncate pr-4">
                                                    {item.analysis?.errorType || 'Unknown Error'}
                                                </h3>
                                                <span className={cls("text-xs px-2 py-0.5 rounded border", config.bg, config.color, config.border)}>
                                                    {severity.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 line-clamp-2 mb-3 font-mono">
                                                {item.errorMessage}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <div className="flex gap-4">
                                                    <span className="flex items-center gap-1"><Code className="w-3 h-3" /> {item.language}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(item.timestamp)}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleViewDetails(item)} className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white" title="View">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); removeFromHistory(item.id); }} className="p-1.5 hover:bg-red-500/20 rounded text-slate-300 hover:text-red-400" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-slate-500">No history found</div>
                    )}
                </div>

                {/* Clear Confirm Modal */}
                {showClearConfirm && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowClearConfirm(false)}>
                        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-white mb-2">Clear History?</h3>
                            <p className="text-slate-400 mb-6">This cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-2 bg-white/10 rounded-lg text-white">Cancel</button>
                                <button onClick={() => { clearHistory(); setShowClearConfirm(false); }} className="flex-1 py-2 bg-red-600 rounded-lg text-white">Clear All</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Modal */}
                {selectedItem && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
                        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{selectedItem.analysis?.errorType}</h3>
                                <button onClick={() => setSelectedItem(null)}><X className="w-5 h-5 text-slate-400" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Error</div>
                                    <div className="bg-black/50 p-3 rounded border border-white/5 font-mono text-sm text-slate-300">{selectedItem.errorMessage}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Explanation</div>
                                    <p className="text-slate-300">{selectedItem.analysis?.explanation}</p>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Solution</div>
                                    <div className="bg-black/50 p-3 rounded border border-white/5 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                                        {selectedItem.analysis?.solutions?.[0]?.code || 'No code solution available'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
