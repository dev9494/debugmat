import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Trash2, Plus, Sparkles, Loader2 } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useErrorStore } from '../../stores/errorStore';
import { sendChatMessage } from '../../lib/chatApi';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const AIChatPanel = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const {
        conversations,
        currentConversationId,
        isLoading,
        createConversation,
        addMessage,
        setCurrentConversation,
        deleteConversation,
        setLoading,
        getCurrentConversation,
    } = useChatStore();

    const { currentAnalysis, currentError } = useErrorStore();
    const currentConversation = getCurrentConversation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentConversation?.messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        let convId = currentConversationId;
        if (!convId) {
            convId = createConversation();
        }

        const userMessage = input.trim();
        setInput('');

        // Add user message
        addMessage(convId, {
            role: 'user',
            content: userMessage,
            errorContext: currentAnalysis
                ? {
                    errorType: currentAnalysis.errorType,
                    errorMessage: currentError || '',
                    filePath: currentAnalysis.filesLikelyAffected[0]?.path,
                }
                : undefined,
        });

        // Get AI response
        setLoading(true);
        try {
            const response = await sendChatMessage({
                message: userMessage,
                conversationHistory: currentConversation?.messages || [],
                errorContext: currentAnalysis
                    ? {
                        errorType: currentAnalysis.errorType,
                        errorMessage: currentError || '',
                        rootCause: currentAnalysis.rootCause,
                        filePath: currentAnalysis.filesLikelyAffected[0]?.path,
                    }
                    : undefined,
            });

            addMessage(convId, {
                role: 'assistant',
                content: response,
            });
        } catch (error) {
            console.error('Chat error:', error);
            addMessage(convId, {
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again.",
            });
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent relative">
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                            <MessageSquare className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="font-bold text-xl text-white">AI Assistant</h3>
                    </div>
                    <button
                        onClick={() => createConversation()}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="New conversation"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-base text-slate-400 leading-relaxed">
                    Ask me anything about your errors
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
                {!currentConversation || currentConversation.messages.length === 0 ? (
                    <div className="flex flex-col h-full p-6 space-y-6">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 animate-pulse border border-blue-500/20">
                                <Sparkles className="w-10 h-10 text-blue-400" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Start a Conversation</h4>
                            <p className="text-base text-slate-300 max-w-sm mx-auto leading-relaxed">
                                Ask me about your errors, get coding help, or discuss best practices.
                            </p>
                        </div>

                        {/* Suggested Questions */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">💬 Try asking:</p>
                            {currentAnalysis ? (
                                <>
                                    <button className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all group">
                                        <p className="text-sm font-bold text-blue-300 mb-1 group-hover:text-blue-200">How do I fix this {currentAnalysis.errorType}?</p>
                                        <p className="text-xs text-slate-400">Get step-by-step guidance</p>
                                    </button>
                                    <button className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                                        <p className="text-sm font-bold text-purple-300 mb-1 group-hover:text-purple-200">What causes this error?</p>
                                        <p className="text-xs text-slate-400">Understand the root cause</p>
                                    </button>
                                    <button className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 hover:border-green-500/40 transition-all group">
                                        <p className="text-sm font-bold text-green-300 mb-1 group-hover:text-green-200">Show me the best solution</p>
                                        <p className="text-xs text-slate-400">Get optimized code</p>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all group">
                                        <p className="text-sm font-bold text-blue-300 mb-1 group-hover:text-blue-200">How do I debug a React component?</p>
                                        <p className="text-xs text-slate-400">Learn debugging techniques</p>
                                    </button>
                                    <button className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                                        <p className="text-sm font-bold text-purple-300 mb-1 group-hover:text-purple-200">What are common TypeScript errors?</p>
                                        <p className="text-xs text-slate-400">Avoid common pitfalls</p>
                                    </button>
                                    <button className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 hover:border-green-500/40 transition-all group">
                                        <p className="text-sm font-bold text-green-300 mb-1 group-hover:text-green-200">Best practices for error handling</p>
                                        <p className="text-xs text-slate-400">Write better code</p>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                <div className="text-2xl mb-2">🎯</div>
                                <p className="text-xs font-bold text-white mb-1">Context-Aware</p>
                                <p className="text-xs text-slate-400">Understands your errors</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                <div className="text-2xl mb-2">⚡</div>
                                <p className="text-xs font-bold text-white mb-1">Instant Help</p>
                                <p className="text-xs text-slate-400">Fast responses</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {currentConversation.messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    'flex gap-3 animate-in fade-in slide-in-from-bottom-2',
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                {message.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                                        <Sparkles className="w-4 h-4 text-blue-400" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        'max-w-[85%] rounded-2xl px-4 py-3 shadow-md',
                                        message.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border border-blue-500/20'
                                            : 'bg-white/5 text-slate-200 border border-white/10 backdrop-blur-sm'
                                    )}
                                >
                                    <p className="text-base whitespace-pre-wrap break-words leading-relaxed">
                                        {message.content}
                                    </p>
                                    <p
                                        className={cn(
                                            'text-xs mt-2',
                                            message.role === 'user' ? 'text-blue-200' : 'text-slate-500'
                                        )}
                                    >
                                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                                    </p>
                                </div>
                                {message.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                        <span className="text-sm">👤</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 justify-start animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-md">
                <div className="flex gap-2">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                        rows={2}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-4 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-slate-500 text-white font-semibold transition-all disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex justify-between">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <span className="text-blue-400/50">AI can make mistakes. Review generated code.</span>
                </p>
            </div>

            {/* Conversation History (Optional - can be shown in a dropdown) */}
            {conversations.length > 1 && (
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Recent Conversations</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                        {conversations.slice(0, 5).map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setCurrentConversation(conv.id)}
                                className={cn(
                                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group',
                                    conv.id === currentConversationId
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                                )}
                            >
                                <span className="truncate">{conv.title}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteConversation(conv.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-opacity text-red-400"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
