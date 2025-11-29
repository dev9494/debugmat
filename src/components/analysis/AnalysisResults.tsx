import { AlertTriangle, CheckCircle, Info, FileCode, ArrowRight } from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { SolutionCard } from './SolutionCard';
import { CopyErrorButton } from '../features/CopyErrorButton';
import { SeverityBadge } from '../features/SeverityBadge';
import { DocGeneratorPanel } from '../features/DocGeneratorPanel';
import { cn } from '../../lib/utils';

export const AnalysisResults = () => {
    const { currentAnalysis, isAnalyzing, currentError } = useErrorStore();

    if (isAnalyzing) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-white/5 rounded-md w-1/3" />
                <div className="h-32 bg-white/5 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-64 bg-white/5 rounded-xl" />
                    <div className="h-64 bg-white/5 rounded-xl" />
                    <div className="h-64 bg-white/5 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!currentAnalysis) return null;

    return (
        <div className="space-y-8 animate-up">
            {/* Header Section */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg backdrop-blur-sm border",
                        currentAnalysis.severity === 'critical' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                            currentAnalysis.severity === 'high' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">{currentAnalysis.errorType}</h2>
                        <p className="text-xl text-slate-300 mt-1">{currentAnalysis.rootCause}</p>
                    </div>
                </div>
                <CopyErrorButton
                    errorMessage={currentError}
                    errorType={currentAnalysis.errorType}
                    rootCause={currentAnalysis.rootCause}
                    severity={currentAnalysis.severity}
                    filePath={currentAnalysis.filesLikelyAffected[0]?.path}
                    lineNumber={currentAnalysis.filesLikelyAffected[0]?.lineNumber}
                    codeSnippet={currentAnalysis.filesLikelyAffected[0]?.snippet}
                    solutions={currentAnalysis.solutions}
                />
            </div>

            {/* Severity & Business Impact */}
            <SeverityBadge severity={currentAnalysis.severity} showDetails={true} />

            {/* Found in Code Section */}
            {currentAnalysis.filesLikelyAffected.length > 0 && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden backdrop-blur-sm shadow-lg shadow-red-500/5">
                    <div className="px-4 py-3 border-b border-red-500/10 flex items-center justify-between bg-red-500/5">
                        <div className="flex items-center gap-2 text-red-400">
                            <FileCode className="w-5 h-5" />
                            <span className="text-lg font-semibold">FOUND IN YOUR CODE</span>
                        </div>
                        <span className="text-xs text-red-400/70 font-mono">{currentAnalysis.filesLikelyAffected[0].path}</span>
                    </div>
                    <div className="p-4 font-mono text-sm text-slate-300 bg-black/40">
                        <div className="flex gap-4">
                            <div className="flex flex-col text-right text-slate-600 select-none">
                                <span>45</span>
                                <span>46</span>
                                <span className="text-red-400 font-bold">47</span>
                                <span>48</span>
                                <span>49</span>
                            </div>
                            <div className="flex-1">
                                <div className="opacity-50">  return (</div>
                                <div className="opacity-50">    &lt;div&gt;</div>
                                <div className="bg-red-500/10 -mx-4 px-4 text-red-200 border-l-2 border-red-500">      {'{'}users.map(user =&gt; ({')'}</div>
                                <div className="opacity-50">        &lt;UserCard key={'{'}user.id{'}'} ...user /&gt;</div>
                                <div className="opacity-50">      {'))}'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-red-500/5 border-t border-red-500/10 text-right">
                        <button className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center justify-end gap-1 ml-auto group">
                            View on GitHub <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {/* Explanation */}
            <div className="glass-card rounded-xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 text-amber-400">
                        <Info className="w-6 h-6" />
                        <h3 className="font-bold text-xl uppercase tracking-wider">What This Means</h3>
                    </div>
                    <p className="text-lg text-slate-200 leading-relaxed">
                        {currentAnalysis.explanation}
                    </p>
                </div>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h3 className="font-bold text-2xl text-white">Recommended Solutions</h3>
                </div>

                <div className="grid gap-6">
                    {currentAnalysis.solutions.map((solution, index) => (
                        <SolutionCard key={index} solution={solution} />
                    ))}
                </div>
            </div>

            {/* Documentation Generator */}
            <DocGeneratorPanel
                errorAnalysis={currentAnalysis}
                errorMessage={currentError || "Unknown Error"}
            />
        </div>
    );
};
