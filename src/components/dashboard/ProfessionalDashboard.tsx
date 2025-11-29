import { useState } from 'react';
import { ProfessionalStatsCards } from './ProfessionalStatsCards';
import { RecentActivity } from './RecentActivity';
import { AIChatPanel } from './AIChatPanel';
import { ProfessionalCodeEditor } from './ProfessionalCodeEditor';
import { WarRoomPanel } from '../features/WarRoomPanel';
import { useErrorStore } from '../../stores/errorStore';
import { MessageSquare, Sparkles, AlertTriangle, Lightbulb, X, ArrowDown, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { PricingModal } from '../subscription/PricingModal';

export const ProfessionalDashboard = () => {
    const { currentAnalysis, setCurrentAnalysis, currentError } = useErrorStore();
    const [rightSidebarTab, setRightSidebarTab] = useState<'chat' | 'war-room'>('chat');

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <PricingModal />
            {/* Top Stats Cards - Compact */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
                <ProfessionalStatsCards />
            </div>

            {/* Main Content - Fixed Height Grid */}
            <div className="flex-1 grid grid-cols-12 gap-4 px-4 pb-4 min-h-0 overflow-hidden">

                {/* Left Sidebar - History - ALWAYS VISIBLE */}
                <div className="col-span-2 flex flex-col h-full overflow-hidden">
                    <div className="h-full rounded-2xl border border-border shadow-xl bg-card overflow-hidden flex flex-col">
                        <RecentActivity />
                    </div>
                </div>

                {/* Center - Error Console + Analysis in Split View */}
                <div className="col-span-8 flex flex-col h-full gap-4 overflow-hidden">

                    {/* Welcome Banner - Only when no error */}
                    <AnimatePresence>
                        {!currentError && !currentAnalysis && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl px-6 py-3 shadow-2xl flex items-center justify-center gap-4 flex-shrink-0"
                            >
                                <span className="text-white font-bold text-lg">
                                    Welcome to DebugMate AI - Paste your error below
                                </span>
                                <ArrowDown className="w-5 h-5 text-white animate-bounce" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Split View: Error Console + Analysis Side by Side when analysis exists */}
                    {currentAnalysis ? (
                        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0 overflow-hidden">
                            {/* Error Console - Left Half */}
                            <div className="flex flex-col overflow-hidden">
                                <ProfessionalCodeEditor />
                            </div>

                            {/* AI Analysis Results - Right Half - ALWAYS VISIBLE */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="flex flex-col rounded-2xl border-2 border-green-500 shadow-2xl overflow-hidden bg-card"
                            >
                                {/* Header */}
                                <div className="p-4 border-b border-border bg-green-500/10 flex items-center justify-between flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground">AI Analysis Complete</h3>
                                            <p className="text-xs text-muted-foreground font-medium">Powered by Gemini 2.5 Flash</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentAnalysis(null)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                                        title="Close Analysis"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content - Scrollable */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 bg-muted/30">
                                    {/* Analysis Summary */}
                                    <div className="space-y-2">
                                        <h4 className="text-base font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                                            <MessageSquare className="w-4 h-4 text-blue-500" />
                                            What's Wrong
                                        </h4>
                                        <div className="p-3 rounded-xl bg-card border border-blue-500/30 text-sm text-foreground leading-relaxed shadow-lg">
                                            {currentAnalysis.explanation}
                                        </div>
                                    </div>

                                    {/* Root Cause */}
                                    <div className="space-y-2">
                                        <h4 className="text-base font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                            Root Cause
                                        </h4>
                                        <div className="p-3 rounded-xl bg-card border border-red-500/30 text-sm text-red-500 leading-relaxed shadow-lg font-medium">
                                            {currentAnalysis.rootCause}
                                        </div>
                                    </div>

                                    {/* Solutions */}
                                    <div className="space-y-3">
                                        <h4 className="text-base font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                                            <Lightbulb className="w-4 h-4 text-amber-500" />
                                            Solutions ({currentAnalysis.solutions.length})
                                        </h4>
                                        <div className="grid gap-3">
                                            {currentAnalysis.solutions.map((solution, index) => (
                                                <div key={index} className="rounded-xl border border-border bg-card overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-primary/50">
                                                    <div className="p-3 border-b border-border bg-muted/50 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl font-bold text-primary">#{index + 1}</span>
                                                            <span className="text-base font-bold text-foreground">{solution.title}</span>
                                                        </div>
                                                        <span className={cn(
                                                            "text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide border",
                                                            solution.difficulty === 'easy' ? "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30" :
                                                                solution.difficulty === 'medium' ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30" :
                                                                    "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"
                                                        )}>
                                                            {solution.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="p-4">
                                                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                                                            {solution.description}
                                                        </p>
                                                        {solution.code && (
                                                            <div className="rounded-lg bg-slate-950 dark:bg-slate-950 p-3 border border-border font-mono text-xs text-green-400 overflow-x-auto shadow-inner">
                                                                <pre className="whitespace-pre-wrap">{solution.code}</pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Full Width Error Console when no analysis */
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <ProfessionalCodeEditor />
                        </div>
                    )}
                </div>

                {/* Right Sidebar - AI Chat / War Room - ALWAYS VISIBLE */}
                <div className="col-span-2 flex flex-col h-full overflow-hidden">
                    <div className="h-full rounded-2xl border border-border shadow-xl bg-card overflow-hidden flex flex-col">
                        {/* Tab Switcher with Sliding Background */}
                        <div className="flex border-b border-border relative">
                            <button
                                onClick={() => setRightSidebarTab('chat')}
                                className={cn(
                                    "flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 relative z-10",
                                    rightSidebarTab === 'chat' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <MessageSquare className="w-4 h-4" />
                                AI Chat
                                {rightSidebarTab === 'chat' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 border-b-2 border-primary bg-primary/5"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setRightSidebarTab('war-room')}
                                className={cn(
                                    "flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 relative z-10",
                                    rightSidebarTab === 'war-room' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Users className="w-4 h-4" />
                                War Room
                                {rightSidebarTab === 'war-room' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 border-b-2 border-primary bg-primary/5"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden">
                            {rightSidebarTab === 'chat' ? (
                                <AIChatPanel key={currentAnalysis ? `chat-${currentAnalysis.explanation.substring(0, 20)}` : 'chat-empty'} />
                            ) : (
                                <WarRoomPanel errorId={currentAnalysis ? 'current-error-id' : null} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
