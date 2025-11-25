import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    errorContext?: {
        errorType: string;
        errorMessage: string;
        filePath?: string;
    };
}

export interface ChatConversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
}

interface ChatState {
    conversations: ChatConversation[];
    currentConversationId: string | null;
    isLoading: boolean;

    // Actions
    createConversation: (title?: string) => string;
    addMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    setCurrentConversation: (id: string | null) => void;
    deleteConversation: (id: string) => void;
    clearAllConversations: () => void;
    setLoading: (loading: boolean) => void;
    getCurrentConversation: () => ChatConversation | null;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            currentConversationId: null,
            isLoading: false,

            createConversation: (title = 'New Conversation') => {
                const id = `conv-${Date.now()}`;
                const newConversation: ChatConversation = {
                    id,
                    title,
                    messages: [],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };

                set((state) => ({
                    conversations: [newConversation, ...state.conversations],
                    currentConversationId: id,
                }));

                return id;
            },

            addMessage: (conversationId, message) => {
                const newMessage: ChatMessage = {
                    ...message,
                    id: `msg-${Date.now()}`,
                    timestamp: Date.now(),
                };

                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv.id === conversationId
                            ? {
                                ...conv,
                                messages: [...conv.messages, newMessage],
                                updatedAt: Date.now(),
                                // Auto-generate title from first user message
                                title:
                                    conv.messages.length === 0 && message.role === 'user'
                                        ? message.content.slice(0, 50) + '...'
                                        : conv.title,
                            }
                            : conv
                    ),
                }));
            },

            setCurrentConversation: (id) => {
                set({ currentConversationId: id });
            },

            deleteConversation: (id) => {
                set((state) => ({
                    conversations: state.conversations.filter((conv) => conv.id !== id),
                    currentConversationId:
                        state.currentConversationId === id ? null : state.currentConversationId,
                }));
            },

            clearAllConversations: () => {
                set({ conversations: [], currentConversationId: null });
            },

            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            getCurrentConversation: () => {
                const state = get();
                return (
                    state.conversations.find((conv) => conv.id === state.currentConversationId) || null
                );
            },
        }),
        {
            name: 'chat-storage',
        }
    )
);
