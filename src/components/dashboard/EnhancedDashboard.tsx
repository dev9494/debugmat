import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Clock, TrendingUp, Zap } from 'lucide-react';
import { StatCard } from './StatCard';
import { ErrorTrendsChart } from './ErrorTrendsChart';
import { HotErrorsFeed } from './HotErrorsFeed';
import { CodeHealthScore } from './CodeHealthScore';
import { AIInsightsPanel } from './AIInsightsPanel';
import { QuickActionsToolbar } from './QuickActionsToolbar';
import { ProfessionalCodeEditor } from './ProfessionalCodeEditor';
import { AIChatPanel } from './AIChatPanel';
import { RecentActivity } from './RecentActivity';
import { AnalysisResults } from '../analysis/AnalysisResults';
import { useErrorStore } from '../../stores/errorStore';
import { useGamificationStore } from '../../stores/gamificationStore';

export const EnhancedDashboard = () => {
    const { currentAnalysis, currentError, errorHistory } = useErrorStore();
    const { stats } = useGamificationStore();
    const [showCodeEditor, setShowCodeEditor] = useState(false);

    // Calculate real stats from actual data
    const todayErrors = errorHistory.filter(e => {
        const errorDate = new Date(e.timestamp);
        const today = new Date();
        return errorDate.toDateString() === today.toDateString();
    }).length;

    const avgFixTime = stats.averageFixTime || 0;
    const resolutionRate = errorHistory.length > 0
        ? Math.round((errorHistory.filter(e => e.status === 'resolved').length / errorHistory.length) * 100)
        : 0;

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* Quick Actions Toolbar */}
            <div className="flex-shrink-0 px-6 pt-6 pb-4">
                <QuickActionsToolbar onScanCode={() => setShowCodeEditor(true)} />
            </div>

            {/* Main Content - 3 Column Layout */}
            <div className="flex-1 grid grid-cols-12 gap-6 px-6 pb-6 min-h-0 overflow-hidden">

                {/* Left Column - Recent Activity (2 cols) */}
                <div className="col-span-2 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    <div className="bg-card border border-border rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
                        <RecentActivity />
                    </div>
                </div>

                {/* Center Column - Main Content (7 cols) */}
                <div className="col-span-7 flex flex-col gap-4 overflow-y-auto custom-scrollbar">

                    {/* Top Stats Row */}
                    <div className="grid grid-cols-4 gap-4">
                        <StatCard
                            title="Errors Today"
                            value={todayErrors}
                            trend={-15}
                            icon={<Bug className="w-6 h-6 text-white" />}
                            color="blue"
                        />
                        <StatCard
                            title="Avg Fix Time"
                            value={avgFixTime > 0 ? `${avgFixTime.toFixed(1)} min` : 'N/A'}
                            trend={-30}
                            icon={<Clock className="w-6 h-6 text-white" />}
                            color="green"
                        />
                        <StatCard
                            title="Resolution Rate"
                            value={`${resolutionRate}%`}
                            trend={5}
                            icon={<TrendingUp className="w-6 h-6 text-white" />}
                            color="purple"
                        />
                        <StatCard
                            title="Total Analyzed"
                            value={stats.errorsFixed || 0}
                            trend={3}
                            icon={<Zap className="w-6 h-6 text-white" />}
                            color="orange"
                        />
                    </div>

                    {/* Error Trends Chart */}
                    <ErrorTrendsChart />

                    {/* Code Editor / Analysis Results */}
                    {currentAnalysis && currentError ? (
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <AnalysisResults />
                        </div>
                    ) : showCodeEditor ? (
                        <div className="bg-card border border-border rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Code Editor</h3>
                                <button
                                    onClick={() => setShowCodeEditor(false)}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    Close
                                </button>
                            </div>
                            <ProfessionalCodeEditor />
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-xl p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Bug className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    Ready to Debug
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Paste your error in the code editor or use the AI chat to get started
                                </p>
                                <button
                                    onClick={() => setShowCodeEditor(true)}
                                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                                >
                                    Open Code Editor
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI Insights */}
                    <AIInsightsPanel />
                </div>

                {/* Right Column - Sidebar (3 cols) */}
                <div className="col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar">

                    {/* AI Chat Panel */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
                        <div className="px-4 py-3 border-b border-border bg-muted/30">
                            <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
                        </div>
                        <div className="flex-1 min-h-0">
                            <AIChatPanel />
                        </div>
                    </div>

                    {/* Code Health Score */}
                    <CodeHealthScore />

                    {/* Hot Errors Feed */}
                    <div className="flex-1 min-h-[300px]">
                        <HotErrorsFeed />
                    </div>
                </div>
            </div>
        </div>
    );
};
