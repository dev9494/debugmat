import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, MessageSquare } from 'lucide-react';
import { useWarRoom } from '../../hooks/useWarRoom';
import { cn } from '../../lib/utils';

interface WarRoomPanelProps {
    errorId: string | null;
}

export const WarRoomPanel = ({ errorId }: WarRoomPanelProps) => {
    const { activeUsers, messages, sendMessage, loading } = useWarRoom(errorId);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    if (!errorId) return null;

    return (
        <div className="flex flex-col h-[600px] bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">War Room</h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {activeUsers.length} Online
                    </span>
                </div>
                <div className="flex -space-x-2">
                    {activeUsers.slice(0, 5).map((user) => (
                        <div key={user.userId} className="relative group">
                            <img
                                src={user.userAvatar || `https://ui-avatars.com/api/?name=${user.userName}`}
                                alt={user.userName}
                                className="w-8 h-8 rounded-full border-2 border-background"
                                title={user.userName}
                            />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                        </div>
                    ))}
                    {activeUsers.length > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            +{activeUsers.length - 5}
                        </div>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                        <MessageSquare className="w-12 h-12 mb-2" />
                        <p>No messages yet. Start the discussion!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <img
                                src={msg.userAvatar || `https://ui-avatars.com/api/?name=${msg.userName}`}
                                alt={msg.userName}
                                className="w-8 h-8 rounded-full mt-1"
                            />
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-semibold text-foreground">{msg.userName}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/90 bg-muted/50 p-2 rounded-lg rounded-tl-none mt-1 inline-block">
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-muted border-transparent focus:border-primary focus:ring-0 rounded-lg px-4 py-2 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};
