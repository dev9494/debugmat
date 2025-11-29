import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Shield, Code2, Terminal, Layers, BarChart3,
    MessageSquare, Database, LogIn
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
    const { signInWithGoogle } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = async () => {
        setIsSigningIn(true);
        try {
            await signInWithGoogle();
            onGetStarted();
        } catch (error: any) {
            console.error("Sign in failed:", error);
            if (error?.code !== 'auth/popup-closed-by-user') {
                alert('Sign-in failed: ' + (error?.message || 'Unknown error'));
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    const features = [
        {
            icon: Zap,
            title: "AI-Powered Fixes",
            description: "Empower AI-powered and proactive skills.",
            gradient: "from-orange-500 to-red-500"
        },
        {
            icon: BarChart3,
            title: "Real-time Analysis",
            description: "Provide analysis model in developer tools.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: Shield,
            title: "Secure Code Review",
            description: "Review insures you using your code review.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: Code2,
            title: "Seamless Integration",
            description: "Provide seamless through integration parameters.",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            icon: Layers,
            title: "Solutions Options",
            description: "Keep code functions with intents and modules.",
            gradient: "from-yellow-500 to-orange-500"
        },
        {
            icon: Terminal,
            title: "Quick Execution",
            description: "Manage your code executing and concessions.",
            gradient: "from-indigo-500 to-blue-500"
        },
        {
            icon: Database,
            title: "Real-time Analysis",
            description: "Professional one for entire priorities and motions.",
            gradient: "from-pink-500 to-rose-500"
        },
        {
            icon: MessageSquare,
            title: "Software Feedback",
            description: "Provide customer feedbacks to solutions engagement.",
            gradient: "from-cyan-500 to-teal-500"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#0a0e1a] to-purple-900/20" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Terminal className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold">
                            <span className="text-white">DEBUG</span>
                            <span className="text-blue-500">AI</span>
                        </span>
                    </div>
                    <button
                        onClick={handleSignIn}
                        disabled={isSigningIn}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSigningIn ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </>
                        )}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Text Content */}
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                            >
                                Debugging is<br />
                                Finally <span className="text-blue-500">Intelligent</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-gray-400 mb-8 leading-relaxed"
                            >
                                Empower your developer tool in, modern, trustworthy, and
                                developer tool for in soumenter your problems.
                            </motion.p>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                onClick={handleSignIn}
                                disabled={isSigningIn}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
                            >
                                {isSigningIn ? 'Signing In...' : 'Start Debugging'}
                            </motion.button>
                        </div>

                        {/* Right: Code Preview with AI Highlight */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            <div className="bg-[#1a1f2e] rounded-2xl border border-white/10 p-6 shadow-2xl">
                                {/* Window Controls */}
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="ml-4 text-sm text-gray-500">main.ts</span>
                                </div>

                                {/* Code Content */}
                                <div className="font-mono text-sm space-y-2">
                                    <div className="text-gray-500">
                                        <span className="text-purple-400">import</span>{' '}
                                        <span className="text-blue-400">{'{'} Assist {'}'}</span>{' '}
                                        <span className="text-purple-400">from</span>{' '}
                                        <span className="text-green-400">'creat1'</span>;
                                    </div>
                                    <div className="text-gray-500">
                                        <span className="text-purple-400">import</span>{' '}
                                        <span className="text-blue-400">{'{'} App {'}'}</span>{' '}
                                        <span className="text-purple-400">from</span>{' '}
                                        <span className="text-green-400">'./src'</span>;
                                    </div>
                                    <div className="text-gray-500">
                                        <span className="text-purple-400">import</span>{' '}
                                        <span className="text-blue-400">{'{'} chatters {'}'}</span>{' '}
                                        <span className="text-purple-400">from</span>{' '}
                                        <span className="text-green-400">'./code/tools/fix-{'$'}'</span>;
                                    </div>
                                    <div className="text-gray-500">
                                        <span className="text-purple-400">import</span>{' '}
                                        <span className="text-blue-400">{'{'} Tool {'}'}</span>{' '}
                                        <span className="text-purple-400">from</span>{' '}
                                        <span className="text-green-400">'./release/pluginapi'</span>;
                                    </div>
                                    <div className="h-4" />
                                    <div className="text-gray-500">
                                        <span className="text-purple-400">export</span>{' '}
                                        <span className="text-purple-400">default</span>{' '}
                                        <span className="text-blue-400">Chatter</span>{' '}
                                        <span className="text-yellow-400">{'{'}</span>
                                    </div>
                                    <div className="pl-4 relative">
                                        {/* AI Highlight */}
                                        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded" />
                                        <div className="bg-blue-500/10 -mx-2 px-2 py-1 rounded border-l-2 border-blue-500">
                                            <span className="text-gray-400">
                                                <span className="text-blue-400">types</span>:{' '}
                                                <span className="text-green-400">'focuses'</span>,
                                            </span>
                                            <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                                                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap flex items-center gap-1">
                                                    <Zap className="w-3 h-3" />
                                                    AI Highlight
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pl-4 text-gray-500">
                                        <span className="text-blue-400">public</span>{' '}
                                        <span className="text-yellow-400">functionGetInstall</span>
                                        <span className="text-gray-400">() =&gt; {'{'}</span>
                                    </div>
                                    <div className="pl-8 text-gray-500">
                                        <span className="text-purple-400">return</span>{' '}
                                        <span className="text-gray-400">{'{'}</span>
                                    </div>
                                    <div className="pl-12 text-gray-500">
                                        <span className="text-blue-400">consolelisten</span>
                                        <span className="text-gray-400">(</span>
                                        <span className="text-blue-400">Install</span>
                                        <span className="text-gray-400">),</span>
                                    </div>
                                    <div className="pl-8 text-gray-500">
                                        <span className="text-gray-400">{'}'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative bg-[#1a1f2e]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all hover:scale-105"
                            >
                                {/* Icon with Gradient */}
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover Glow Effect */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-xl -z-10`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8 px-6 mt-20">
                <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
                    © 2025 DebugAI Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};
