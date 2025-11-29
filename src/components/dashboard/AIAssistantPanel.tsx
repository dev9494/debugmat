import { Sparkles, MessageSquare, ArrowRight, Loader2, User, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useErrorStore } from '../../stores/errorStore';
import { useState, useEffect } from 'react';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const AIAssistantPanel = () => {
    const { currentAnalysis, isAnalyzing, currentError } = useErrorStore();
    const [input, setInput] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isLoadingChat, setIsLoadingChat] = useState(false);

    // Clear chat when a new analysis is started
    useEffect(() => {
        setChatMessages([]);
    }, [currentAnalysis]);

    const handleSendMessage = async () => {
        if (!input.trim() || !currentAnalysis) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message to chat
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoadingChat(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                setChatMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '⚠️ Gemini API key not found.'
                }]);
                setIsLoadingChat(false);
                return;
            }

            const prompt = `You are a helpful AI debugging assistant.

Current Error: ${currentError}
Analysis: ${currentAnalysis.explanation}
Root Cause: ${currentAnalysis.rootCause}

User Question: ${userMessage}

Provide a clear, concise answer.`;

            // Try different model configurations until one works
            // Using models that are actually available for this API key
            const modelConfigs = [
                { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', name: 'gemini-2.5-flash' },
                { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', name: 'gemini-2.0-flash' },
                { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', name: 'gemini-flash-latest' },
                { url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent', name: 'gemini-2.5-flash (v1)' },
                { url: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent', name: 'gemini-2.0-flash (v1)' },
            ];

            let responseText = '';
            let lastError = '';

            console.log('🔍 Trying different Gemini models...');

            for (const config of modelConfigs) {
                try {
                    console.log(`Attempting: ${config.name}...`);
                    const response = await fetch(`${config.url}?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }]
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (responseText) {
                            console.log(`✅ SUCCESS with ${config.name}!`);
                            break;
                        }
                    } else {
                        const errorData = await response.json();
                        lastError = errorData.error?.message || 'Unknown error';
                        console.log(`❌ ${config.name} failed:`, lastError.substring(0, 100));
                    }
                } catch (err: any) {
                    lastError = err.message;
                    console.log(`❌ ${config.name} error:`, err.message);
                }
            }

            if (responseText) {
                setChatMessages(prev => [...prev, {
                    role: 'assistant',
                    content: responseText
                }]);
            } else {
                // If all models failed, try to get the list of available models
                console.log('📋 All models failed. Fetching available models list...');
                try {
                    const modelsListResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                    if (modelsListResponse.ok) {
                        const modelsData = await modelsListResponse.json();
                        console.log('Available models:', modelsData);
                        const availableModels = modelsData.models?.filter((m: any) =>
                            m.supportedGenerationMethods?.includes('generateContent')
                        ).map((m: any) => m.name);
                        console.log('Models that support generateContent:', availableModels);
                    }
                } catch (listErr) {
                    console.error('Failed to fetch models list:', listErr);
                }

                throw new Error(lastError || 'All models failed');
            }

        } catch (error: any) {
            console.error('Chat error:', error);
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Unable to get response: ${error.message}\n\nPlease refer to the analysis above for detailed information about this error.`
            }]);
        } finally {
            setIsLoadingChat(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (isAnalyzing) {
        return (
            <div className="flex flex-col h-full bg-card items-center justify-center p-10 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 animate-pulse">
                    <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Analyzing Error...</h3>
                <p className="text-base text-muted-foreground leading-relaxed">Our AI is examining the stack trace and code context to find the root cause.</p>
            </div>
        );
    }

    if (!currentAnalysis) {
        return (
            <div className="flex flex-col h-full bg-card items-center justify-center p-10 text-center">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-5">
                    <MessageSquare className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Ready to Assist</h3>
                <p className="text-base text-muted-foreground leading-relaxed">Paste an error in the editor and click "Analyze Error" to get started.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">AI Chat</h2>
                        <p className="text-xs text-muted-foreground">Ask follow-up questions</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {!currentAnalysis ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground">Analyze an error first</p>
                        <p className="text-xs text-muted-foreground mt-1">Then ask questions here</p>
                    </div>
                ) : chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <MessageSquare className="w-12 h-12 text-primary mb-3 opacity-50" />
                        <p className="text-sm text-foreground font-medium">Ready to help!</p>
                        <p className="text-xs text-muted-foreground mt-1">Ask anything about the error</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {chatMessages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-2 p-3 rounded-lg",
                                    message.role === 'user'
                                        ? "bg-primary/10 border border-primary/20"
                                        : "bg-muted/50 border border-border"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0",
                                    message.role === 'user'
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                                )}>
                                    {message.role === 'user' ? (
                                        <User className="w-3 h-3" />
                                    ) : (
                                        <Bot className="w-3 h-3" />
                                    )}
                                </div>
                                <div className="flex-1 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoadingChat && (
                            <div className="flex gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                </div>
                                <div className="flex-1 text-xs text-muted-foreground">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-muted/30">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question..."
                        disabled={isLoadingChat || !currentAnalysis}
                        className="w-full bg-background border border-border rounded-lg pl-3 pr-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoadingChat || !currentAnalysis}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingChat ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <ArrowRight className="w-4 h-4" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Press Enter to send
                </p>
            </div>
        </div>
    );
};
