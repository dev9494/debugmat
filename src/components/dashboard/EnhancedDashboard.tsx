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
import { useErrorStore } from '../../stores/errorStore';

export const EnhancedDashboard = () => {
    const { currentAnalysis } = useErrorStore();
    const [activeView, setActiveView] = useState<'overview' | 'editor'>('overview');

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* Quick Actions Toolbar */}
            <div className="flex-shrink-0 px-6 pt-6 pb-4">
                <QuickActionsToolbar />
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-12 gap-6 px-6 pb-6 min-h-0 overflow-hidden">

                {/* Left Column - Stats & Charts */}
                <div className="col-span-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                    {/* Top Stats Row */}
                    <div className="grid grid-cols-4 gap-4">
                        <StatCard
                            title="Errors Today"
                            value="23"
                            trend={-15}
                            icon={<Bug className="w-6 h-6 text-white" />}
                            color="blue"
                        />
                        <StatCard
                            title="Avg Fix Time"
                            value="4.2 min"
                            trend={-30}
                            icon={<Clock className="w-6 h-6 text-white" />}
                            color="green"
                        />
                        <StatCard
                            title="Resolution Rate"
                            value="94%"
                            trend={5}
                            icon={<TrendingUp className="w-6 h-6 text-white" />}
                            color="purple"
                        />
                        <StatCard
                            title="Code Quality"
                            value="87/100"
                            trend={3}
                            icon={<Zap className="w-6 h-6 text-white" />}
                            color="orange"
                        />
                    </div>

                    {/* Error Trends Chart */}
                    <ErrorTrendsChart />

                    {/* Code Editor / Analysis View */}
                    {currentAnalysis ? (
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Analysis Results</h3>
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
                                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors">
                                    Start Analyzing
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI Insights */}
                    <AIInsightsPanel />
                </div>

                {/* Right Column - Sidebar */}
                <div className="col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                    {/* Code Health Score */}
                    <CodeHealthScore />

                    {/* Hot Errors Feed */}
                    <div className="flex-1 min-h-[400px]">
                        <HotErrorsFeed />
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                        <RecentActivity />
                    </div>
                </div>
            </div>
        </div>
    );
};
