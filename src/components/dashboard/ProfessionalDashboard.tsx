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

export const ProfessionalDashboard = () => {
    const { currentAnalysis, setCurrentAnalysis, currentError } = useErrorStore();
    const [rightSidebarTab, setRightSidebarTab] = useState<'chat' | 'war-room'>('chat');

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* Top Stats Cards - Compact */}
            <div className="flex-shrink-0 px-6 pt-4 pb-2">
                <ProfessionalStatsCards />
            </div>

            {/* Main Content - Fixed Height Grid */}
            <div className="flex-1 grid grid-cols-12 gap-5 px-6 pb-6 min-h-0 overflow-hidden">

                {/* Left Sidebar - History - ALWAYS VISIBLE */}
                <div className="col-span-2 flex flex-col h-full overflow-hidden">
                    <div className="h-full rounded-2xl border border-border shadow-xl bg-card overflow-hidden flex flex-col">
                        <RecentActivity />
                    </div>
                </div>

                {/* Center - Error Console + Analysis in Split View */}
                <div className="col-span-8 flex flex-col h-full gap-5 overflow-hidden">

                    {/* Welcome Banner - Only when no error */}
                    <AnimatePresence>
                        {!currentError && !currentAnalysis && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl px-8 py-4 shadow-2xl flex items-center justify-center gap-4 flex-shrink-0"
                            >
                                <span className="text-white font-bold text-xl">
                                    Welcome to DebugMate AI - Paste your error below
                                </span>
                                <ArrowDown className="w-6 h-6 text-white animate-bounce" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Split View: Error Console + Analysis Side by Side when analysis exists */}
                    {currentAnalysis ? (
                        <div className="flex-1 grid grid-cols-2 gap-5 min-h-0 overflow-hidden">
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
                                <div className="p-5 border-b border-border bg-green-500/10 flex items-center justify-between flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-foreground">AI Analysis Complete</h3>
                                            <p className="text-sm text-muted-foreground font-medium">Powered by Gemini 2.5 Flash</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentAnalysis(null)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                                        title="Close Analysis"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content - Scrollable */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-muted/30">
                                    {/* Analysis Summary */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2.5 uppercase tracking-wide">
                                            <MessageSquare className="w-5 h-5 text-blue-500" />
                                            What's Wrong
                                        </h4>
                                        <div className="p-4 rounded-xl bg-card border border-blue-500/30 text-base text-foreground leading-relaxed shadow-lg">
                                            {currentAnalysis.explanation}
                                        </div>
                                    </div>

                                    {/* Root Cause */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2.5 uppercase tracking-wide">
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                            Root Cause
                                        </h4>
                                        <div className="p-4 rounded-xl bg-card border border-red-500/30 text-base text-red-500 leading-relaxed shadow-lg font-medium">
                                            {currentAnalysis.rootCause}
                                        </div>
                                    </div>

                                    {/* Solutions */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-bold text-foreground flex items-center gap-2.5 uppercase tracking-wide">
                                            <Lightbulb className="w-5 h-5 text-amber-500" />
                                            Solutions ({currentAnalysis.solutions.length})
                                        </h4>
                                        <div className="grid gap-4">
                                            {currentAnalysis.solutions.map((solution, index) => (
                                                <div key={index} className="rounded-xl border border-border bg-card overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-primary/50">
                                                    <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                                                            <span className="text-lg font-bold text-foreground">{solution.title}</span>
                                                        </div>
                                                        <span className={cn(
                                                            "text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide border",
                                                            solution.difficulty === 'easy' ? "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30" :
                                                                solution.difficulty === 'medium' ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30" :
                                                                    "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"
                                                        )}>
                                                            {solution.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="p-5">
                                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                                            {solution.description}
                                                        </p>
                                                        {solution.code && (
                                                            <div className="rounded-lg bg-slate-950 dark:bg-slate-950 p-4 border border-border font-mono text-sm text-green-400 overflow-x-auto shadow-inner">
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
                        {/* Tab Switcher */}
                        <div className="flex border-b border-border">
                            <button
                                onClick={() => setRightSidebarTab('chat')}
                                className={cn(
                                    "flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                                    rightSidebarTab === 'chat'
                                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <MessageSquare className="w-4 h-4" />
                                AI Chat
                            </button>
                            <button
                                onClick={() => setRightSidebarTab('war-room')}
                                className={cn(
                                    "flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                                    rightSidebarTab === 'war-room'
                                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Users className="w-4 h-4" />
                                War Room
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
