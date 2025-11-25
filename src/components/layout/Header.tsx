import { useState, useRef, useEffect } from 'react';
import { Bug, Search, Bell, Settings, ChevronRight, User, Sparkles, LogOut, Moon, Sun, Monitor, Volume2, Shield, X, Check } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';

export const Header = () => {
    const { isAuthenticated, username, avatar, login, logout } = useAuthStore();
    const { tier } = useUserStore();
    const { setCommandPaletteOpen } = useUIStore();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);

    // Mock Notifications
    const notifications = [
        { id: 1, title: 'Analysis Complete', message: 'Error #402 has been analyzed successfully.', time: '2m ago', unread: true },
        { id: 2, title: 'New Feature', message: 'Try the new Prevention Mode!', time: '1h ago', unread: true },
        { id: 3, title: 'System Update', message: 'DebugMate has been updated to v2.0.', time: '1d ago', unread: false },
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f172a]/70 backdrop-blur-xl">
            {/* Main Header */}
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/40">
                            <Bug className="h-5 w-5 text-white" />
                            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                            DebugMate
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {['Dashboard', 'History', 'Docs'].map((item, i) => (
                            <button
                                key={item}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                    i === 0
                                        ? "text-white bg-white/10 shadow-sm border border-white/5"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        onClick={() => setCommandPaletteOpen(true)}
                        className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-black/20 border border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-black/40 transition-all cursor-text w-64 group focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50"
                    >
                        <Search className="h-4 w-4 group-focus-within:text-blue-400 transition-colors" />
                        <span className="text-sm flex-1">Search...</span>
                        <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/10 pl-4 relative">
                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    setShowSettings(false);
                                }}
                                className={cn(
                                    "relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5",
                                    showNotifications && "bg-white/5 text-white"
                                )}
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-[#0f172a] animate-pulse" />
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                                        <h3 className="font-semibold text-white">Notifications</h3>
                                        <span className="text-xs text-blue-400 font-medium px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">2 New</span>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {notifications.map((notification) => (
                                            <div key={notification.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className={cn("text-sm font-medium", notification.unread ? "text-white" : "text-slate-400")}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-xs text-slate-500">{notification.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                                        <button className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
                                            Mark all as read
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <div className="relative" ref={settingsRef}>
                            <button
                                onClick={() => {
                                    setShowSettings(!showSettings);
                                    setShowNotifications(false);
                                }}
                                className={cn(
                                    "p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5",
                                    showSettings && "bg-white/5 text-white"
                                )}
                            >
                                <Settings className="h-5 w-5" />
                            </button>

                            {/* Settings Dropdown */}
                            {showSettings && (
                                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                                    <div className="p-4 border-b border-white/5 bg-white/5">
                                        <h3 className="font-semibold text-white">Quick Settings</h3>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-slate-300 hover:text-white transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <Moon className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                                                <span>Theme</span>
                                            </div>
                                            <span className="text-xs text-slate-500">Dark</span>
                                        </button>
                                        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-slate-300 hover:text-white transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <Volume2 className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                                                <span>Sound</span>
                                            </div>
                                            <span className="text-xs text-slate-500">On</span>
                                        </button>
                                        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-slate-300 hover:text-white transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                                                <span>Privacy</span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-white/5 mt-2">
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-sm text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{username}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        {tier === 'pro' && <Sparkles className="w-3 h-3 text-amber-400" />}
                                        <p className="text-xs text-slate-400 capitalize">{tier} Plan</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <img
                                        src={avatar || ''}
                                        alt={username || ''}
                                        className="h-9 w-9 rounded-full border border-white/10 ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all"
                                    />
                                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#0f172a]" />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-blue-50 transition-colors text-sm shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-105 active:scale-95"
                            >
                                <User className="h-4 w-4" />
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Breadcrumbs & Sub-nav */}
            <div className="flex h-10 items-center gap-2 px-6 border-t border-white/5 bg-black/20 text-xs text-slate-400 backdrop-blur-sm">
                <span className="hover:text-white cursor-pointer transition-colors hover:underline">Home</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-blue-400 font-medium flex items-center gap-1">
                    <Bug className="w-3 h-3" />
                    Dashboard
                </span>
            </div>
        </header>
    );
};
