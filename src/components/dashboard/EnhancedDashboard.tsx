import { QuickActionsSidebar } from './QuickActionsSidebar';
import { CodeAnalysisWorkspace } from './CodeAnalysisWorkspace';
import { AIChatPanel } from './AIChatPanel';
import { CompactMetricsRow } from './CompactMetricsRow';
import { Sparkles } from 'lucide-react';

export const EnhancedDashboard = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* Main Content - 3 Column Layout */}
            <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden">

                {/* Left Column - Quick Actions (2 cols ~ 16.6%) */}
                <div className="hidden md:block col-span-2 border-r border-border/50 bg-card/30">
                    <QuickActionsSidebar />
                </div>

                {/* Center Column - Workspace (7 cols ~ 58.3%) */}
                <div className="col-span-12 md:col-span-7 lg:col-span-7 flex flex-col min-h-0 overflow-hidden bg-background/50">
                    <div className="flex-1 flex flex-col p-4 min-h-0 overflow-y-auto custom-scrollbar">
                        {/* Metrics Row */}
                        <CompactMetricsRow />

                        {/* Main Workspace */}
                        <div className="flex-1 min-h-[500px]">
                            <CodeAnalysisWorkspace />
                        </div>
                    </div>
                </div>

                {/* Right Column - AI Chat (3 cols ~ 25%) */}
                <div className="hidden md:flex col-span-3 border-l border-border/50 bg-card/30 flex-col min-h-0">
                    {/* Chat Header - matching sidebar style */}
                    <div className="p-3 border-b border-border/50 flex items-center gap-2 bg-muted/10">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">AI Assistant</span>
                        <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-medium text-green-500">Online</span>
                        </span>
                    </div>

                    <div className="flex-1 min-h-0 overflow-hidden">
                        <AIChatPanel />
                    </div>
                </div>
            </div>
        </div>
    );
};
