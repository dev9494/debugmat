import { useState } from 'react';
import { GitPullRequest, Sparkles, Check, X, Loader2, Code2, FileCode } from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';
import { generateCodeFix, generatePRDescription, type GeneratedFix } from '../../lib/autoFix';
import { cn } from '../../lib/utils';

export const AutoFixPanel = () => {
    const { currentAnalysis, currentError } = useErrorStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedFix, setGeneratedFix] = useState<GeneratedFix | null>(null);
    const [showDiff, setShowDiff] = useState(false);

    const handleGenerateFix = async () => {
        if (!currentAnalysis || !currentError) return;

        setIsGenerating(true);
        try {
            const fix = await generateCodeFix(currentAnalysis, currentError);
            setGeneratedFix(fix);
            setShowDiff(true);
        } catch (error) {
            console.error('Error generating fix:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyFix = () => {
        if (!generatedFix) return;
        navigator.clipboard.writeText(generatedFix.fixedCode);
    };

    const handleDownloadPR = () => {
        if (!generatedFix || !currentAnalysis) return;

        const prDescription = generatePRDescription(currentAnalysis, generatedFix);
        const blob = new Blob([prDescription], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pull-request.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!currentAnalysis) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 animate-pulse">
                    <GitPullRequest className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Error Analyzed</h3>
                <p className="text-base text-slate-400 max-w-sm">
                    Analyze an error first, then I'll generate an automated fix for you.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-up">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    <GitPullRequest className="w-8 h-8 text-green-400" />
                    Automated Fix
                </h2>
                <p className="text-base text-slate-400">
                    AI-generated code fix ready to apply
                </p>
            </div>

            {/* Generate Fix Button */}
            {!generatedFix && (
                <div className="glass-card p-8 text-center rounded-xl border-green-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                            <Sparkles className="w-8 h-8 text-green-400 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Generate Automated Fix</h3>
                        <p className="text-base text-slate-400 mb-6 max-w-md mx-auto">
                            Let AI analyze the error and generate a complete code fix with explanation and tests.
                        </p>
                        <button
                            onClick={handleGenerateFix}
                            disabled={isGenerating}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto group"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Fix...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                                    Generate Fix
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Generated Fix */}
            {generatedFix && (
                <div className="space-y-4">
                    {/* Fix Info */}
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                                    <Check className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Fix Generated!</h3>
                                    <p className="text-sm text-slate-400">
                                        File: <span className="text-slate-300 font-mono">{generatedFix.filePath}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setGeneratedFix(null)}
                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Explanation */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
                            <p className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wider">What was fixed:</p>
                            <p className="text-base text-slate-200">{generatedFix.explanation}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDiff(!showDiff)}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                            >
                                <Code2 className="w-5 h-5" />
                                {showDiff ? 'Hide' : 'Show'} Code Diff
                            </button>
                            <button
                                onClick={handleCopyFix}
                                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                            >
                                <FileCode className="w-5 h-5" />
                                Copy Fix
                            </button>
                            <button
                                onClick={handleDownloadPR}
                                className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                            >
                                <GitPullRequest className="w-5 h-5" />
                                Download PR
                            </button>
                        </div>
                    </div>

                    {/* Code Diff */}
                    {showDiff && (
                        <div className="glass-card rounded-xl overflow-hidden border-white/10">
                            {/* Before */}
                            <div className="border-b border-white/10">
                                <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 backdrop-blur-sm">
                                    <p className="text-sm font-semibold text-red-400 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500" />
                                        Before (Original Code)
                                    </p>
                                </div>
                                <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto bg-black/40">
                                    {generatedFix.originalCode}
                                </pre>
                            </div>

                            {/* After */}
                            <div>
                                <div className="px-4 py-2 bg-green-500/10 border-b border-green-500/20 backdrop-blur-sm">
                                    <p className="text-sm font-semibold text-green-400 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        After (Fixed Code)
                                    </p>
                                </div>
                                <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto bg-black/40">
                                    {generatedFix.fixedCode}
                                </pre>
                            </div>

                            {/* Test Code */}
                            {generatedFix.testCode && (
                                <div className="border-t border-white/10">
                                    <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20 backdrop-blur-sm">
                                        <p className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                                            Test Case
                                        </p>
                                    </div>
                                    <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto bg-black/40">
                                        {generatedFix.testCode}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pro Tip */}
                    <div className="glass-card border-purple-500/20 rounded-xl p-4 bg-purple-500/5">
                        <p className="text-sm text-purple-400 font-semibold mb-1 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Pro Tip:
                        </p>
                        <p className="text-sm text-slate-300">
                            Review the generated fix carefully before applying. AI-generated code should always be tested!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
