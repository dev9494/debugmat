import { Database, Code2, GitBranch, Clock, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { useErrorStore } from '../../stores/errorStore';

interface Repository {
    name: string;
    language: string;
    languageColor: string;
    branch: string;
}

export const RepositoriesList = () => {
    const { setCurrentError, errorHistory, removeFromHistory } = useErrorStore();
    const [repos] = useState<Repository[]>([
        { name: 'analytics-service', language: 'TypeScript', languageColor: '#3178c6', branch: 'main' },
        { name: 'user-onboarding', language: 'Python', languageColor: '#3572A5', branch: 'dev' },
        { name: 'payment-gateway', language: 'Go', languageColor: '#00ADD8', branch: 'feature/auth' },
        { name: 'frontend-client', language: 'React', languageColor: '#61dafb', branch: 'main' },
    ]);

    const sampleErrors = [
        {
            title: 'Error in UserAuth.ts',
            time: '2 mins ago',
            type: 'Critical',
            code: `try {
    await auth.login(user);
} catch (e) {
    console.log(e.message); // Error: Object is of type 'unknown'
}`
        },
        {
            title: 'API latency spike',
            time: '1 hour ago',
            type: 'Warning',
            code: `// High latency detected in /api/v1/users
// P99: 2500ms
// Potential N+1 query in UserController.ts`
        },
        {
            title: 'Database timeout',
            time: 'yesterday',
            type: 'Error',
            code: `ConnectionError: connect ETIMEDOUT 10.0.0.5:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1146:16)`
        },
    ];

    const displayHistory = errorHistory.length > 0 ? errorHistory : sampleErrors.map((e, i) => ({
        id: `sample-${i}`,
        timestamp: Date.now() - (i * 3600000),
        errorMessage: e.title,
        language: 'typescript',
        analysis: null as any,
        status: e.type.toLowerCase() as any,
        code: e.code
    }));

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        removeFromHistory(id);
    };

    const getTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Header */}
            <div className="p-5 border-b border-border bg-muted/30">
                <h2 className="text-base font-semibold text-foreground uppercase tracking-wider flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-primary" />
                    Connected Repos
                </h2>
            </div>

            {/* Repositories List */}
            <div className="p-4 space-y-3">
                {repos.map((repo, index) => (
                    <button
                        key={index}
                        className="w-full p-4 rounded-lg bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-all group text-left"
                    >
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                {repo.name}
                            </span>
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/50">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                                <span className="text-sm font-mono text-muted-foreground">{repo.language}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GitBranch className="w-4 h-4" />
                            <span className="font-mono">{repo.branch}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Recent Analyses Header */}
            <div className="p-5 border-t border-b border-border bg-muted/30 mt-auto">
                <h2 className="text-base font-semibold text-foreground uppercase tracking-wider flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-purple-500" />
                    Recent Activity
                    {errorHistory.length > 0 && (
                        <span className="ml-auto text-sm text-muted-foreground font-medium">
                            {errorHistory.length}
                        </span>
                    )}
                </h2>
            </div>

            {/* Recent Analyses List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {displayHistory.map((analysis) => (
                    <button
                        key={analysis.id}
                        onClick={() => setCurrentError((analysis as any).code || analysis.errorMessage)}
                        className="w-full p-4 rounded-lg bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-all group text-left relative"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-base font-medium text-foreground group-hover:text-purple-500 transition-colors truncate pr-10">
                                {analysis.errorMessage}
                            </span>
                            {!analysis.id.startsWith('sample-') && (
                                <button
                                    onClick={(e) => handleDelete(analysis.id, e)}
                                    className="absolute right-4 top-4 p-1.5 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{getTimeAgo(analysis.timestamp)}</span>
                            <span className={cn(
                                "px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider",
                                (analysis.status === 'Critical' || analysis.status === 'critical') && "bg-red-500/20 text-red-600 dark:text-red-400",
                                (analysis.status === 'Warning' || analysis.status === 'warning') && "bg-orange-500/20 text-orange-600 dark:text-orange-400",
                                (analysis.status === 'Error' || analysis.status === 'error' || analysis.status === 'new') && "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            )}>
                                {analysis.status || 'new'}
                            </span>
                        </div>
                    </button>
                ))}
                {displayHistory.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground text-base">
                        No recent analyses
                    </div>
                )}
            </div>
        </div>
    );
};
