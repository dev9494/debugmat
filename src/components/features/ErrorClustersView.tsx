import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Layers, FileCode, ArrowRight } from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { clusterErrors, getClusterStats, type ErrorCluster } from '../../lib/errorClustering';
import { getSeverityColor } from '../../lib/severityDetection';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const ErrorClustersView = () => {
    const { errorHistory, setCurrentAnalysis, setCurrentError } = useErrorStore();

    const clusters = useMemo(() => clusterErrors(errorHistory), [errorHistory]);
    const stats = useMemo(() => getClusterStats(clusters), [clusters]);

    const getTrendIcon = (trend: ErrorCluster['trend']) => {
        switch (trend) {
            case 'increasing':
                return <TrendingUp className="w-4 h-4 text-red-400" />;
            case 'decreasing':
                return <TrendingDown className="w-4 h-4 text-green-400" />;
            default:
                return <Minus className="w-4 h-4 text-slate-400" />;
        }
    };

    const getTrendColor = (trend: ErrorCluster['trend']) => {
        switch (trend) {
            case 'increasing':
                return 'text-red-400';
            case 'decreasing':
                return 'text-green-400';
            default:
                return 'text-slate-400';
        }
    };

    const handleClusterClick = (cluster: ErrorCluster) => {
        // Load the most recent error from the cluster
        const latestError = cluster.errors.sort((a, b) => b.timestamp - a.timestamp)[0];
        setCurrentError(latestError.errorMessage);
        setCurrentAnalysis(latestError.analysis);
    };

    if (errorHistory.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 animate-pulse">
                    <Layers className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Error Clusters Yet</h3>
                <p className="text-base text-slate-400 max-w-sm">
                    Analyze some errors first, and I'll automatically group similar ones together.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-up">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Total Clusters</p>
                    <p className="text-3xl font-bold text-white">{stats.totalClusters}</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Total Errors</p>
                    <p className="text-3xl font-bold text-white">{stats.totalErrors}</p>
                </div>
                <div className="glass-card p-4 rounded-xl border-red-500/20 bg-red-500/5">
                    <p className="text-sm text-red-300 mb-1">Critical</p>
                    <p className="text-3xl font-bold text-red-400">{stats.criticalClusters}</p>
                </div>
                <div className="glass-card p-4 rounded-xl border-orange-500/20 bg-orange-500/5">
                    <p className="text-sm text-orange-300 mb-1">Increasing</p>
                    <p className="text-3xl font-bold text-orange-400">{stats.increasingClusters}</p>
                </div>
            </div>

            {/* Clusters List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Layers className="w-6 h-6 text-purple-400" />
                        Error Clusters
                    </h2>
                    <p className="text-sm text-slate-400">
                        Grouped by similarity • Click to view
                    </p>
                </div>

                {clusters.length === 0 ? (
                    <div className="glass-card p-8 text-center rounded-xl">
                        <p className="text-base text-slate-400">
                            No clusters found. Errors will be grouped automatically as you analyze more.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {clusters.map((cluster) => (
                            <button
                                key={cluster.id}
                                onClick={() => handleClusterClick(cluster)}
                                className="w-full text-left glass-card rounded-xl p-5 transition-all group hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/10 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-start justify-between gap-4 relative z-10">
                                    <div className="flex-1 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className={cn(
                                                    'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                                                    getSeverityColor(cluster.severity).replace(
                                                        'text-',
                                                        'bg-'
                                                    ) + '/20',
                                                    getSeverityColor(cluster.severity)
                                                )}
                                            >
                                                {cluster.severity}
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg">
                                                {getTrendIcon(cluster.trend)}
                                                <span className={cn('text-xs font-medium uppercase', getTrendColor(cluster.trend))}>
                                                    {cluster.trend}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                <span className="text-sm font-semibold text-white">
                                                    {cluster.count}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Error Type */}
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors flex items-center gap-2">
                                            {cluster.errorType}
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </h3>

                                        {/* Common Pattern */}
                                        <p className="text-base text-slate-300 mb-3 line-clamp-2 font-mono bg-black/20 p-2 rounded-lg border border-white/5">
                                            {cluster.commonPattern}
                                        </p>

                                        {/* Root Cause */}
                                        {cluster.rootCause && (
                                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-3">
                                                <p className="text-xs text-orange-400 font-bold uppercase mb-1">
                                                    Root Cause Detected
                                                </p>
                                                <p className="text-sm text-slate-200">{cluster.rootCause}</p>
                                            </div>
                                        )}

                                        {/* Affected Files */}
                                        {cluster.affectedFiles.length > 0 && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <FileCode className="w-4 h-4 text-slate-500" />
                                                {cluster.affectedFiles.slice(0, 3).map((file, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs bg-white/5 px-2 py-1 rounded text-slate-400 font-mono border border-white/5"
                                                    >
                                                        {file.split('/').pop()}
                                                    </span>
                                                ))}
                                                {cluster.affectedFiles.length > 3 && (
                                                    <span className="text-xs text-slate-500">
                                                        +{cluster.affectedFiles.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <div className="text-right shrink-0 flex flex-col gap-2">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-0.5">First seen</p>
                                            <p className="text-sm text-white font-medium">
                                                {formatDistanceToNow(cluster.firstSeen, { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-0.5">Last seen</p>
                                            <p className="text-sm text-white font-medium">
                                                {formatDistanceToNow(cluster.lastSeen, { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
