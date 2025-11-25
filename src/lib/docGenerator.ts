import type { ErrorAnalysis } from '../stores/errorStore';

export interface GeneratedDoc {
    title: string;
    content: string;
    format: 'markdown' | 'html' | 'text';
    sections: {
        overview: string;
        problem: string;
        solution: string;
        codeExample: string;
        relatedIssues: string;
    };
}

// Generate documentation from error analysis
export const generateDocumentation = async (
    errorAnalysis: ErrorAnalysis,
    errorMessage: string
): Promise<GeneratedDoc> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        return createFallbackDoc(errorAnalysis, errorMessage);
    }

    const prompt = `Generate comprehensive documentation for this error fix.

Error Type: ${errorAnalysis.errorType}
Error Message: ${errorMessage}
Root Cause: ${errorAnalysis.rootCause}
Severity: ${errorAnalysis.severity}

Create a well-structured documentation page with:
1. Overview - Brief description of the error
2. Problem - Detailed explanation of what went wrong
3. Solution - Step-by-step fix instructions
4. Code Example - Before/after code samples
5. Related Issues - Common related problems

Format as Markdown. Be clear, concise, and helpful.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        );

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;

        return parseGeneratedDoc(content, errorAnalysis);
    } catch (error) {
        console.error('Doc generation error:', error);
        return createFallbackDoc(errorAnalysis, errorMessage);
    }
};

// Parse AI response into structured doc
const parseGeneratedDoc = (content: string, errorAnalysis: ErrorAnalysis): GeneratedDoc => {
    const sections = {
        overview: extractSection(content, 'Overview') || `Error: ${errorAnalysis.errorType}`,
        problem: extractSection(content, 'Problem') || errorAnalysis.rootCause,
        solution: extractSection(content, 'Solution') || errorAnalysis.solutions[0]?.description || '',
        codeExample: extractSection(content, 'Code Example') || errorAnalysis.solutions[0]?.code || '',
        relatedIssues: extractSection(content, 'Related Issues') || 'No related issues found.',
    };

    return {
        title: `${errorAnalysis.errorType} - Troubleshooting Guide`,
        content,
        format: 'markdown',
        sections,
    };
};

// Extract section from markdown
const extractSection = (content: string, sectionName: string): string => {
    const regex = new RegExp(`##\\s*${sectionName}[\\s\\S]*?(?=##|$)`, 'i');
    const match = content.match(regex);
    return match ? match[0].replace(/##\s*\w+\s*/, '').trim() : '';
};

// Fallback documentation
const createFallbackDoc = (errorAnalysis: ErrorAnalysis, errorMessage: string): GeneratedDoc => {
    const content = `# ${errorAnalysis.errorType} - Troubleshooting Guide

## Overview
${errorMessage}

## Problem
${errorAnalysis.rootCause}

## Solution
${errorAnalysis.solutions[0]?.description || 'No solution available'}

## Code Example
\`\`\`javascript
${errorAnalysis.solutions[0]?.code || '// No code example available'}
\`\`\`

## Related Issues
Check the error history for similar issues.
`;

    return {
        title: `${errorAnalysis.errorType} - Troubleshooting Guide`,
        content,
        format: 'markdown',
        sections: {
            overview: errorMessage,
            problem: errorAnalysis.rootCause,
            solution: errorAnalysis.solutions[0]?.description || '',
            codeExample: errorAnalysis.solutions[0]?.code || '',
            relatedIssues: 'Check the error history for similar issues.',
        },
    };
};
