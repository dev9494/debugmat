import type { ChatMessage } from '../stores/chatStore';

interface ChatRequest {
    message: string;
    conversationHistory: ChatMessage[];
    errorContext?: {
        errorType: string;
        errorMessage: string;
        rootCause?: string;
        filePath?: string;
        codeSnippet?: string;
    };
}

export const sendChatMessage = async (request: ChatRequest): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        return "I'm sorry, but the AI service is not configured. Please add your Gemini API key to use the chat feature.";
    }

    // Build context from conversation history
    const conversationContext = request.conversationHistory
        .slice(-5) // Last 5 messages for context
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

    // Build error context if available
    const errorContext = request.errorContext
        ? `
Current Error Context:
- Error Type: ${request.errorContext.errorType}
- Error Message: ${request.errorContext.errorMessage}
${request.errorContext.rootCause ? `- Root Cause: ${request.errorContext.rootCause}` : ''}
${request.errorContext.filePath ? `- File: ${request.errorContext.filePath}` : ''}
${request.errorContext.codeSnippet ? `- Code Snippet:\n${request.errorContext.codeSnippet}` : ''}
`
        : '';

    const prompt = `You are DebugMate AI, an expert debugging assistant and pair programming partner.

${errorContext}

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ''}

User's question: ${request.message}

Provide a helpful, concise response. If discussing code:
- Use code blocks with syntax highlighting
- Explain your reasoning
- Suggest best practices
- Reference the error context if relevant

Keep responses conversational and friendly, like a helpful senior developer.`;

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
                        temperature: 0.7,
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

        return aiResponse;
    } catch (error) {
        console.error('Chat API error:', error);
        return "I'm sorry, I encountered an error while processing your request. Please try again.";
    }
};
