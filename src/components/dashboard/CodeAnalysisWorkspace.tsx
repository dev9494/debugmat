import { useState } from 'react';
import { ProfessionalCodeEditor } from './ProfessionalCodeEditor';
import { AnalysisResults } from '../analysis/AnalysisResults';
import { useErrorStore } from '../../stores/errorStore';
import { Layers, AlertCircle, Activity, Shield, History, GitBranch, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const CodeAnalysisWorkspace = () => {
    const { currentAnalysis, currentError } = useErrorStore();
    const [activeTab, setActiveTab] = useState<'editor' | 'results' | 'history'>('editor');

    // Auto-switch to results when analysis is done
    if (currentAnalysis && activeTab === 'editor' && !currentError) {
        // Keep editor active if user is typing, but if analysis just finished...
        // Actually, let's keep it simple. User manually switches or we show both if space allows.
        // For now, tabs.
    }

    return (
        <div className="flex flex-col h-full bg-card/30 rounded-xl border border-border/50 overflow-hidden">
            {/* Workspace Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                            <Layers className="w-4 h-4" />
                        </div>
                        <span>Project Analysis</span>
                    </div>
                    <div className="h-4 w-px bg-border/50" />
                    <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>main</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </div>

                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                            activeTab === 'editor'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('results')}
                        disabled={!currentAnalysis}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
                            activeTab === 'results'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                            !currentAnalysis && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        Results
                        {currentAnalysis && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                            activeTab === 'history'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        History
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'editor' && (
                    <div className="h-full flex flex-col">
                        <div id="error-console-analyzer" className="flex-1 overflow-hidden">
                            <ProfessionalCodeEditor />
                        </div>
                    </div>
                )}

                {activeTab === 'results' && currentAnalysis && (
                    <div className="h-full overflow-y-auto custom-scrollbar p-4">
                        <AnalysisResults />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        <div className="text-center">
                            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Analysis history coming soon</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
