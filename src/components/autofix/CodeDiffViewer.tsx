import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface CodeDiffViewerProps {
    originalCode: string;
    fixedCode: string;
    language?: string;
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ originalCode, fixedCode, language = 'typescript' }) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [originalCode, fixedCode]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-hidden">
            {/* Original */}
            <div className="flex flex-col h-full">
                <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 text-red-400 text-sm font-medium rounded-t-lg">
                    Original (Broken)
                </div>
                <div className="flex-1 bg-[#0f172a] border border-white/10 border-t-0 rounded-b-lg overflow-auto p-4 custom-scrollbar">
                    <pre className="!bg-transparent !m-0 !p-0">
                        <code className={`language-${language}`}>{originalCode}</code>
                    </pre>
                </div>
            </div>

            {/* Fixed */}
            <div className="flex flex-col h-full">
                <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 text-green-400 text-sm font-medium rounded-t-lg flex justify-between items-center">
                    <span>Proposed Fix</span>
                    <span className="text-xs bg-green-500/20 px-2 py-0.5 rounded text-green-300">AI Generated</span>
                </div>
                <div className="flex-1 bg-[#0f172a] border border-white/10 border-t-0 rounded-b-lg overflow-auto p-4 custom-scrollbar relative">
                    <pre className="!bg-transparent !m-0 !p-0">
                        <code className={`language-${language}`}>{fixedCode}</code>
                    </pre>
                    {/* Visual Diff Highlight Overlay (Simplified) */}
                    <div className="absolute inset-0 pointer-events-none bg-green-500/5 mix-blend-overlay" />
                </div>
            </div>
        </div>
    );
};
