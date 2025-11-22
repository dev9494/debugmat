import { useState } from 'react';
import { Code2, Sparkles, Paperclip, Search, ChevronDown, FileCode, Zap } from 'lucide-react';
import { useRepoStore } from '../../stores/repoStore';
import { useErrorStore } from '../../stores/errorStore';
import { useUserStore } from '../../stores/userStore';
import { analyzeErrorWithGemini } from '../../lib/gemini';
import { cn } from '../../lib/utils';

export const ErrorInput = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [codeContext, setCodeContext] = useState('');
    const [language, setLanguage] = useState('TypeScript');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const { fileTree, techStack } = useRepoStore();
    const { setIsAnalyzing, setCurrentAnalysis, addToHistory, setCurrentError, isAnalyzing } = useErrorStore();
    const { incrementUsage, usageCount, usageLimit } = useUserStore();

    const handleAnalyze = async () => {
        if (!errorMsg.trim()) return;

        if (usageCount >= usageLimit) {
            alert("You've reached your monthly limit. Upgrade to Pro for unlimited analyses.");
            return;
        }

        setIsAnalyzing(true);
        setCurrentError(errorMsg);

        try {
            const analysis = await analyzeErrorWithGemini(
                errorMsg,
                language,
                techStack.length > 0 ? techStack : ['React', 'TypeScript', 'Next.js'],
                fileTree,
                codeContext
            );

            setCurrentAnalysis(analysis);
            addToHistory({
                id: Date.now().toString(),
                timestamp: Date.now(),
                errorMessage: errorMsg,
                language,
                analysis
            });
            incrementUsage();
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const languages = [
        { name: 'TypeScript', icon: 'TS' },
        { name: 'JavaScript', icon: 'JS' },
        { name: 'Python', icon: 'PY' },
        { name: 'Java', icon: 'JV' },
        { name: 'Go', icon: 'GO' },
    ];

    return (
        <div className="space-y-6 animate-in">
            <div className={cn(
                "relative rounded-xl border-2 transition-all duration-300 overflow-hidden bg-[#0f0f0f]",
                isFocused ? "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "border-white/5 hover:border-white/10"
            )}>
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileCode className="w-5 w-5" />
                        <span className="text-xl font-medium">Paste Error Message</span>
                    </div>

                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 border border-white/5 text-base font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            {language}
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>

                        {/* Dropdown would go here - simplified for demo */}
                        <div className="absolute right-0 top-full mt-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            {languages.map(lang => (
                                <button
                                    key={lang.name}
                                    onClick={() => setLanguage(lang.name)}
                                    className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-white hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg"
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Editor Body */}
                <div className="relative flex min-h-[200px]">
                    {/* Line Numbers */}
                    <div className="hidden sm:flex flex-col items-end px-3 py-4 bg-[#141414] border-r border-white/5 text-xs font-mono text-muted-foreground/30 select-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="h-6 leading-6">{n}</div>
                        ))}
                    </div>

                    {/* Text Area */}
                    <textarea
                        value={errorMsg}
                        onChange={(e) => setErrorMsg(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="TypeError: Cannot read property 'map' of undefined&#10;    at UserList.render (UserList.tsx:47:23)&#10;    at finishClassComponent..."
                        className="flex-1 bg-transparent border-0 p-4 font-mono text-base leading-7 text-gray-200 placeholder:text-muted-foreground/30 focus:ring-0 resize-y min-h-[200px] focus:outline-none"
                        spellCheck={false}
                    />
                </div>

                {/* Editor Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-[#1a1a1a]">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                isExpanded ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Code2 className="w-4 h-4" />
                            <span className="text-base">Add Context</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-base font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
                            <Paperclip className="w-4 h-4" />
                            <span className="text-base">Attach File</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-base font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
                            <Search className="w-4 h-4" />
                            <span className="text-base">Auto-detect</span>
                        </button>
                    </div>
                    <span className="text-base text-muted-foreground font-mono">
                        {errorMsg.length} chars
                    </span>
                </div>

                {/* Context Area */}
                {isExpanded && (
                    <div className="border-t border-white/5 bg-[#141414] p-4 animate-in">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Relevant Code Snippet
                        </label>
                        <textarea
                            value={codeContext}
                            onChange={(e) => setCodeContext(e.target.value)}
                            placeholder="// Paste the code where the error occurred..."
                            className="w-full h-32 bg-black/20 border border-white/5 rounded-lg p-3 font-mono text-sm text-gray-200 focus:outline-none focus:border-blue-500/30 transition-colors resize-none"
                        />
                    </div>
                )}\n            </div>

            {/* Analyze Button */}
            <button
                onClick={handleAnalyze}
                disabled={!errorMsg.trim() || isAnalyzing}
                className="group relative w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                <div className="relative flex items-center justify-center gap-3 text-white font-semibold text-lg">
                    {isAnalyzing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Analyzing Error...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <span>Analyze Error with AI</span>
                        </>
                    )}
                </div>
            </button>

            {/* Loading State Overlay */}
            {isAnalyzing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in">
                    <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                        <div className="relative w-16 h-16 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
                            <Zap className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Error...</h3>
                        <div className="space-y-3">
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-3/4 animate-[shimmer_2s_infinite_linear]" />
                            </div>
                            <p className="text-sm text-muted-foreground animate-pulse">
                                Searching your codebase for context...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
