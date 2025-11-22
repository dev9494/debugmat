import { Bug, Search, Bell, Settings, ChevronRight, User, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { cn } from '../../lib/utils';

export const Header = () => {
    const { isAuthenticated, username, avatar, login, logout } = useAuthStore();
    const { tier } = useUserStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
            {/* Main Header */}
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
                            <Bug className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">DebugMate</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-2">
                        {['Dashboard', 'History', 'Docs'].map((item, i) => (
                            <button
                                key={item}
                                className={cn(
                                    "px-5 py-2.5 text-lg font-medium rounded-md transition-all",
                                    i === 0
                                        ? "text-white bg-white/10"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-lg bg-secondary/50 border border-white/5 text-muted-foreground hover:text-foreground hover:border-white/10 transition-colors cursor-text w-80">
                        <Search className="h-5 w-5" />
                        <span className="text-lg flex-1">Search...</span>
                        <kbd className="hidden lg:inline-flex h-6 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-sm font-medium text-muted-foreground opacity-100">
                            <span className="text-sm">⌘</span>K
                        </kbd>
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                        <button className="relative p-2.5 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-background" />
                        </button>
                        <button className="p-2.5 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5">
                            <Settings className="h-5 w-5" />
                        </button>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xl font-medium text-white group-hover:text-blue-400 transition-colors">{username}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        {tier === 'pro' && <Sparkles className="w-4 h-4 text-amber-400" />}
                                        <p className="text-base text-muted-foreground capitalize">{tier} Plan</p>
                                    </div>
                                </div>
                                <img
                                    src={avatar || ''}
                                    alt={username || ''}
                                    className="h-10 w-10 rounded-full border border-white/10 ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all"
                                />
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors text-base"
                            >
                                <User className="h-4 w-4" />
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Breadcrumbs & Sub-nav */}
            <div className="flex h-11 items-center gap-2 px-6 border-t border-white/5 bg-black/20 text-sm text-muted-foreground">
                <span className="hover:text-white cursor-pointer transition-colors">Home</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-white font-medium">Dashboard</span>
            </div>
        </header>
    );
};
