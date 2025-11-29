import { useErrorStore } from '../../stores/errorStore';
import { useAuth } from '../../contexts/AuthContext';
import { deleteErrorFromFirestore } from '../../lib/firestore';
import { Clock, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const RecentActivity = () => {
    const { errorHistory, setCurrentAnalysis, setCurrentError, removeFromHistory } = useErrorStore();
    const { currentUser } = useAuth();

    const recentErrors = errorHistory.slice(0, 5);

    const handleErrorClick = (error: typeof errorHistory[0]) => {
        setCurrentError(error.errorMessage);
        setCurrentAnalysis(error.analysis);
    };

    const handleDelete = async (e: React.MouseEvent, errorId: string) => {
        e.stopPropagation(); // Prevent triggering the error click
        removeFromHistory(errorId);

        if (currentUser) {
            await deleteErrorFromFirestore(errorId);
        }
    };

    if (recentErrors.length === 0) {
        return (
            <div className="flex flex-col h-full bg-card">
                <div className="p-5 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-bold text-base text-foreground">HISTORY</h3>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">No errors analyzed yet</p>
                        <p className="text-sm text-muted-foreground mt-2">History will appear here</p>
                    </div>
                </div>
            </div>
        );
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getSeverityLabel = (severity: string) => {
        return severity.charAt(0).toUpperCase() + severity.slice(1);
    };

    return (
        <div className="flex flex-col h-full bg-card">
            <div className="p-5 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-bold text-base text-foreground">HISTORY</h3>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-3 space-y-3">
                    {recentErrors.map((error) => (
                        <div
                            key={error.id}
                            className="relative p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer group border border-border hover:border-primary/50 shadow-lg"
                        >
                            {/* Delete Button */}
                            <button
                                onClick={(e) => handleDelete(e, error.id)}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-card hover:bg-red-600 text-muted-foreground hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10 border border-border"
                                title="Delete this error"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Error Content - Clickable */}
                            <div onClick={() => handleErrorClick(error)} className="flex items-start gap-3 mb-3">
                                <div className="flex-shrink-0 mt-1">
                                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(error.analysis.severity)}`}></div>
                                </div>
                                <div className="flex-1 min-w-0 pr-6">
                                    <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                        Error: {error.analysis.errorType}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {formatDistanceToNow(error.timestamp, { addSuffix: true })}
                                    </p>
                                    <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-muted text-foreground font-medium border border-border">
                                        {getSeverityLabel(error.analysis.severity)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
