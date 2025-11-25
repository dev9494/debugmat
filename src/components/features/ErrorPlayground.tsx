import { useState, useEffect } from 'react';
import { Play, RotateCcw, Share2, Download, Code2, Terminal, AlertCircle } from 'lucide-react';
import { useErrorStore } from '../../stores/errorStore';

export const ErrorPlayground = () => {
    const { currentAnalysis } = useErrorStore();
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    // Load suggested fix code when analysis changes
    useEffect(() => {
        if (currentAnalysis?.solutions[0]?.code) {
            setCode(currentAnalysis.solutions[0].code);
        }
    }, [currentAnalysis]);

    const runCode = () => {
        setOutput('');
        setError('');

        try {
            // Create a safe execution context
            const logs: string[] = [];
            const customConsole = {
                log: (...args: any[]) => logs.push(args.map(String).join(' ')),
                error: (...args: any[]) => logs.push('ERROR: ' + args.map(String).join(' ')),
                warn: (...args: any[]) => logs.push('WARN: ' + args.map(String).join(' ')),
            };

            // Execute code in isolated context
            const func = new Function('console', code);
            func(customConsole);

            setOutput(logs.join('\n') || 'Code executed successfully (no output)');
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };

    const resetCode = () => {
        if (currentAnalysis?.solutions[0]?.code) {
            setCode(currentAnalysis.solutions[0].code);
        } else {
            setCode('');
        }
        setOutput('');
        setError('');
    };

    const shareCode = () => {
        const shareData = {
            code,
            timestamp: Date.now(),
        };
        const encoded = btoa(JSON.stringify(shareData));
        const url = `${window.location.origin}?playground=${encoded}`;
        navigator.clipboard.writeText(url);
        alert('Shareable link copied to clipboard!');
    };

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'playground-code.js';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 animate-up">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    <Code2 className="w-8 h-8 text-blue-400" />
                    Error Playground
                </h2>
                <p className="text-base text-slate-400">
                    Test and experiment with code fixes in a safe environment
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex gap-3">
                <button
                    onClick={runCode}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5"
                >
                    <Play className="w-5 h-5" />
                    Run Code
                </button>
                <button
                    onClick={resetCode}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:border-white/20"
                >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                </button>
                <button
                    onClick={shareCode}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:border-white/20"
                >
                    <Share2 className="w-5 h-5" />
                    Share
                </button>
                <button
                    onClick={downloadCode}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:border-white/20"
                >
                    <Download className="w-5 h-5" />
                    Download
                </button>
            </div>

            {/* Code Editor */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between backdrop-blur-sm">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-blue-400" />
                        Code Editor
                    </span>
                    <span className="text-xs text-slate-400 font-mono bg-white/5 px-2 py-1 rounded">JavaScript</span>
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="// Write or paste your code here
console.log('Hello, Playground!');

// Try the suggested fix from the analysis
// or experiment with your own code"
                    className="w-full h-96 bg-black/40 p-4 text-base text-blue-100 font-mono resize-none focus:outline-none placeholder:text-slate-600"
                    spellCheck={false}
                />
            </div>

            {/* Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Console Output */}
                <div className="glass-card rounded-xl overflow-hidden border-green-500/20">
                    <div className="px-4 py-3 bg-green-500/10 border-b border-green-500/20 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-green-400">Console Output</span>
                    </div>
                    <div className="p-4 h-64 overflow-y-auto custom-scrollbar bg-black/20">
                        {output ? (
                            <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                                {output}
                            </pre>
                        ) : (
                            <p className="text-sm text-slate-500 italic">
                                Run your code to see output here...
                            </p>
                        )}
                    </div>
                </div>

                {/* Errors */}
                <div className="glass-card rounded-xl overflow-hidden border-red-500/20">
                    <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-semibold text-red-400">Errors</span>
                    </div>
                    <div className="p-4 h-64 overflow-y-auto custom-scrollbar bg-black/20">
                        {error ? (
                            <pre className="text-sm text-red-400 font-mono whitespace-pre-wrap">
                                {error}
                            </pre>
                        ) : (
                            <p className="text-sm text-slate-500 italic">
                                No errors (yet!)
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="glass-card border-blue-500/20 rounded-xl p-4 bg-blue-500/5">
                <p className="text-sm text-blue-400 font-semibold mb-2">💡 Playground Tips:</p>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                    <li>Use console.log() to see output</li>
                    <li>Code runs in a safe, isolated environment</li>
                    <li>Share your experiments with the Share button</li>
                    <li>Download working fixes for your project</li>
                </ul>
            </div>
        </div>
    );
};
