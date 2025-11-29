import React, { useEffect } from 'react';
import { Star, RefreshCw, FolderGit2, Plus } from 'lucide-react';
import { useRepoStore } from '../../stores/repoStore';
import { useAuthStore } from '../../stores/authStore';
import { fetchUserRepos } from '../../lib/github';
import { cn } from '../../lib/utils';

export const RepoList = () => {
    const { repositories, selectedRepo, setRepositories, selectRepo } = useRepoStore();
    const { githubToken, isAuthenticated } = useAuthStore();
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (isAuthenticated && githubToken) {
            loadRepos();
        }
    }, [isAuthenticated, githubToken]);

    const loadRepos = async () => {
        if (!githubToken) return;
        setLoading(true);
        try {
            const repos = await fetchUserRepos(githubToken);
            setRepositories(repos);
        } catch (error) {
            console.error('Failed to fetch repos', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4" />
                    Connected Repos
                </h3>
                <button
                    onClick={loadRepos}
                    className={cn("p-1.5 rounded-md hover:bg-white/10 text-blue-200/70 hover:text-blue-200 transition-colors", loading && "animate-spin")}
                >
                    <RefreshCw className="w-3 h-3" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {repositories.length > 0 ? (
                    repositories.map((repo) => (
                        <button
                            key={repo.id}
                            onClick={() => selectRepo(repo)}
                            className={cn(
                                "w-full text-left p-3 rounded-lg transition-all duration-200 border border-transparent group relative overflow-hidden",
                                selectedRepo?.id === repo.id
                                    ? "bg-blue-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10"
                                    : "hover:bg-white/5 hover:border-white/10"
                            )}
                        >
                            {selectedRepo?.id === repo.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
                            )}

                            <div className="flex items-start gap-3 relative z-10">
                                <div className={cn(
                                    "p-2 rounded-md transition-colors",
                                    selectedRepo?.id === repo.id ? "bg-blue-500/20 text-blue-300" : "bg-white/5 text-slate-400 group-hover:text-white"
                                )}>
                                    <FolderGit2 className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={cn(
                                        "text-sm font-semibold truncate transition-colors",
                                        selectedRepo?.id === repo.id ? "text-blue-100" : "text-slate-300 group-hover:text-white"
                                    )}>
                                        {repo.name}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        {repo.language && (
                                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            <Star className="w-2.5 h-2.5 text-yellow-500/70" />
                                            {repo.stargazers_count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="p-6 space-y-4">
                        <div className="text-center border border-dashed border-white/10 rounded-xl p-8 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
                                <FolderGit2 className="w-8 h-8 text-blue-400" />
                            </div>
                            <p className="text-base font-bold text-white mb-2">No repositories found</p>
                            <p className="text-sm text-slate-400 mb-4">Connect your GitHub to get started</p>
                        </div>

                        {/* Quick Tips */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">💡 Quick Tips</p>
                            {[
                                { emoji: '🔗', title: 'Connect GitHub', desc: 'Link your repos for better analysis' },
                                { emoji: '🎯', title: 'Track Errors', desc: 'Monitor errors across projects' },
                                { emoji: '⚡', title: 'Auto-Fix', desc: 'Let AI fix bugs automatically' }
                            ].map((tip, i) => (
                                <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <span className="text-2xl shrink-0">{tip.emoji}</span>
                                    <div>
                                        <p className="text-sm font-bold text-white">{tip.title}</p>
                                        <p className="text-xs text-slate-400">{tip.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/10 text-sm font-medium text-slate-400 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/10 transition-all mt-2 group">
                    <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    Connect Repository
                </button>
            </div>
        </div>
    );
};
