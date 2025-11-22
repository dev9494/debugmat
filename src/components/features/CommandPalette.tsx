import { useState, useRef, useEffect } from 'react';
import { Search, Command, Sparkles, History, Settings, HelpCircle, X } from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { cn } from '../../lib/utils';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

type CommandItem = {
    id: string;
    title: string;
    description?: string;
    icon: React.ReactNode;
    action: () => void;
    category: string;
};

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { errorHistory, setCurrentAnalysis, setFilters } = useErrorStore();

    const commands: CommandItem[] = [
        {
            id: 'analyze',
            title: 'Analyze New Error',
            description: 'Start analyzing a new error',
            icon: <Sparkles className="w-4 h-4" />,
            action: () => {
                onClose();
                document.querySelector<HTMLTextAreaElement>('textarea')?.focus();
            },
            category: 'Actions',
        },
        {
            id: 'search',
            title: 'Search Errors',
            description: 'Search through error history',
            icon: <Search className="w-4 h-4" />,
            action: () => {
                onClose();
                // Focus search input
                const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
                searchInput?.focus();
            },
            category: 'Navigation',
        },
        {
            id: 'clear-filters',
            title: 'Clear All Filters',
            description: 'Reset search and filters',
            icon: <X className="w-4 h-4" />,
            action: () => {
                setFilters({
                    searchQuery: '',
                    severity: 'all',
                    status: 'all',
                    dateRange: 'all',
                    language: 'all',
                });
                onClose();
            },
            category: 'Actions',
        },
        ...errorHistory.slice(0, 5).map((item, index) => ({
            id: `history-${item.id}`,
            title: item.analysis.errorType,
            description: item.errorMessage.slice(0, 60) + '...',
            icon: <History className="w-4 h-4" />,
            action: () => {
                setCurrentAnalysis(item.analysis);
                onClose();
            },
            category: 'Recent Errors',
        })),
    ];

    const filteredCommands = query
        ? commands.filter(
            (cmd) =>
                cmd.title.toLowerCase().includes(query.toLowerCase()) ||
                cmd.description?.toLowerCase().includes(query.toLowerCase())
        )
        : commands;

    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                filteredCommands[selectedIndex]?.action();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, filteredCommands, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in"
                onClick={onClose}
            />

            {/* Command Palette */}
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
                <div className="bg-[#141414] border border-white/10 rounded-2xl shadow-2xl pointer-events-auto animate-in zoom-in-95 slide-in-from-top-4">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-white/10">
                        <Command className="w-5 h-5 text-muted-foreground shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Type a command or search..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedIndex(0);
                            }}
                            className="flex-1 bg-transparent border-0 text-lg text-white placeholder:text-muted-foreground focus:outline-none"
                        />
                        <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs font-mono text-muted-foreground">
                            ESC
                        </kbd>
                    </div>

                    {/* Commands List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {Object.keys(groupedCommands).length > 0 ? (
                            <div className="p-2">
                                {Object.entries(groupedCommands).map(([category, items]) => (
                                    <div key={category} className="mb-4 last:mb-0">
                                        <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            {category}
                                        </div>
                                        <div className="space-y-1">
                                            {items.map((cmd, index) => {
                                                const globalIndex = filteredCommands.indexOf(cmd);
                                                return (
                                                    <button
                                                        key={cmd.id}
                                                        onClick={cmd.action}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all",
                                                            globalIndex === selectedIndex
                                                                ? "bg-blue-500/20 border border-blue-500/30"
                                                                : "hover:bg-white/5 border border-transparent"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "p-2 rounded-md",
                                                            globalIndex === selectedIndex
                                                                ? "bg-blue-500/20 text-blue-400"
                                                                : "bg-white/5 text-muted-foreground"
                                                        )}>
                                                            {cmd.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-base font-medium text-white">
                                                                {cmd.title}
                                                            </div>
                                                            {cmd.description && (
                                                                <div className="text-sm text-muted-foreground truncate">
                                                                    {cmd.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {globalIndex === selectedIndex && (
                                                            <kbd className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30 text-xs font-mono text-blue-400">
                                                                ↵
                                                            </kbd>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                                    <Search className="w-5 h-5 text-muted-foreground/50" />
                                </div>
                                <p className="text-base text-muted-foreground">No commands found</p>
                                <p className="text-sm text-muted-foreground/50 mt-1">Try a different search</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/[0.02]">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">↑</kbd>
                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">↓</kbd>
                                to navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">↵</kbd>
                                to select
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
