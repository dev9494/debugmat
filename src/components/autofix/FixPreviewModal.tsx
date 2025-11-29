import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitPullRequest, CheckCircle, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { CodeDiffViewer } from './CodeDiffViewer';

interface FixPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalCode: string;
    fixedCode: string;
    explanation: string;
    confidence: number;
    filePath: string;
}

export const FixPreviewModal = ({ isOpen, onClose, originalCode, fixedCode, explanation, confidence, filePath }: FixPreviewModalProps) => {
    const [status, setStatus] = useState<'idle' | 'applying' | 'success' | 'error'>('idle');
    const [prUrl, setPrUrl] = useState<string | null>(null);

    const handleApplyFix = async () => {
        setStatus('applying');

        // Simulate API Call to Backend
        try {
            // In real app: await fetch('/api/github/apply-fix', ...)
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStatus('success');
            setPrUrl('https://github.com/debugmate/demo/pull/42');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-[#1e293b] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-white/10 flex flex-col pointer-events-auto overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0f172a]/50">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <GitPullRequest className="w-5 h-5 text-blue-400" />
                                        Auto-Fix Preview
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">Reviewing changes for <span className="font-mono text-blue-300">{filePath}</span></p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                                        <span className="text-xs text-blue-300 font-medium">Confidence Score</span>
                                        <span className="text-sm font-bold text-blue-400">{confidence}%</span>
                                    </div>
                                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                                {/* Left: Explanation */}
                                <div className="w-full lg:w-1/3 p-6 border-r border-white/10 overflow-y-auto custom-scrollbar bg-[#0f172a]/30">
                                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">AI Analysis</h3>
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <p className="text-slate-300 leading-relaxed">{explanation}</p>
                                    </div>

                                    <div className="mt-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-bold text-yellow-400">Review Carefully</h4>
                                                <p className="text-xs text-yellow-200/70 mt-1">
                                                    Always review AI-generated code before applying. This will create a new branch and Pull Request.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Diff Viewer */}
                                <div className="w-full lg:w-2/3 p-6 bg-[#0f172a]/50">
                                    <CodeDiffViewer originalCode={originalCode} fixedCode={fixedCode} />
                                </div>
                            </div>

                            {/* Footer / Actions */}
                            <div className="p-6 border-t border-white/10 bg-[#0f172a]/50 flex justify-end gap-4">
                                {status === 'success' ? (
                                    <div className="flex items-center gap-4 w-full justify-between animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex items-center gap-2 text-green-400">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="font-medium">Pull Request Created Successfully!</span>
                                        </div>
                                        <a
                                            href={prUrl!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                                        >
                                            View Pull Request <ArrowRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleApplyFix}
                                            disabled={status === 'applying'}
                                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {status === 'applying' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Creating PR...
                                                </>
                                            ) : (
                                                <>
                                                    <GitPullRequest className="w-4 h-4" />
                                                    Create Pull Request
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
