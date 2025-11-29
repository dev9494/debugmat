import type { ErrorAnalysis } from '../stores/errorStore';
import { detectSeverity } from './severityDetection';

export const analyzeError = async (errorMessage: string): Promise<ErrorAnalysis> => {
    // Default context for quick analysis
    return analyzeErrorWithGemini(
        errorMessage,
        'TypeScript', // Default language
        ['React', 'Node.js', 'TypeScript'], // Default stack
        [], // Empty file tree
        '' // No extra context
    );
};

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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
                        maxOutputTokens: 4096
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
        console.log('Gemini API Response:', JSON.stringify(data, null, 2));

        // Extract the text from Gemini's response structure with better error handling
        if (!data.candidates || data.candidates.length === 0) {
            console.error('Gemini returned no candidates:', data);
            throw new Error('AI returned no response. This might be due to safety filters or API quota limits.');
        }

        const candidate = data.candidates[0];
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            console.error('Invalid candidate structure:', candidate);
            throw new Error('AI response has invalid structure. Please try again.');
        }

        const generatedText = candidate.content.parts[0].text;
        if (!generatedText) {
            console.error('No text in response:', candidate);
            throw new Error('AI returned empty response.');
        }

        console.log('Generated Text:', generatedText.substring(0, 500));

        // Clean up the response (remove markdown code blocks if present)
        let cleanedText = generatedText.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        // Parse the JSON response
        let analysis;
        try {
            analysis = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Attempted to parse:', cleanedText.substring(0, 500));
            throw new Error('Failed to parse AI response. The response may not be valid JSON.');
        }

        // Validate required fields
        if (!analysis.severity || !analysis.explanation || !analysis.solutions) {
            console.error('Missing required fields in analysis:', analysis);
            throw new Error('Invalid response structure from Gemini - missing required fields');
        }

        // Override severity with our auto-detected one (more accurate)
        analysis.severity = severityAnalysis.severity;

        return analysis;

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        console.log('Falling back to mock analysis with helpful solutions');

        // Return clean mock analysis without error messages
        return {
            ...mockAnalysis,
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
    errorType: 'TypeError: Cannot read property of undefined',
    explanation: 'This error typically occurs when you try to access a property on an undefined or null value. In React applications, this often happens when state hasn\'t been initialized yet, an API call hasn\'t returned data, or a component receives unexpected props. The error suggests that somewhere in your code, you\'re trying to read a property (like .map, .length, or a custom property) on a value that is undefined.',
    rootCause: 'Attempting to access a property on an undefined value, likely due to uninitialized state, missing data from an API call, or incorrect prop handling.',
    filesLikelyAffected: [],
    solutions: [{
        title: 'Add Null/Undefined Check',
        description: 'Add a conditional check before accessing the property to ensure the value exists. This is the safest and most common solution.',
        code: `// Before (causes error)
const items = data.items;
items.map(item => ...)

// After (safe)
const items = data?.items || [];
items.map(item => ...)

// Or with explicit check
if (data && data.items) {
  data.items.map(item => ...)
}`,
        difficulty: 'easy',
        estimatedTime: '~2 minutes',
        rank: 'best',
        reasoning: 'Quick fix that prevents the error and handles edge cases gracefully.',
        steps: [
            'Identify the line where the error occurs',
            'Add optional chaining (?.) or null check',
            'Provide a default value if needed'
        ]
    }, {
        title: 'Initialize State with Default Value',
        description: 'If this is a React state issue, initialize your state with a proper default value instead of undefined.',
        code: `// Before
const [users, setUsers] = useState();

// After
const [users, setUsers] = useState([]);

// Or for objects
const [userData, setUserData] = useState({
  name: '',
  items: []
});`,
        difficulty: 'easy',
        estimatedTime: '~3 minutes',
        rank: 'fastest',
        reasoning: 'Prevents the error at the source by ensuring state always has a valid value.',
        steps: [
            'Find the useState declaration',
            'Add appropriate default value',
            'Test the component'
        ]
    }, {
        title: 'Add Loading State',
        description: 'Implement proper loading states to prevent rendering before data is available. This is the most robust solution for async data.',
        code: `const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData().then(result => {
    setData(result);
    setLoading(false);
  });
}, []);

if (loading) {
  return <div>Loading...</div>;
}

if (!data) {
  return <div>No data available</div>;
}

return <div>{data.items.map(...)}</div>;`,
        difficulty: 'medium',
        estimatedTime: '~10 minutes',
        rank: 'robust',
        reasoning: 'Provides better UX with loading states and handles all edge cases including errors.',
        steps: [
            'Add loading state to component',
            'Show loading UI while data fetches',
            'Add null checks before rendering',
            'Handle error states'
        ]
    }],
};

