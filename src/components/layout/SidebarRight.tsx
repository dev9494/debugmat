import { useState } from 'react';
import { Shield, MessageSquare } from 'lucide-react';
import { PreventionScanner } from '../analysis/PreventionScanner';
import { AIChatPanel } from '../features/AIChatPanel';
import { cn } from '../../lib/utils';

type Tab = 'prevention' | 'chat';

export const SidebarRight = () => {
    const [activeTab, setActiveTab] = useState<Tab>('chat');

    return (
        <div className="h-full flex flex-col bg-transparent">
            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-white/5 backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={cn(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all relative',
                        activeTab === 'chat'
                            ? 'text-blue-400 bg-white/5'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                >
                    <MessageSquare className="w-4 h-4" />
                    <span>AI Chat</span>
                    {activeTab === 'chat' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('prevention')}
                    className={cn(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all relative',
                        activeTab === 'prevention'
                            ? 'text-purple-400 bg-white/5'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                >
                    <Shield className="w-4 h-4" />
                    <span>Prevention</span>
                    {activeTab === 'prevention' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'chat' ? <AIChatPanel /> : <PreventionScanner />}
            </div>
        </div>
    );
};
