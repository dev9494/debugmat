import type { ErrorAnalysis } from '../stores/errorStore';

interface FixPRRequest {
    errorAnalysis: ErrorAnalysis;
    errorMessage: string;
    repository: string;
    branch?: string;
}

interface GeneratedFix {
    filePath: string;
    originalCode: string;
    fixedCode: string;
    explanation: string;
    testCode?: string;
}

interface PRResponse {
    success: boolean;
    prUrl?: string;
    prNumber?: number;
    error?: string;
}

// Generate code fix using AI
export const generateCodeFix = async (
    errorAnalysis: ErrorAnalysis,
    errorMessage: string
): Promise<GeneratedFix | null> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        console.error('Gemini API key not found');
        return null;
    }

    const affectedFile = errorAnalysis.filesLikelyAffected[0];
    if (!affectedFile) {
        return null;
    }

    const prompt = `You are an expert developer. Generate a code fix for this error.

Error Type: ${errorAnalysis.errorType}
Error Message: ${errorMessage}
Root Cause: ${errorAnalysis.rootCause}
File: ${affectedFile.path}
Line: ${affectedFile.lineNumber}
Current Code:
\`\`\`
${affectedFile.snippet}
\`\`\`

Provide:
1. The EXACT fixed code (complete, ready to use)
2. A clear explanation of what was fixed
3. A simple test case (if applicable)

Format your response as JSON:
{
    "fixedCode": "the complete fixed code",
    "explanation": "what was changed and why",
    "testCode": "optional test code"
}`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.3,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Try to parse JSON from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                filePath: affectedFile.path,
                originalCode: affectedFile.snippet,
                fixedCode: parsed.fixedCode,
                explanation: parsed.explanation,
                testCode: parsed.testCode,
            };
        }

        // Fallback: extract code blocks
        const codeMatch = aiResponse.match(/```[\w]*\n([\s\S]*?)```/);
        return {
            filePath: affectedFile.path,
            originalCode: affectedFile.snippet,
            fixedCode: codeMatch ? codeMatch[1] : aiResponse,
            explanation: 'AI-generated fix',
        };
    } catch (error) {
        console.error('Error generating fix:', error);
        return null;
    }
};

// Create GitHub Pull Request
export const createFixPR = async (
    fix: GeneratedFix,
    request: FixPRRequest
): Promise<PRResponse> => {
    const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

    if (!githubToken) {
        return {
            success: false,
            error: 'GitHub token not configured. Add VITE_GITHUB_TOKEN to your .env file.',
        };
    }

    try {
        // This is a simplified version - in production, you'd use Octokit
        // For now, we'll return a mock success response

        // In a real implementation, you would:
        // 1. Fork the repository (if needed)
        // 2. Create a new branch
        // 3. Commit the fix
        // 4. Create a pull request

        return {
            success: true,
            prUrl: `https://github.com/${request.repository}/pull/123`,
            prNumber: 123,
        };
    } catch (error) {
        console.error('Error creating PR:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

// Generate PR description
export const generatePRDescription = (
    errorAnalysis: ErrorAnalysis,
    fix: GeneratedFix
): string => {
    return `## 🤖 Automated Fix

### Error Fixed
**Type**: ${errorAnalysis.errorType}  
**Severity**: ${errorAnalysis.severity.toUpperCase()}  
**Root Cause**: ${errorAnalysis.rootCause}

### Changes Made
${fix.explanation}

### File Modified
- \`${fix.filePath}\` (Line ${errorAnalysis.filesLikelyAffected[0]?.lineNumber || 'N/A'})

### Code Changes

**Before:**
\`\`\`
${fix.originalCode}
\`\`\`

**After:**
\`\`\`
${fix.fixedCode}
\`\`\`

${fix.testCode ? `### Test Case\n\`\`\`\n${fix.testCode}\n\`\`\`\n` : ''}

---
*This PR was automatically generated by DebugMate AI* 🚀`;
};
