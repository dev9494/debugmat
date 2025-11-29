import { useState, useRef, useEffect } from 'react';
import { Bug, Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUIStore } from '../../stores/uiStore';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../../lib/utils';

export const Header = () => {
    const { currentUser, signInWithGoogle, logout } = useAuth();
    const { setCommandPaletteOpen } = useUIStore();

    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const notificationRef = useRef<HTMLDivElement>(null);

    const notifications = [
        { id: 1, title: 'Analysis Complete', message: 'Error #402 has been analyzed successfully.', time: '2m ago', unread: true },
        { id: 2, title: 'New Feature', message: 'Try the new Prevention Mode!', time: '1h ago', unread: true },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        window.dispatchEvent(new CustomEvent('tabChange', { detail: { tab } }));
    };

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-20 items-center justify-between px-8">
                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                            <Bug className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">
                            DebugMate
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {['Dashboard', 'History', 'Docs'].map((item) => (
                            <button
                                key={item}
                                onClick={() => handleTabClick(item)}
                                className={cn(
                                    "px-5 py-2.5 text-base font-medium rounded-lg transition-colors",
                                    activeTab === item
                                        ? "text-foreground bg-muted"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right: Search + Actions */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div
                        onClick={() => setCommandPaletteOpen(true)}
                        className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-lg border border-input bg-background text-base text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer min-w-[280px]"
                    >
                        <Search className="h-5 w-5" />
                        <span>Search...</span>
                        <kbd className="ml-auto hidden lg:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                            <span>⌘</span>K
                        </kbd>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={cn(
                                    "relative p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                                    showNotifications && "bg-accent text-foreground"
                                )}
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="fixed right-4 mt-2 w-96 rounded-xl border-2 border-border bg-popover shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 z-[9999]">
                                    <div className="p-5 border-b border-border flex items-center justify-between bg-card">
                                        <h3 className="font-semibold text-lg text-foreground">Notifications</h3>
                                        <span className="text-sm text-muted-foreground px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium">2 New</span>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto bg-card">
                                        {notifications.map((notification) => (
                                            <div key={notification.id} className="p-5 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className={cn("text-base font-semibold", notification.unread ? "text-foreground" : "text-muted-foreground")}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-sm text-muted-foreground">{notification.time}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-border bg-card">
                                        <button className="w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                            Mark all as read
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User */}
                        {currentUser ? (
                            <div className="flex items-center gap-3 pl-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`}
                                        alt={currentUser.displayName || 'User'}
                                        className="h-9 w-9 rounded-full border-2 border-border"
                                    />
                                    <div className="hidden lg:block text-sm">
                                        <p className="font-medium text-foreground">{currentUser.displayName}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <User className="h-5 w-5" />
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
