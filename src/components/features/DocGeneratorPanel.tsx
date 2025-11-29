import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Copy, Check, Book, Loader2, FileCode, Share2 } from 'lucide-react';
import { generateDocumentation, type GeneratedDoc } from '../../lib/docGenerator';
import type { ErrorAnalysis } from '../../stores/errorStore';
import { cn } from '../../lib/utils';

interface DocGeneratorPanelProps {
    errorAnalysis: ErrorAnalysis;
    errorMessage: string;
}

export const DocGeneratorPanel = ({ errorAnalysis, errorMessage }: DocGeneratorPanelProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [doc, setDoc] = useState<GeneratedDoc | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const generatedDoc = await generateDocumentation(errorAnalysis, errorMessage);
            setDoc(generatedDoc);
        } catch (error) {
            console.error("Failed to generate doc:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!doc) return;
        navigator.clipboard.writeText(doc.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!doc) return;
        const blob = new Blob([doc.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title.replace(/\s+/g, '_').toLowerCase()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">AI Documentation Generator</h3>
                </div>
                {doc && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            title="Copy Markdown"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            title="Download .md"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6">
                {!doc ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="text-lg font-medium text-foreground mb-2">Generate Troubleshooting Guide</h4>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Create comprehensive documentation for this error, including root cause analysis, solution steps, and code examples.
                        </p>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating Docs...
                                </>
                            ) : (
                                <>
                                    <Book className="w-4 h-4" />
                                    Generate Documentation
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-background border border-border rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Overview</h4>
                                <p className="text-sm text-foreground leading-relaxed">{doc.sections.overview}</p>
                            </div>
                            <div className="p-4 bg-background border border-border rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Root Cause</h4>
                                <p className="text-sm text-foreground leading-relaxed">{doc.sections.problem}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-background border border-border rounded-lg">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Solution</h4>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{doc.sections.solution}</p>
                        </div>

                        {doc.sections.codeExample && (
                            <div className="relative group">
                                <div className="absolute top-2 right-2 px-2 py-1 bg-muted text-xs font-mono rounded text-muted-foreground">
                                    Code Example
                                </div>
                                <pre className="p-4 bg-slate-950 text-slate-50 rounded-lg overflow-x-auto font-mono text-sm border border-slate-800">
                                    <code>{doc.sections.codeExample}</code>
                                </pre>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <span className="text-xs text-muted-foreground">Generated by DebugMate AI</span>
                            <div className="flex gap-2">
                                <button className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <Share2 className="w-3 h-3" /> Share to Wiki
                                </button>
                                <button className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <FileCode className="w-3 h-3" /> Create Gist
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
