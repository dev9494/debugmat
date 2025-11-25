import { X, Keyboard } from 'lucide-react';
import { formatShortcut, type KeyboardShortcut } from '../../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
    shortcuts: KeyboardShortcut[];
}

export const KeyboardShortcutsHelp = ({ isOpen, onClose, shortcuts }: KeyboardShortcutsHelpProps) => {
    if (!isOpen) return null;

    const categories = {
        'Navigation': shortcuts.filter(s => ['k', 'f', 'escape'].includes(s.key.toLowerCase())),
        'Actions': shortcuts.filter(s => ['c', 'enter', 'delete'].includes(s.key.toLowerCase())),
        'Movement': shortcuts.filter(s => ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(s.key.toLowerCase())),
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="glass-card rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 bg-[#0f172a]/90 border-white/10">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                                <Keyboard className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                                <p className="text-base text-slate-400 mt-0.5">Work faster with shortcuts</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <div className="space-y-6">
                            {Object.entries(categories).map(([category, categoryShortcuts]) => (
                                categoryShortcuts.length > 0 && (
                                    <div key={category}>
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-blue-500" />
                                            {category}
                                        </h3>
                                        <div className="space-y-2">
                                            {categoryShortcuts.map((shortcut, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group"
                                                >
                                                    <span className="text-base text-slate-300 group-hover:text-white transition-colors">{shortcut.description}</span>
                                                    <kbd className="px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-sm font-mono text-white shadow-sm group-hover:bg-white/20 group-hover:border-white/30 transition-all">
                                                        {formatShortcut(shortcut)}
                                                    </kbd>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Press <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs font-mono text-slate-300">?</kbd> or{' '}
                            <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs font-mono text-slate-300">/</kbd> to toggle this help
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
