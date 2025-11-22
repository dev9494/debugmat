import type { ErrorAnalysis } from '../stores/errorStore';
import { detectSeverity } from './severityDetection';

export const analyzeErrorWithGemini = async (
    errorMessage: string,
    language: string,
    techStack: string[],
    fileTree: any,
    codeContext?: string
): Promise<ErrorAnalysis> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('DebugMate: API Key present?', !!apiKey);
    if (apiKey) console.log('DebugMate: API Key length:', apiKey.length);

    if (!apiKey) {
        console.warn('VITE_GEMINI_API_KEY is missing');
        // Return mock data if no API key (for dev/demo)
        return mockAnalysis;
    }

    // Auto-detect severity
    const severityAnalysis = detectSeverity(errorMessage, '', '');

    // Prepare the context
    const contextData = {
        tech_stack: techStack.join(', '),
        language: language,
        file_tree_summary: JSON.stringify(fileTree, null, 2).substring(0, 2000), // Limit size
        related_files: extractRelevantFiles(fileTree, language),
        code_context: codeContext || 'No additional context provided',
        error_message: errorMessage
    };

    // Build the prompt
    const prompt = `You are DebugMate AI, an expert debugging assistant specializing in codebase-aware error analysis.

Context provided:
- User's detected tech stack: ${contextData.tech_stack}
- Programming language: ${contextData.language}
- Repository structure: ${contextData.file_tree_summary}
- Files that might be related: ${JSON.stringify(contextData.related_files)}
- Code snippet context: ${contextData.code_context}

User's error message:
${contextData.error_message}

Your task:
1. Analyze this error in the context of their specific tech stack and codebase
2. Search the provided file structure for files where this error likely exists
3. Provide 3 solutions ranked by: Best for their stack, Fastest, Most robust
4. Generate a specific ESLint rule to prevent this error
5. Suggest similar patterns to scan for in their codebase

Respond in this EXACT JSON format (no markdown, no code blocks, just pure JSON):
{
  "severity": "critical" | "warning" | "info",
  "errorType": "string (e.g., TypeError, NullPointerException)",
  "explanation": "2-3 paragraph plain English explanation",
  "rootCause": "Why this happened",
  "stackAnalysis": "Analysis specific to their tech stack: ${contextData.tech_stack}",
  "filesLikelyAffected": [
    {
      "path": "string (file path from their repo)",
      "confidence": "high" | "medium" | "low",
      "reasoning": "why this file might have the error"
    }
  ],
  "solutions": [
    {
      "rank": "best" | "fastest" | "robust",
      "title": "string",
      "description": "2-3 sentences",
      "code": "string (actual fix code with comments)",
      "reasoning": "why this solution is ranked this way for their stack",
      "difficulty": "easy" | "medium" | "hard",
      "estimatedTime": "string (e.g., '~5 minutes')",
      "steps": ["step 1", "step 2", "step 3"]
    }
  ],
  "prevention": {
    "advice": "How to prevent this in the future",
    "eslintRule": "string (actual ESLint rule code with configuration)",
    "typeScriptType": "string (TS type definition if applicable)",
    "scanPattern": "regex pattern to find similar issues"
  },
  "relatedResources": [
    {
      "title": "string",
      "url": "string",
      "type": "docs" | "stackoverflow" | "github"
    }
  ],
  "commonInStack": "Is this error common in ${contextData.tech_stack}? Why?"
}

IMPORTANT: Return ONLY valid JSON. No markdown code blocks, no extra text, just the JSON object.
Be specific to their codebase. Reference their actual file structure. Make solutions actionable with their exact tech stack.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 4096,
                        responseMimeType: "application/json"
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_NONE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_NONE"
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error Details:', errorData);
            throw new Error(errorData.error?.message || `Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Extract the text from Gemini's response structure
        const generatedText = data.candidates[0].content.parts[0].text;

        // Clean up the response (remove markdown code blocks if present)
        let cleanedText = generatedText.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        // Parse the JSON response
        const analysis = JSON.parse(cleanedText);

        // Validate required fields
        if (!analysis.severity || !analysis.explanation || !analysis.solutions) {
            throw new Error('Invalid response structure from Gemini');
        }

        // Override severity with our auto-detected one (more accurate)
        analysis.severity = severityAnalysis.severity;

        return analysis;

    } catch (error) {
        console.error('Error calling Gemini API:', error);

        // Return a different error for API failures
        return {
            ...mockAnalysis,
            errorType: 'API Error',
            explanation: `The AI service returned an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and internet connection.`,
            rootCause: 'API Call Failed',
            severity: severityAnalysis.severity, // Use auto-detected severity
        };
    }
};

// Helper to extract relevant files based on language
function extractRelevantFiles(fileTree: any, language: string) {
    // Simple implementation to filter files by extension
    const extensions: Record<string, string[]> = {
        'JavaScript': ['.js', '.jsx', '.ts', '.tsx'],
        'TypeScript': ['.ts', '.tsx'],
        'Python': ['.py'],
        'Java': ['.java'],
        'Go': ['.go'],
        'Ruby': ['.rb'],
        'PHP': ['.php'],
        'Rust': ['.rs'],
    };

    const relevantExts = extensions[language] || [];
    // This is a simplified recursive search or flat list filter depending on fileTree structure
    // Assuming fileTree is a flat list of paths for now or we traverse it
    // For this demo, we'll assume fileTree is an array of strings (paths)
    if (Array.isArray(fileTree)) {
        return fileTree.filter(path => relevantExts.some(ext => path.endsWith(ext))).slice(0, 20);
    }
    return [];
}

const mockAnalysis: ErrorAnalysis = {
    severity: 'medium',
    errorType: 'Mock Error (API Key Missing)',
    explanation: 'We encountered an issue analyzing your error with AI. Please try again or contact support. This is a mock response because the API key is missing or the call failed.',
    rootCause: 'AI service temporarily unavailable',
    filesLikelyAffected: [],
    solutions: [{
        title: 'Manual Investigation Required',
        description: 'Please check the error message and stack trace manually.',
        code: '// Review your error carefully\n// Check the line numbers mentioned\n// Look for common issues in your framework',
        difficulty: 'medium',
        estimatedTime: '~15 minutes',
    }],
};
