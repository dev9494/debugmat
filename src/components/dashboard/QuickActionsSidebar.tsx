import { motion } from 'framer-motion';
import { Search, Wand2, FileText, Play, Download, Settings, Zap, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useErrorStore } from '../../stores/errorStore';
import { cn } from '../../lib/utils';

interface QuickAction {
    label: string;
    icon: any;
    shortcut?: string;
    color: string;
    onClick: () => void;
    description: string;
}

export const QuickActionsSidebar = () => {
    const { setCommandPaletteOpen } = useUIStore();
    const { errorHistory, currentAnalysis } = useErrorStore();

    const handleScanCode = () => {
        const errorConsole = document.getElementById('error-console-analyzer');
        if (errorConsole) {
            errorConsole.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                const textarea = errorConsole.querySelector('textarea');
                if (textarea) textarea.focus();
            }, 500);
        }
    };

    const handleAutoFix = () => {
        if (currentAnalysis) {
            alert('Auto-fix feature will be applied to the current error');
        } else {
            alert('Please analyze an error first');
        }
    };

    const handleGenerateReport = () => {
        alert(`Report generated with ${errorHistory.length} errors.`);
    };

    const handleRunTests = () => {
        alert('Test runner will be integrated in the next update');
    };

    const handleExport = () => {
        const csvContent = errorHistory.map(e =>
            `"${e.timestamp}","${e.analysis?.errorType || 'Unknown'}","${e.analysis?.severity || 'Unknown'}","${e.status}"`
        ).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debugmate-errors-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const actions: QuickAction[] = [
        {
            label: 'Scan Code',
            icon: Search,
            shortcut: '⌘K',
            color: 'text-blue-400',
            description: 'Analyze new error',
            onClick: handleScanCode
        },
        {
            label: 'Auto-Fix',
            icon: Wand2,
            shortcut: '⌘F',
            color: 'text-purple-400',
            description: 'Apply AI fixes',
            onClick: handleAutoFix
        },
        {
            label: 'Report',
            icon: FileText,
            color: 'text-green-400',
            description: 'Generate summary',
            onClick: handleGenerateReport
        },
        {
            label: 'Run Tests',
            icon: Play,
            shortcut: '⌘T',
            color: 'text-orange-400',
            description: 'Verify fixes',
            onClick: handleRunTests
        },
        {
            label: 'Export',
            icon: Download,
            color: 'text-cyan-400',
            description: 'Download CSV',
            onClick: handleExport
        },
        {
            label: 'Settings',
            icon: Settings,
            color: 'text-gray-400',
            description: 'Preferences',
            onClick: () => alert('Settings')
        }
    ];

    return (
        <div className="h-full flex flex-col bg-card/50 border-r border-border/50">
            <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-2 text-primary font-semibold">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Quick Actions</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <motion.button
                            key={action.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={action.onClick}
                            className="w-full group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all text-left"
                        >
                            <div className={cn("p-2 rounded-md bg-muted/30 group-hover:bg-background transition-colors", action.color)}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                                    {action.shortcut && (
                                        <span className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border/50">
                                            {action.shortcut}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                            </div>
                            <ChevronRight className="w-3 h-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
