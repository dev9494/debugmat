import { motion } from 'framer-motion';
import { Search, Wand2, FileText, Play, Download, Settings, Zap } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useErrorStore } from '../../stores/errorStore';

interface QuickAction {
    label: string;
    icon: any;
    shortcut?: string;
    color: string;
    onClick: () => void;
}

interface QuickActionsToolbarProps {
    onScanCode?: () => void;
}

export const QuickActionsToolbar = ({ onScanCode }: QuickActionsToolbarProps) => {
    const { setCommandPaletteOpen } = useUIStore();
    const { errorHistory, currentAnalysis } = useErrorStore();

    const handleScanCode = () => {
        // Scroll to error console
        const errorConsole = document.querySelector('[data-error-console]');
        if (errorConsole) {
            errorConsole.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Focus the textarea after scrolling
            setTimeout(() => {
                const textarea = errorConsole.querySelector('textarea');
                if (textarea) {
                    textarea.focus();
                }
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
        const report = {
            totalErrors: errorHistory.length,
            timestamp: new Date().toISOString(),
            errors: errorHistory.slice(0, 10)
        };
        console.log('Generated Report:', report);
        alert(`Report generated with ${errorHistory.length} errors. Check console for details.`);
    };

    const handleRunTests = () => {
        alert('Test runner will be integrated in the next update');
    };

    const handleExport = () => {
        const csvContent = errorHistory.map(e =>
            `"${e.timestamp}","${e.analysis?.errorType || 'Unknown'}","${e.analysis?.severity || 'Unknown'}","${e.status}"`
        ).join('\n');
        const header = '"Timestamp","Type","Severity","Status"\n';
        const blob = new Blob([header + csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debugmate-errors-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSettings = () => {
        alert('Settings panel will open here');
    };

    const actions: QuickAction[] = [
        {
            label: 'Scan Code',
            icon: Search,
            shortcut: '⌘K',
            color: 'from-blue-500 to-blue-600',
            onClick: handleScanCode
        },
        {
            label: 'Auto-Fix',
            icon: Wand2,
            shortcut: '⌘F',
            color: 'from-purple-500 to-purple-600',
            onClick: handleAutoFix
        },
        {
            label: 'Generate Report',
            icon: FileText,
            color: 'from-green-500 to-green-600',
            onClick: handleGenerateReport
        },
        {
            label: 'Run Tests',
            icon: Play,
            shortcut: '⌘T',
            color: 'from-orange-500 to-orange-600',
            onClick: handleRunTests
        },
        {
            label: 'Export CSV',
            icon: Download,
            color: 'from-cyan-500 to-cyan-600',
            onClick: handleExport
        },
        {
            label: 'Settings',
            icon: Settings,
            color: 'from-gray-500 to-gray-600',
            onClick: handleSettings
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4"
        >
            <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {actions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                        <motion.button
                            key={action.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={action.onClick}
                            className="group relative flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/5 border border-border hover:border-primary/50 transition-all"
                        >
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-foreground text-center">
                                {action.label}
                            </span>
                            {action.shortcut && (
                                <span className="absolute top-2 right-2 text-[10px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">
                                    {action.shortcut}
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
};
