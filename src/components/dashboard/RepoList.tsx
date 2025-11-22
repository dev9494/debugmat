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
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
                <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-wider">Connected Repos</h3>
                <button
                    onClick={loadRepos}
                    className={cn("p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-white transition-colors", loading && "animate-spin")}
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
                                "w-full text-left p-3 rounded-lg transition-all duration-200 border border-transparent group",
                                selectedRepo?.id === repo.id
                                    ? "bg-blue-500/10 border-blue-500/20 shadow-sm"
                                    : "hover:bg-white/5 hover:border-white/5"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "p-2 rounded-md transition-colors",
                                    selectedRepo?.id === repo.id ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-muted-foreground group-hover:text-white"
                                )}>
                                    <FolderGit2 className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={cn(
                                        "text-2xl font-semibold truncate transition-colors",
                                        selectedRepo?.id === repo.id ? "text-blue-400" : "text-gray-300 group-hover:text-white"
                                    )}>
                                        {repo.name}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        {repo.language && (
                                            <span className="flex items-center gap-1 text-base text-muted-foreground">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-base text-muted-foreground">
                                            <Star className="w-2.5 h-2.5" />
                                            {repo.stargazers_count}
                                        </span>
                                    </div>
                                </div>
                                {selectedRepo?.id === repo.id && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                                )}
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-xl m-2">
                        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                            <FolderGit2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-lg text-muted-foreground">No repositories found</p>
                    </div>
                )}

                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/10 text-base font-medium text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/5 transition-all mt-2">
                    <Plus className="w-3 h-3" />
                    Connect Repository
                </button>
            </div>
        </div>
    );
};
