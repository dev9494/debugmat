import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FixPreviewModal } from './FixPreviewModal';

interface AutoFixButtonProps {
    errorId: string;
    errorMessage: string;
    codeContext: string;
    filePath: string;
}

export const AutoFixButton = ({ errorId, errorMessage, codeContext, filePath }: AutoFixButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock Data for Demo
    const [fixData, setFixData] = useState<{
        originalCode: string;
        fixedCode: string;
        explanation: string;
        confidence: number;
    } | null>(null);

    const handleGenerateFix = async () => {
        setIsGenerating(true);

        // Simulate AI Generation Delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Mock Response (In real app, fetch from /api/ai/generate-fix)
        setFixData({
            originalCode: codeContext || `function calculateTotal(items) {
  return items.reduce((acc, item) => {
    return acc + item.price;
  }); // Missing initial value causes error on empty array
}`,
            fixedCode: `function calculateTotal(items) {
  if (!items || items.length === 0) return 0;
  
  return items.reduce((acc, item) => {
    return acc + (item.price || 0);
  }, 0); // Added initial value and safety check
}`,
            explanation: "The error occurs because `reduce` is called on an empty array without an initial value, or `items` is undefined. I've added a safety check for the array and provided `0` as the initial value for the accumulator. I also added a fallback for `item.price` to prevent NaN results.",
            confidence: 92
        });

        setIsGenerating(false);
        setIsModalOpen(true);
    };

    return (
        <>
            <button
                onClick={handleGenerateFix}
                disabled={isGenerating}
                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70"
            >
                {isGenerating ? (
                    <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Generating Fix...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Auto-Fix with AI</span>
                    </>
                )}
            </button>

            {fixData && (
                <FixPreviewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    originalCode={fixData.originalCode}
                    fixedCode={fixData.fixedCode}
                    explanation={fixData.explanation}
                    confidence={fixData.confidence}
                    filePath={filePath}
                />
            )}
        </>
    );
};
