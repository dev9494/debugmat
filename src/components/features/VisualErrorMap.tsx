import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileCode, AlertTriangle, Activity, FolderOpen } from 'lucide-react';
import { useErrorStore, type ErrorHistoryItem } from '../../stores/errorStore';
import { cn } from '../../lib/utils';

interface FileStats {
    path: string;
    errorCount: number;
    criticalCount: number;
    lastError: number;
    errors: ErrorHistoryItem[];
}

export const VisualErrorMap = () => {
    const { errorHistory, setFilters } = useErrorStore();

    // Aggregate errors by file
    const fileStats = useMemo(() => {
        const stats: Record<string, FileStats> = {};

        errorHistory.forEach(error => {
            // Get file path from analysis or fallback
            const path = error.analysis.filesLikelyAffected[0]?.path || 'unknown/path';

            if (!stats[path]) {
                stats[path] = {
                    path,
                    errorCount: 0,
                    criticalCount: 0,
                    lastError: 0,
                    errors: []
                };
            }

            stats[path].errorCount++;
            stats[path].errors.push(error);
            stats[path].lastError = Math.max(stats[path].lastError, error.timestamp);

            if (error.analysis.severity === 'critical' || error.analysis.severity === 'high') {
                stats[path].criticalCount++;
            }
        });

        return Object.values(stats).sort((a, b) => b.errorCount - a.errorCount);
    }, [errorHistory]);

    const getHeatmapColor = (count: number, critical: number) => {
        if (critical > 0) return 'bg-red-500/20 border-red-500/50 text-red-400';
        if (count > 5) return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
        if (count > 2) return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    };

    const getIntensity = (count: number) => {
        // Scale opacity based on error count (max 1.0)
        return Math.min(0.2 + (count * 0.1), 1);
    };

    if (fileStats.length === 0) {
        return (
            <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/30">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">No Error Data Yet</h3>
                <p className="text-muted-foreground">Analyze some errors to generate the heatmap.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Codebase Heatmap
                    </h3>
                    <p className="text-sm text-muted-foreground">Visualizing error hotspots in your project</p>
                </div>
                <div className="flex gap-2 text-xs">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        <div className="w-2 h-2 rounded-full bg-red-500" /> Critical
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        <div className="w-2 h-2 rounded-full bg-orange-500" /> High Freq
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Low Freq
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fileStats.map((file, index) => (
                    <motion.div
                        key={file.path}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                            "relative p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] group overflow-hidden",
                            getHeatmapColor(file.errorCount, file.criticalCount)
                        )}
                        onClick={() => {
                            // Filter history by this file (mock implementation for now)
                            // In a real app, we'd add a file filter to the store
                            console.log(`Filtering by ${file.path}`);
                        }}
                    >
                        {/* Background Pulse Effect for Critical */}
                        {file.criticalCount > 0 && (
                            <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
                        )}

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm">
                                    <FileCode className="w-5 h-5" />
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold">{file.errorCount}</span>
                                    <p className="text-xs opacity-70">errors</p>
                                </div>
                            </div>

                            <h4 className="font-mono text-sm font-semibold truncate mb-1" title={file.path}>
                                {file.path.split('/').pop()}
                            </h4>
                            <p className="text-xs opacity-60 truncate mb-4" title={file.path}>
                                {file.path}
                            </p>

                            <div className="flex items-center gap-3 text-xs opacity-80 border-t border-current/10 pt-3">
                                {file.criticalCount > 0 && (
                                    <span className="flex items-center gap-1 font-medium text-red-400">
                                        <AlertTriangle className="w-3 h-3" />
                                        {file.criticalCount} Critical
                                    </span>
                                )}
                                <span className="ml-auto">
                                    {new Date(file.lastError).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
