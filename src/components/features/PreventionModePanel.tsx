import { useState } from 'react';
import { Shield, AlertTriangle, Zap, CheckCircle, XCircle, Wrench, Scan } from 'lucide-react';
import { scanCode, autoFixIssue, type CodeIssue, type PreventionScanResult } from '../../lib/prevention';
import { cn } from '../../lib/utils';

export const PreventionModePanel = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [scanResult, setScanResult] = useState<PreventionScanResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = async () => {
        if (!code.trim()) return;

        setIsScanning(true);
        try {
            const result = await scanCode(code, language);
            setScanResult(result);
        } catch (error) {
            console.error('Scan error:', error);
        } finally {
            setIsScanning(false);
        }
    };

    const handleAutoFix = (issue: CodeIssue) => {
        const fixedCode = autoFixIssue(code, issue);
        setCode(fixedCode);
        // Re-scan after fix
        handleScan();
    };

    const getIssueIcon = (type: CodeIssue['type']) => {
        switch (type) {
            case 'vulnerability':
                return <AlertTriangle className="w-4 h-4 text-red-400" />;
            case 'performance':
                return <Zap className="w-4 h-4 text-yellow-400" />;
            case 'deprecation':
                return <XCircle className="w-4 h-4 text-orange-400" />;
            default:
                return <CheckCircle className="w-4 h-4 text-blue-400" />;
        }
    };

    const getSeverityColor = (severity: CodeIssue['severity']) => {
        switch (severity) {
            case 'critical':
                return 'text-red-400 bg-red-500/10 border-red-500/20 shadow-red-500/5';
            case 'high':
                return 'text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-orange-500/5';
            case 'medium':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/5';
            default:
                return 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5';
        }
    };

    return (
        <div className="space-y-6 animate-up">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    <Shield className="w-8 h-8 text-purple-400" />
                    Error Prevention Mode
                </h2>
                <p className="text-base text-slate-400">
                    Catch bugs before they reach production
                </p>
            </div>

            {/* Code Input */}
            <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-bold text-white flex items-center gap-2">
                        <Scan className="w-5 h-5 text-purple-400" />
                        Paste Your Code
                    </label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    >
                        <option value="javascript" className="bg-[#0f172a]">JavaScript</option>
                        <option value="typescript" className="bg-[#0f172a]">TypeScript</option>
                        <option value="python" className="bg-[#0f172a]">Python</option>
                        <option value="java" className="bg-[#0f172a]">Java</option>
                    </select>
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here for analysis..."
                    className="w-full h-64 bg-black/40 border border-white/10 rounded-lg p-4 text-base text-blue-100 font-mono resize-none focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600"
                    spellCheck={false}
                />
                <button
                    onClick={handleScan}
                    disabled={!code.trim() || isScanning}
                    className="mt-4 w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5"
                >
                    {isScanning ? 'Scanning...' : 'Scan for Issues'}
                </button>
            </div>

            {/* Scan Results */}
            {scanResult && (
                <>
                    {/* Score Card */}
                    <div className="glass-card border-purple-500/20 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-base text-slate-400 mb-2">Code Health Score</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-6xl font-bold text-white drop-shadow-lg">{scanResult.grade}</span>
                                    <span className="text-3xl text-purple-400">{scanResult.score}/100</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-base text-slate-400 mb-2">Issues Found</p>
                                <p className="text-4xl font-bold text-white">{scanResult.totalIssues}</p>
                                {scanResult.criticalIssues > 0 && (
                                    <p className="text-sm text-red-400 mt-1 font-semibold">
                                        {scanResult.criticalIssues} critical
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Issues List */}
                    <div className="space-y-4">
                        {[
                            ...scanResult.vulnerabilities,
                            ...scanResult.deprecations,
                            ...scanResult.performanceIssues,
                            ...scanResult.bestPractices,
                        ].map((issue) => (
                            <div
                                key={issue.id}
                                className={cn(
                                    'border rounded-xl p-5 backdrop-blur-sm shadow-lg transition-all hover:scale-[1.01]',
                                    getSeverityColor(issue.severity)
                                )}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getIssueIcon(issue.type)}
                                            <h3 className="text-lg font-bold text-white">{issue.title}</h3>
                                            <span className="text-xs font-semibold uppercase px-2 py-1 rounded bg-white/10 border border-white/5">
                                                {issue.severity}
                                            </span>
                                        </div>
                                        <p className="text-base text-slate-200 mb-3">{issue.description}</p>
                                        <div className="bg-black/20 rounded-lg p-3 mb-3 border border-white/5">
                                            <p className="text-sm text-slate-400 mb-1 font-semibold">💡 Suggestion:</p>
                                            <p className="text-sm text-white">{issue.suggestion}</p>
                                        </div>
                                        {issue.line && (
                                            <p className="text-sm text-slate-400 font-mono">
                                                Line {issue.line} in {issue.file}
                                            </p>
                                        )}
                                    </div>
                                    {issue.autoFixable && (
                                        <button
                                            onClick={() => handleAutoFix(issue)}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-green-500/20"
                                        >
                                            <Wrench className="w-4 h-4" />
                                            Auto-Fix
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
