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
        <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-600">
                <div className="p-2 rounded-lg bg-blue-500/20">
                    <AlertCircle className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-white font-bold text-xl">Error Console</h2>
            </div>

            {/* Large Code Area */}
            <div className="flex-1 bg-gradient-to-br from-slate-900 to-black relative overflow-hidden">
                <div className="flex h-full">
                    {/* Line Numbers */}
                    <div className="flex-shrink-0 px-4 py-5 text-right select-none bg-slate-950/50 border-r border-slate-700 text-slate-500 w-16">
                        {Array.from({ length: Math.max(15, lines.length) }, (_, i) => (
                            <div key={i} className="leading-7 text-sm font-mono">
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
                            className="w-full h-full p-6 bg-transparent text-slate-100 placeholder:text-slate-600 resize-none focus:outline-none font-mono leading-7 text-lg"
                            spellCheck={false}
                            style={{
                                caretColor: '#60a5fa',
                                tabSize: 4
                            }}
                        />

                        {/* Large Centered Icon */}
                        {!hasError && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="text-center">
                                    {/* Large Package/Box Icon */}
                                    <div className="relative w-40 h-40 mx-auto mb-6">
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            {/* Box outline */}
                                            <path
                                                d="M20 30 L50 15 L80 30 L80 70 L50 85 L20 70 Z"
                                                fill="none"
                                                stroke="#3b82f6"
                                                strokeWidth="2.5"
                                                opacity="0.7"
                                            />
                                            {/* Box top */}
                                            <path
                                                d="M20 30 L50 45 L80 30"
                                                fill="none"
                                                stroke="#3b82f6"
                                                strokeWidth="2.5"
                                                opacity="0.7"
                                            />
                                            {/* Box middle line */}
                                            <path
                                                d="M50 45 L50 85"
                                                fill="none"
                                                stroke="#3b82f6"
                                                strokeWidth="2.5"
                                                opacity="0.7"
                                            />
                                            {/* Sparkles */}
                                            <circle cx="30" cy="25" r="2.5" fill="#60a5fa" opacity="0.9">
                                                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="70" cy="35" r="2.5" fill="#60a5fa" opacity="0.9">
                                                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="45" cy="20" r="2" fill="#60a5fa" opacity="0.9">
                                                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.5s" repeatCount="indefinite" />
                                            </circle>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Large Analyze Button */}
            <div className="p-5 bg-slate-800 border-t border-slate-700">
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !hasError}
                    className={cn(
                        "w-full flex items-center justify-center gap-4 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all relative overflow-hidden group",
                        isAnalyzing || !hasError
                            ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white hover:from-blue-500 hover:via-purple-500 hover:to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-purple-500/40 hover:shadow-purple-500/60"
                    )}
                >
                    {/* Animated shimmer effect */}
                    {!isAnalyzing && hasError && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    )}

                    <div className="relative flex items-center gap-4">
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-7 h-7 animate-spin" />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <span>Analyze Error</span>
                                <Sparkles className="w-7 h-7" />
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};
