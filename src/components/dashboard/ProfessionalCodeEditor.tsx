import { useState } from 'react';
import { Play, AlertCircle, Loader2, Sparkles, Package } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useErrorStore } from '../../stores/errorStore';
import { analyzeError } from '../../lib/gemini';
import { useUserStore } from '../../stores/userStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { incrementUsageCount } from '../../lib/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { trackErrorAnalysis } from '../../lib/googleAnalytics';

export const ProfessionalCodeEditor = () => {
    const { currentError, setCurrentError, isAnalyzing, setIsAnalyzing, setCurrentAnalysis, addToHistory } = useErrorStore();
    const { incrementUsage } = useUserStore();
    const { currentUser } = useAuth();

    const placeholderCode = `Paste your error message here...`;

    const { checkLimit } = useSubscriptionStore();

    const handleAnalyze = async () => {
        if (!currentError.trim()) return;

        // Check subscription limits
        if (!checkLimit()) return;

        console.log('🚀 Starting analysis...');
        setIsAnalyzing(true);

        const timeoutId = setTimeout(() => {
            console.error('⏰ Analysis timeout - forcing reset');
            setIsAnalyzing(false);
            setCurrentAnalysis({
                errorType: 'Timeout Error',
                explanation: 'The analysis took too long and was cancelled. Please try again with a shorter error message or check your internet connection.',
                rootCause: 'Request timeout after 30 seconds',
                severity: 'medium',
                solutions: [{
                    title: 'Try Again',
                    description: 'Click the Analyze Error button again to retry.',
                    code: '// Paste a shorter error message if possible',
                    difficulty: 'easy',
                    estimatedTime: '~1 minute',
                    rank: 'best',
                    reasoning: 'The request timed out, so retrying is the best option.',
                    steps: ['Click Reset', 'Paste error again', 'Click Analyze']
                }],
                filesLikelyAffected: [],
            });
        }, 30000);

        try {
            console.log('📡 Calling Gemini API...');
            const analysis = await analyzeError(currentError);
            console.log('✅ Analysis complete:', analysis);

            clearTimeout(timeoutId);
            setCurrentAnalysis(analysis);
            incrementUsage();

            // Track usage in Firestore if user is logged in
            if (currentUser) {
                await incrementUsageCount(currentUser.uid);
            }

            // Track in Google Analytics
            trackErrorAnalysis(analysis.errorType, analysis.severity);

            addToHistory({
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                errorMessage: currentError.slice(0, 100) + '...',
                language: 'typescript',
                analysis,
                status: 'new'
            });
        } catch (error) {
            console.error('❌ Analysis failed:', error);
            clearTimeout(timeoutId);

            setCurrentAnalysis({
                errorType: 'Analysis Error',
                explanation: `Failed to analyze error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and try again.`,
                rootCause: 'API call failed',
                severity: 'medium',
                solutions: [{
                    title: 'Check API Key',
                    description: 'Make sure your VITE_GEMINI_API_KEY is set correctly in the .env file.',
                    code: '// Check .env file:\n// VITE_GEMINI_API_KEY=your_key_here',
                    difficulty: 'easy',
                    estimatedTime: '~2 minutes',
                    rank: 'best',
                    reasoning: 'Without a valid API key, the AI cannot function.',
                    steps: ['Open .env file', 'Check VITE_GEMINI_API_KEY', 'Restart server']
                }],
                filesLikelyAffected: [],
            });
        } finally {
            console.log('🏁 Analysis finished, resetting state');
            setIsAnalyzing(false);
        }
    };

    const displayText = currentError || '';
    const lines = displayText.split('\n');
    const hasError = currentError.trim().length > 0;

    return (
        <div className="flex flex-col h-full bg-slate-950/50">
            {/* Large Code Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
                <div className="flex-1 flex min-h-0">
                    {/* Line Numbers */}
                    <div className="flex-shrink-0 px-3 py-4 text-right select-none bg-slate-900/50 border-r border-slate-800 text-slate-600 w-12">
                        {Array.from({ length: Math.max(20, lines.length) }, (_, i) => (
                            <div key={i} className="leading-6 text-xs font-mono">
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* Editable Textarea */}
                    <div className="flex-1 relative">
                        <textarea
                            value={currentError}
                            onChange={(e) => setCurrentError(e.target.value)}
                            placeholder={placeholderCode}
                            className="w-full h-full p-4 bg-transparent text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none font-mono leading-6 text-sm"
                            spellCheck={false}
                            style={{
                                caretColor: '#60a5fa',
                                tabSize: 4
                            }}
                        />

                        {/* Centered Icon (Empty State) */}
                        {!hasError && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="text-center opacity-50">
                                    <div className="w-24 h-24 mx-auto mb-4 text-slate-700">
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <path d="M20 30 L50 15 L80 30 L80 70 L50 85 L20 70 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                                            <path d="M20 30 L50 45 L80 30" fill="none" stroke="currentColor" strokeWidth="2" />
                                            <path d="M50 45 L50 85" fill="none" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-500 text-sm">Paste error trace or code snippet</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Analyze Button Bar */}
            <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex justify-end">
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !hasError}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all",
                        isAnalyzing || !hasError
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    )}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            <span>Analyze Error</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
