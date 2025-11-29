import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Zap, Shield, Code2, Terminal, Cpu, Globe,
    CheckCircle, XCircle, ArrowRight, Play,
    MessageSquare, Layers, BarChart3, GitPullRequest,
    Trophy, ChevronRight, Star, Check, Sparkles,
    Bug, Search, Lock, LogIn
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { DemoVideoModal } from './DemoVideoModal';
import { useAuth } from '../../contexts/AuthContext';

interface LandingPageProps {
    onGetStarted: () => void;
}

const FloatingIcon = ({ icon: Icon, className, delay }: { icon: any, className?: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4, y: -20 }}
        transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: delay,
            ease: "easeInOut"
        }}
        className={cn("absolute p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm", className)}
    >
        <Icon className="w-6 h-6 text-white/50" />
    </motion.div>
);

const SideCodeSnippet = ({ code, className, delay }: { code: string, className?: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.6, x: 0 }}
        transition={{ delay, duration: 0.8 }}
        className={cn("hidden 2xl:block absolute font-mono text-xs text-slate-500 bg-[#0B1121]/80 p-4 rounded-lg border border-white/5 backdrop-blur-sm w-64", className)}
    >
        <pre>{code}</pre>
    </motion.div>
);

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const [showDemo, setShowDemo] = useState(false);
    const { currentUser, signInWithGoogle } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = async () => {
        setIsSigningIn(true);
        try {
            await signInWithGoogle();
            // After successful sign in, navigate to dashboard
            onGetStarted();
        } catch (error: any) {
            console.error("Sign in failed:", error);

            // Show user-friendly error messages
            if (error?.code === 'auth/configuration-not-found') {
                alert(
                    '⚠️ Google Sign-In Not Configured\n\n' +
                    'Please enable Google authentication in Firebase Console:\n\n' +
                    '1. Go to Firebase Console > Authentication\n' +
                    '2. Click "Sign-in method" tab\n' +
                    '3. Enable "Google" provider\n' +
                    '4. Save and try again\n\n' +
                    'See FIREBASE_AUTH_FIX.md for detailed instructions.'
                );
            } else if (error?.code === 'auth/popup-closed-by-user') {
                // User closed the popup, no need to show error
                console.log('Sign-in popup closed by user');
            } else {
                alert('Sign-in failed: ' + (error?.message || 'Unknown error'));
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    // If user is already signed in, show their profile
    useEffect(() => {
        if (currentUser) {
            onGetStarted();
        }
    }, [currentUser, onGetStarted]);

    return (
        <div className="min-h-screen bg-[#0B1121] text-white overflow-x-hidden font-sans selection:bg-blue-500/30">
            <DemoVideoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse delay-2000" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Side Decorations - Filling the Empty Space */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden hidden xl:block">
                {/* Left Side Icons */}
                <FloatingIcon icon={Bug} className="top-[20%] left-[2%]" delay={0} />
                <FloatingIcon icon={Code2} className="top-[40%] left-[4%]" delay={1} />
                <FloatingIcon icon={Terminal} className="top-[60%] left-[2%]" delay={2} />

                {/* Right Side Icons */}
                <FloatingIcon icon={Zap} className="top-[25%] right-[2%]" delay={0.5} />
                <FloatingIcon icon={Shield} className="top-[45%] right-[4%]" delay={1.5} />
                <FloatingIcon icon={GitPullRequest} className="top-[65%] right-[2%]" delay={2.5} />

                {/* Code Snippets for Extra Wide Screens */}
                <SideCodeSnippet
                    code={`function fixError(err) {\n  if (!err) return;\n  analyze(err);\n}`}
                    className="top-[30%] left-[1%]"
                    delay={0.5}
                />
                <SideCodeSnippet
                    code={`// Auto-detected\nconst severity = 'HIGH';\nnotify(channels.SLACK);`}
                    className="bottom-[30%] right-[1%]"
                    delay={0.8}
                />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0B1121]/80 backdrop-blur-xl">
                <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Terminal className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                            DebugMate
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-10 text-base font-medium text-slate-300">
                        <a href="#features" className="hover:text-white hover:scale-105 transition-all">Features</a>
                        <a href="#how-it-works" className="hover:text-white hover:scale-105 transition-all">How it Works</a>
                        <a href="#pricing" className="hover:text-white hover:scale-105 transition-all">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSignIn}
                            disabled={isSigningIn}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-full transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSigningIn ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In with Google
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6 z-10">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        {/* Left Content */}
                        <div className="text-left pl-4 lg:pl-10">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-base font-medium text-blue-400 mb-10"
                            >
                                <Sparkles className="w-5 h-5" />
                                <span className="animate-pulse">Powered by Google Gemini AI</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
                            >
                                Debugging is <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-gradient">
                                    Finally Intelligent.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl text-slate-300 mb-12 max-w-2xl leading-relaxed"
                            >
                                Stop staring at logs. DebugMate uses advanced AI to analyze errors, generate fixes, and prevent bugs before they reach production.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-6"
                            >
                                <button
                                    onClick={handleSignIn}
                                    disabled={isSigningIn}
                                    className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-lg font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSigningIn ? (
                                        <>
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            Sign In & Start Free <Zap className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowDemo(true)}
                                    className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg font-bold rounded-2xl transition-all flex items-center justify-center gap-3 backdrop-blur-sm hover:scale-105 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                    </div>
                                    Watch Demo
                                </button>
                            </motion.div>

                            <div className="mt-16 flex items-center gap-8 text-base text-slate-400">
                                <div className="flex -space-x-4">
                                    {[
                                        "https://i.pravatar.cc/100?img=11",
                                        "https://i.pravatar.cc/100?img=32",
                                        "https://i.pravatar.cc/100?img=12",
                                        "https://i.pravatar.cc/100?img=5"
                                    ].map((src, i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0B1121] bg-slate-700 overflow-hidden hover:scale-110 transition-transform z-0 hover:z-10 relative">
                                            <img src={src} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-2 border-[#0B1121] bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white z-10">
                                        +2k
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex gap-1 text-yellow-400 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium text-white">Loved by developers</span>
                                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">4.9/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual - Floating Cards */}
                        <div className="relative hidden lg:block h-[700px] w-full">
                            {/* Card 1: The Error */}
                            <motion.div
                                initial={{ opacity: 0, x: 50, y: -50 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="absolute top-0 right-10 w-[500px] bg-[#1E293B] border border-slate-700 rounded-2xl p-8 shadow-2xl z-10"
                            >
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                                    <div className="w-4 h-4 rounded-full bg-red-500" />
                                    <div className="w-4 h-4 rounded-full bg-yellow-500" />
                                    <div className="w-4 h-4 rounded-full bg-green-500" />
                                    <span className="ml-auto text-sm text-slate-400">error.log</span>
                                </div>
                                <div className="font-mono text-sm text-red-400 space-y-3">
                                    <p>TypeError: Cannot read properties of undefined (reading 'map')</p>
                                    <p className="text-slate-500">at UserList (UserList.tsx:42:18)</p>
                                    <p className="text-slate-500">at renderWithHooks (react-dom.development.js:16305)</p>
                                </div>
                            </motion.div>

                            {/* Card 2: The AI Fix */}
                            <motion.div
                                initial={{ opacity: 0, x: 50, y: 50 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="absolute top-[220px] right-[100px] w-[550px] bg-[#0F172A] border border-blue-500/30 rounded-2xl p-8 shadow-2xl z-20 backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-blue-500/20">
                                        <Sparkles className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span className="text-base font-semibold text-blue-400">AI Fix Generated</span>
                                </div>
                                <div className="font-mono text-sm text-slate-300 bg-black/30 p-6 rounded-xl border border-white/5 leading-relaxed">
                                    <span className="text-purple-400">const</span> UserList = ({'{'} users {'}'}) ={'>'} {'{'}<br />
                                    &nbsp;&nbsp;<span className="text-slate-500">// Fix: Add optional chaining or default value</span><br />
                                    &nbsp;&nbsp;<span className="text-green-400">+ if (!users) return null;</span><br />
                                    &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;{'{'}users.map(user ={'>'} ...{'}'})<br />
                                    &nbsp;&nbsp;);<br />
                                    {'}'};
                                </div>
                                <div className="mt-6 flex gap-4">
                                    <button className="flex-1 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-500 transition-colors">Apply Fix</button>
                                    <button className="px-6 py-3 bg-white/5 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors">Explain</button>
                                </div>
                            </motion.div>

                            {/* Card 3: Success Metric */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="absolute bottom-20 right-[400px] bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl shadow-xl z-30 text-white"
                            >
                                <CheckCircle className="w-10 h-10 mb-3" />
                                <p className="text-base font-medium opacity-90">Bug Fixed</p>
                                <p className="text-3xl font-bold">+50 XP</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Wider & More Colorful */}
            <section id="features" className="py-40 relative">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">Superpowers for your <span className="text-blue-500">debugging workflow</span></h2>
                        <p className="text-2xl text-slate-300 max-w-3xl mx-auto">
                            Everything you need to find, fix, and prevent errors in record time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Zap className="w-8 h-8 text-white" />,
                                color: "bg-orange-500",
                                title: "Instant Auto-Fix",
                                description: "AI analyzes your error and generates production-ready code fixes in seconds."
                            },
                            {
                                icon: <Layers className="w-8 h-8 text-white" />,
                                color: "bg-purple-500",
                                title: "Smart Clustering",
                                description: "Automatically groups similar errors to help you identify patterns and root causes."
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-white" />,
                                color: "bg-blue-500",
                                title: "Prevention Mode",
                                description: "Proactively scans your code to catch bugs and vulnerabilities before deployment."
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8 text-white" />,
                                color: "bg-green-500",
                                title: "Real-time Analytics",
                                description: "Track error trends, MTTR, and business impact with beautiful dashboards."
                            },
                            {
                                icon: <Code2 className="w-8 h-8 text-white" />,
                                color: "bg-pink-500",
                                title: "Interactive Playground",
                                description: "Test fixes safely in an isolated sandbox environment before applying them."
                            },
                            {
                                icon: <Trophy className="w-8 h-8 text-white" />,
                                color: "bg-yellow-500",
                                title: "Gamification",
                                description: "Turn debugging into a game with points, levels, and achievements."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-10 rounded-[2rem] bg-[#1E293B]/50 border border-white/5 hover:bg-[#1E293B] hover:border-white/10 transition-all hover:-translate-y-2"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* How It Works Section */}
            < section id="how-it-works" className="py-32 relative bg-[#0B1121]/50" >
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">From Error to Fix in <span className="text-blue-500">Seconds</span></h2>
                        <p className="text-2xl text-slate-300 max-w-3xl mx-auto">
                            DebugMate integrates seamlessly into your workflow. No complex setup required.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 -translate-y-1/2" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            {[
                                {
                                    step: "01",
                                    title: "Connect",
                                    desc: "Add our lightweight SDK to your project with just two lines of code.",
                                    icon: <Terminal className="w-8 h-8 text-white" />
                                },
                                {
                                    step: "02",
                                    title: "Analyze",
                                    desc: "Our AI automatically detects errors and analyzes the stack trace in real-time.",
                                    icon: <Cpu className="w-8 h-8 text-white" />
                                },
                                {
                                    step: "03",
                                    title: "Resolve",
                                    desc: "Get an instant, copy-pasteable solution and deploy the fix with confidence.",
                                    icon: <CheckCircle className="w-8 h-8 text-white" />
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    viewport={{ once: true }}
                                    className="bg-[#0B1121] border border-white/10 p-8 rounded-3xl relative group hover:border-blue-500/50 transition-colors"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform mx-auto md:mx-0">
                                        {item.icon}
                                    </div>
                                    <div className="absolute top-8 right-8 text-4xl font-bold text-white/5 font-mono">
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* Pricing Section */}
            < section id="pricing" className="py-32 relative" >
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">Simple, Transparent <span className="text-blue-500">Pricing</span></h2>
                        <p className="text-2xl text-slate-300 max-w-3xl mx-auto">
                            Start for free, scale as you grow. No hidden fees.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Starter Tier */}
                        <div className="p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5 hover:border-white/10 transition-all">
                            <h3 className="text-xl font-bold text-slate-300 mb-2">Starter</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <p className="text-slate-400 mb-8">Perfect for hobby projects and experiments.</p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "5,000 events/month",
                                    "1 team member",
                                    "7-day data retention",
                                    "Basic AI analysis",
                                    "Community support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <Check className="w-5 h-5 text-blue-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/10">
                                Get Started
                            </button>
                        </div>

                        {/* Pro Tier - Highlighted */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-600/20 to-[#1E293B]/50 border border-blue-500/50 relative transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold text-blue-400 mb-2">Pro</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-bold text-white">$29</span>
                                <span className="text-slate-400">/month</span>
                            </div>
                            <p className="text-slate-300 mb-8">For serious developers and small teams.</p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "100,000 events/month",
                                    "5 team members",
                                    "30-day data retention",
                                    "Advanced AI Auto-fix",
                                    "Slack & Discord integration",
                                    "Priority support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white">
                                        <div className="p-1 rounded-full bg-blue-500/20">
                                            <Check className="w-4 h-4 text-blue-400" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={onGetStarted}
                                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/25"
                            >
                                Start Free Trial
                            </button>
                        </div>

                        {/* Business Tier */}
                        <div className="p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5 hover:border-white/10 transition-all">
                            <h3 className="text-xl font-bold text-slate-300 mb-2">Business</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">$99</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <p className="text-slate-400 mb-8">For scaling startups and organizations.</p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "1,000,000 events/month",
                                    "Unlimited team members",
                                    "90-day data retention",
                                    "Custom AI models",
                                    "SSO & Audit logs",
                                    "Dedicated success manager"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <Check className="w-5 h-5 text-blue-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/10">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section >

            {/* CTA Section - Full Width Gradient */}
            < section className="py-40 relative overflow-hidden" >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-50" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-bold mb-10 text-white">Ready to debug <span className="text-blue-400">10x faster?</span></h2>
                    <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
                        Join thousands of developers who are shipping better code with DebugMate.
                    </p>
                    <button
                        onClick={handleSignIn}
                        disabled={isSigningIn}
                        className="px-12 py-6 bg-white text-blue-900 text-xl font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSigningIn ? (
                            <>
                                <div className="w-6 h-6 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                Get Started Now <ArrowRight className="w-6 h-6" />
                            </>
                        )}
                    </button>
                </div>
            </section >

            {/* Footer */}
            < footer className="py-16 px-6 border-t border-white/10 bg-[#050505]" >
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-8 h-8 text-blue-500" />
                        <span className="text-2xl font-bold text-white">DebugMate</span>
                    </div>
                    <div className="text-base text-slate-400">
                        © 2025 DebugMate Inc. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-base text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </footer >
        </div >
    );
};
