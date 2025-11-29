import { Sparkles, MessageSquare, Send, Loader2, User, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useErrorStore } from '../../stores/errorStore';
import { useUserStore } from '../../stores/userStore';
import { useAuth } from '../../contexts/AuthContext';
import { saveErrorToFirestore } from '../../lib/firestore';
import { analyzeError } from '../../lib/gemini';
import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const AIChatPanel = () => {
    const { currentAnalysis, currentError, setCurrentError, setCurrentAnalysis, setIsAnalyzing, addToHistory } = useErrorStore();
    const { incrementUsage } = useUserStore();
    const { currentUser } = useAuth();
    const [input, setInput] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    useEffect(() => {
        setChatMessages([]);
    }, [currentAnalysis]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');

        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoadingChat(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                setChatMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '⚠️ Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.'
                }]);
                setIsLoadingChat(false);
                return;
            }

            if (!currentAnalysis) {
                console.log('🔍 No existing analysis - treating as new error analysis');
                setIsAnalyzing(true);
                setCurrentError(userMessage);

                const analysis = await analyzeError(userMessage);
                console.log('✅ Analysis complete:', analysis);

                setCurrentAnalysis(analysis);
                incrementUsage();

                const newErrorItem = {
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    errorMessage: userMessage.slice(0, 100) + '...',
                    language: 'typescript',
                    analysis,
                    status: 'new' as const
                };

                addToHistory(newErrorItem);

                // Save to Firestore if logged in
                if (currentUser) {
                    await saveErrorToFirestore(currentUser.uid, newErrorItem);
                }

                setChatMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '✅ Analysis complete! Check the main panel for detailed results and solutions.'
                }]);

                setIsAnalyzing(false);
                setIsLoadingChat(false);
                return;
            }

            const prompt = `You are a helpful AI debugging assistant.

Current Error: ${currentError}
Analysis: ${currentAnalysis.explanation}
Root Cause: ${currentAnalysis.rootCause}

User Question: ${userMessage}

Provide a clear, concise answer.`;

            const modelConfigs = [
                { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', name: 'gemini-2.5-flash' },
                { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', name: 'gemini-2.0-flash' },
                { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', name: 'gemini-flash-latest' },
            ];

            let responseText = '';

            for (const config of modelConfigs) {
                try {
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
                        if (responseText) break;
                    }
                } catch (err: any) {
                    console.error(err);
                }
            }

            if (responseText) {
                setChatMessages(prev => [...prev, {
                    role: 'assistant',
                    content: responseText
                }]);
            } else {
                throw new Error('Failed to get response');
            }

        } catch (error: any) {
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Unable to get response. Please try again.`
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

    const quickQuestions = [
        "How do I fix this?",
        "What caused this error?",
    ];

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Header */}
            <div className="p-5 border-b border-border bg-muted/30 backdrop-blur-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base font-bold text-foreground">AI CHAT</h2>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 min-h-0">
                {chatMessages.length === 0 ? (
                    <div className="flex flex-col h-full justify-center space-y-4 p-2">
                        {/* Example message bubble */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white text-sm leading-relaxed shadow-xl">
                            <p className="font-bold mb-2 text-base">Explain the Database Connection Error</p>
                            <p className="opacity-90">
                                This error typically occurs when the application fails to establish a connection to the database server...
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                            {quickQuestions.map((question, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(question)}
                                    className="w-full text-left text-xs px-3 py-2.5 rounded-lg bg-muted hover:bg-muted/70 text-foreground transition-colors border border-border shadow-sm font-medium"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 pb-2">
                        {chatMessages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-3 p-3 rounded-xl",
                                    message.role === 'user'
                                        ? "bg-blue-600/10 border border-blue-500/20"
                                        : "bg-purple-600/10 border border-purple-500/20"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5",
                                    message.role === 'user'
                                        ? "bg-blue-500 text-white"
                                        : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                                )}>
                                    {message.role === 'user' ? (
                                        <User className="w-3 h-3" />
                                    ) : (
                                        <Bot className="w-3 h-3" />
                                    )}
                                </div>
                                <div className="flex-1 text-sm text-foreground leading-relaxed">
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoadingChat && (
                            <div className="flex gap-3 p-3 rounded-xl bg-purple-600/10 border border-purple-500/20">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm mt-0.5">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                </div>
                                <div className="flex-1 text-sm text-muted-foreground">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border bg-muted/30 backdrop-blur-sm flex-shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={isLoadingChat}
                        className="w-full bg-card border border-border rounded-lg pl-3 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoadingChat}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isLoadingChat ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
