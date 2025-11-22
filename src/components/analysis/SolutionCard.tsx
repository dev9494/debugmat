import { useState, useEffect } from 'react';
import { Check, Copy, Clock, ThumbsUp, ThumbsDown, BarChart, ChevronDown, ChevronUp } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';

import { cn } from '../../lib/utils';

interface SolutionProps {
    solution: {
        rank: 'best' | 'fastest' | 'robust';
        title: string;
        description: string;
        code: string;
        reasoning: string;
        difficulty: 'easy' | 'medium' | 'hard';
        estimatedTime: string;
        steps: string[];
    };
}

export const SolutionCard = ({ solution }: SolutionProps) => {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(solution.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getRankBadge = (rank: string) => {
        switch (rank) {
            case 'best': return { label: '⭐ Best for Stack', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
            case 'fastest': return { label: '⚡ Fastest Fix', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
            case 'robust': return { label: '🛡️ Most Robust', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
            default: return { label: 'Recommended', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
        }
    };

    const badge = getRankBadge(solution.rank);

    // Syntax highlighting
    useEffect(() => {
        Prism.highlightAll();
    }, [solution.code]);

    return (
        <div className="group rounded-xl border border-white/5 bg-[#141414] overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn("px-4 py-1.5 rounded-full text-base font-bold border uppercase tracking-wider", badge.color)}>
                        {badge.label}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {solution.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <BarChart className="w-3.5 h-3.5" />
                            <span className="capitalize text-sm">{solution.difficulty}</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{solution.title}</h3>
                <p className="text-lg text-gray-400 leading-relaxed">{solution.description}</p>
            </div>

            {/* Code Block */}
            <div className="relative bg-[#0a0a0a] group/code">
                <div className="absolute right-4 top-4 opacity-0 group-hover/code:opacity-100 transition-opacity">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors backdrop-blur-sm"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                </div>
                <pre className="p-6 overflow-x-auto font-mono text-sm text-gray-300 leading-relaxed custom-scrollbar">
                    <code className="language-typescript">{solution.code}</code>
                </pre>
            </div>

            {/* Footer / Actions */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-base text-muted-foreground">Did this work?</span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setFeedback('up')}
                                className={cn("p-1.5 rounded-md transition-colors", feedback === 'up' ? "bg-green-500/20 text-green-400" : "hover:bg-white/5 text-muted-foreground")}
                            >
                                <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setFeedback('down')}
                                className={cn("p-1.5 rounded-md transition-colors", feedback === 'down' ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-muted-foreground")}
                            >
                                <ThumbsDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="text-base text-green-400 flex items-center gap-1.5">
                        <Check className="w-3 h-3" />
                        96% success rate
                    </div>
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-white transition-colors"
                >
                    {expanded ? 'Show Less' : 'Show Steps'}
                    {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
            </div>

            {/* Expandable Steps */}
            {expanded && (
                <div className="p-6 border-t border-white/5 bg-white/[0.02] animate-in">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Implementation Steps</h4>
                    <ul className="space-y-3">
                        {solution.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-300">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                                    {i + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
