import { useState } from 'react';
import { GitPullRequest, Sparkles, ArrowRight, Bug, CheckCircle2, Zap, Shield, Clock } from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { AutoFixButton } from '../autofix/AutoFixButton';

export const AutoFixPanel = () => {
    const { currentAnalysis, currentError } = useErrorStore();
    const [demoMode, setDemoMode] = useState(false);

    // Mock Data for Demo
    const demoError = {
        id: 'demo-error-1',
        message: "TypeError: Cannot read properties of undefined (reading 'map')",
        codeSnippet: `const UserList = ({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};`,
        filePath: "src/components/UserList.jsx"
    };


    const activeError = demoMode ? demoError : (currentAnalysis && currentError ? {
        id: 'current-error',
        message: currentError,
        codeSnippet: currentAnalysis.filesLikelyAffected[0]?.snippet || '',
        filePath: currentAnalysis.filesLikelyAffected[0]?.path || 'unknown.ts'
    } : null);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-3 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                            <GitPullRequest className="w-10 h-10 text-green-400" />
                        </div>
                        Auto-Fix Engine
                    </h2>
                    <p className="text-slate-300 text-xl max-w-3xl leading-relaxed">
                        AI-powered automated code repair. Generates fixes, creates branches, and opens Pull Requests automatically.
                    </p>
                </div>
                {!activeError && !demoMode && (
                    <button
                        onClick={() => setDemoMode(true)}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border border-blue-500/30 rounded-xl font-bold text-white text-lg transition-all flex items-center gap-3 group shadow-lg shadow-blue-500/20"
                    >
                        <Sparkles className="w-6 h-6 text-yellow-300 group-hover:scale-110 transition-transform" />
                        Try Demo Mode
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Context / Status */}
                <div className="lg:col-span-2 space-y-6">
                    {activeError ? (
                        <div className="glass-card p-10 rounded-2xl border-green-500/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-start gap-5 mb-8">
                                    <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 shrink-0">
                                        <Bug className="w-8 h-8 text-red-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-3">Error Detected</h3>
                                        <p className="text-slate-300 font-mono text-base bg-black/40 px-4 py-3 rounded-lg border border-white/10 leading-relaxed">
                                            {activeError.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a]/50 rounded-xl border border-white/10 p-6 mb-8 overflow-hidden">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Target File</span>
                                        <span className="text-base font-mono text-blue-400">{activeError.filePath}</span>
                                    </div>
                                    <pre className="text-base text-slate-200 font-mono overflow-x-auto custom-scrollbar p-4 bg-black/30 rounded-lg leading-relaxed">
                                        {activeError.codeSnippet}
                                    </pre>
                                </div>

                                <div className="flex items-center gap-4">
                                    <AutoFixButton
                                        errorId={activeError.id}
                                        errorMessage={activeError.message}
                                        codeContext={activeError.codeSnippet}
                                        filePath={activeError.filePath}
                                    />
                                    {demoMode && (
                                        <button
                                            onClick={() => setDemoMode(false)}
                                            className="px-6 py-3 text-slate-300 hover:text-white text-base font-semibold transition-colors border border-white/10 rounded-lg hover:bg-white/5"
                                        >
                                            Exit Demo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-16 rounded-2xl border-dashed border-white/10 flex flex-col items-center justify-center text-center min-h-[500px]">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500/10 to-blue-500/10 flex items-center justify-center mb-8 border border-white/10">
                                <GitPullRequest className="w-14 h-14 text-green-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Ready to Auto-Fix</h3>
                            <p className="text-slate-300 text-lg max-w-lg mb-10 leading-relaxed">
                                Select an error from the Dashboard or History to generate an automated fix, or try the demo mode to see the magic in action.
                            </p>
                            <button
                                onClick={() => setDemoMode(true)}
                                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-3 group"
                            >
                                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                Launch Demo
                            </button>
                        </div>
                    )}

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/20">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Instant Fixes</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">Generate solutions in seconds with AI-powered analysis</p>
                        </div>
                        <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20">
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">High Accuracy</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">92% average confidence score on generated fixes</p>
                        </div>
                        <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/20">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                                <Shield className="w-6 h-6 text-purple-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Safe & Tested</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">Every fix includes test cases and validation</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats / Info */}
                <div className="space-y-6">
                    <div className="glass-card p-7 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/10">
                        <h3 className="text-base font-bold text-white uppercase tracking-wider mb-6">How it works</h3>
                        <ul className="space-y-5">
                            {[
                                { title: 'Analyze', desc: 'AI understands the error context and stack trace', icon: '🔍' },
                                { title: 'Generate', desc: 'Creates a precise code fix for your specific stack', icon: '⚡' },
                                { title: 'Verify', desc: 'Shows you a diff preview with confidence score', icon: '✓' },
                                { title: 'Apply', desc: 'Creates a branch and opens a Pull Request', icon: '🚀' }
                            ].map((step, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-sm font-bold border border-blue-500/30">
                                            {i + 1}
                                        </div>
                                        {i < 3 && <div className="w-px h-full bg-white/10 my-2" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-bold text-white mb-1 flex items-center gap-2">
                                            <span>{step.icon}</span>
                                            {step.title}
                                        </p>
                                        <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-card p-7 rounded-xl border-purple-500/10">
                        <h3 className="text-base font-bold text-white uppercase tracking-wider mb-6">Usage Stats</h3>
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-base mb-2">
                                    <span className="text-slate-300 font-medium">Monthly Quota</span>
                                    <span className="text-white font-bold text-lg">2 / 3</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">1 auto-fix remaining this month</p>
                            </div>
                            <div className="pt-5 border-t border-white/10">
                                <button className="w-full py-3 text-sm font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider flex items-center justify-center gap-2 transition-colors bg-purple-500/5 hover:bg-purple-500/10 rounded-lg border border-purple-500/20">
                                    Upgrade to Pro <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-7 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-yellow-500/10">
                        <div className="flex items-start gap-3 mb-4">
                            <Clock className="w-6 h-6 text-yellow-400 shrink-0" />
                            <div>
                                <h4 className="text-base font-bold text-white mb-2">Recent Activity</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">Last fix generated 2 hours ago</p>
                            </div>
                        </div>
                        <div className="space-y-3 mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Success Rate</span>
                                <span className="text-green-400 font-bold">94%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Avg. Fix Time</span>
                                <span className="text-blue-400 font-bold">2.3s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
