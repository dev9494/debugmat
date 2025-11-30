import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Flame, TrendingUp, Zap } from 'lucide-react';
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

    // Calculate real stats from actual data
    const todayErrors = errorHistory.filter(e => {
        const errorDate = new Date(e.timestamp);
        const today = new Date();
        return errorDate.toDateString() === today.toDateString();
    }).length;

    const resolutionRate = errorHistory.length > 0
        ? Math.round((errorHistory.filter(e => e.status === 'resolved').length / errorHistory.length) * 100)
        : 0;

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* Quick Actions Toolbar */}
            <div className="flex-shrink-0 px-6 pt-6 pb-4">
                <QuickActionsToolbar />
            </div>

            {/* Main Content - 2 Column Layout (70% - 30%) */}
            <div className="flex-1 grid grid-cols-10 gap-6 px-6 pb-6 min-h-0 overflow-hidden">

                {/* Left Column - Main Content (7 cols) */}
                <div className="col-span-7 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">

                    {/* Top Stats Row */}
                    <div className="grid grid-cols-4 gap-4">
                        <StatCard
                            title="Errors Today"
                            value={todayErrors}
                            trend={-15}
                            icon={<Bug className="w-5 h-5 text-white" />}
                            color="blue"
                        />
                        <StatCard
                            title="Active Streak"
                            value={`${stats.streak} days`}
                            trend={10}
                            icon={<Flame className="w-5 h-5 text-white" />}
                            color="orange"
                        />
                        <StatCard
                            title="Resolution Rate"
                            value={`${resolutionRate}%`}
                            trend={5}
                            icon={<TrendingUp className="w-5 h-5 text-white" />}
                            color="purple"
                        />
                        <StatCard
                            title="Total Fixed"
                            value={stats.totalErrorsFixed || 0}
                            trend={3}
                            icon={<Zap className="w-5 h-5 text-white" />}
                            color="green"
                        />
                    </div>

                    {/* ERROR CONSOLE ANALYZER - MAIN FEATURE - ALWAYS VISIBLE */}
                    <div
                        id="error-console-analyzer"
                        className="bg-card border-2 border-primary/50 rounded-xl overflow-hidden shadow-lg shadow-primary/20"
                    >
                        <div className="px-6 py-4 bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                        <Bug className="w-6 h-6 text-primary" />
                                        Error Console Analyzer
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Paste your error below for instant AI-powered analysis
                                    </p>
                                </div>
                                {currentAnalysis && (
                                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                                        <span className="text-xs font-semibold text-green-400">Analyzed</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-6">
                            <ProfessionalCodeEditor />
                        </div>
                    </div>

                    {/* Analysis Results - Show when available */}
                    {currentAnalysis && currentError && (
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <AnalysisResults />
                        </div>
                    )}

                    {/* Error Trends Chart */}
                    <ErrorTrendsChart />

                    {/* AI Insights */}
                    <AIInsightsPanel />
                </div>

                {/* Right Column - Sidebar (3 cols) */}
                <div className="col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pl-2">

                    {/* AI Chat Panel - ALWAYS VISIBLE */}
                    <div className="bg-card border-2 border-primary/30 rounded-xl overflow-hidden flex flex-col shadow-lg h-[500px]">
                        <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
                            <span className="ml-auto text-xs text-muted-foreground">Online</span>
                        </div>
                        <div className="flex-1 min-h-0">
                            <AIChatPanel />
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-card border border-border rounded-xl p-4 max-h-[300px] overflow-hidden flex flex-col">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <RecentActivity />
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
