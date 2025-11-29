import { X, Play, Pause, Volume2, VolumeX, Terminal, Cpu, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// --- Sound Synthesis Helper (Web Audio API) ---
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playSound = (type: 'type' | 'error' | 'success' | 'scan') => {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    switch (type) {
        case 'type':
            // Key click sound
            osc.type = 'triangle'; // Softer than square
            osc.frequency.setValueAtTime(800 + Math.random() * 200, now); // Variation
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
        case 'error':
            // Error buzz
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.3);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
        case 'success':
            // Success chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
        case 'scan':
            // High-tech scanning sound
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2000, now);
            osc.frequency.linearRampToValueAtTime(500, now + 0.1);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;
    }
};

// --- Simulated Demo Component ---
const SimulatedDemo = ({ isPlaying, isMuted, onComplete }: { isPlaying: boolean; isMuted: boolean; onComplete: () => void }) => {
    const [step, setStep] = useState(0); // 0: Typing, 1: Error, 2: Scanning, 3: Fix, 4: Success
    const [code, setCode] = useState('');

    // The "script" for the demo
    const fullCode = `function processPayment(user, amount) {
  if (user.balance < amount) {
    throw new Error("Insufficient funds");
  }
  
  // Process transaction
  return user.balance - amount;
}`;

    const fixedCode = `function processPayment(user, amount) {
  // AI Fix: Added null check
  if (!user || !user.balance) {
    return false; 
  }

  if (user.balance < amount) {
    throw new Error("Insufficient funds");
  }
  
  return user.balance - amount;
}`;

    useEffect(() => {
        if (!isPlaying) return;

        let timeout: ReturnType<typeof setTimeout>;

        const runAnimation = async () => {
            // Step 0: Typing Code
            if (step === 0) {
                if (code.length < fullCode.length) {
                    timeout = setTimeout(() => {
                        setCode(fullCode.slice(0, code.length + 1));
                        if (!isMuted && Math.random() > 0.5) playSound('type');
                    }, 30); // Typing speed
                } else {
                    // Finished typing, move to error
                    timeout = setTimeout(() => setStep(1), 1000);
                }
            }

            // Step 1: Error Detected
            if (step === 1) {
                if (!isMuted) playSound('error');
                timeout = setTimeout(() => setStep(2), 1500);
            }

            // Step 2: AI Scanning
            if (step === 2) {
                // Scanning sound loop
                const scanInterval = setInterval(() => {
                    if (!isMuted) playSound('scan');
                }, 100);

                timeout = setTimeout(() => {
                    clearInterval(scanInterval);
                    setStep(3);
                }, 2000);
            }

            // Step 3: Applying Fix
            if (step === 3) {
                setCode(fixedCode);
                if (!isMuted) playSound('success');
                timeout = setTimeout(() => setStep(4), 1000);
            }

            // Step 4: Success & Reset
            if (step === 4) {
                timeout = setTimeout(() => {
                    onComplete(); // Notify parent to show replay button or loop
                    setStep(0);
                    setCode('');
                }, 3000);
            }
        };

        runAnimation();

        return () => clearTimeout(timeout);
    }, [step, code, isPlaying, isMuted, fullCode, fixedCode, onComplete]);

    return (
        <div className="w-full h-full bg-[#0f172a] p-8 font-mono text-sm sm:text-base relative overflow-hidden">
            {/* Window Header */}
            <div className="flex items-center gap-2 mb-4 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-slate-400">payment_service.js</span>
            </div>

            {/* Code Area */}
            <div className="relative z-10">
                <pre className="text-slate-300 whitespace-pre-wrap">
                    <code dangerouslySetInnerHTML={{
                        __html: code
                            .replace('function', '<span class="text-purple-400">function</span>')
                            .replace('return', '<span class="text-purple-400">return</span>')
                            .replace('if', '<span class="text-purple-400">if</span>')
                            .replace('throw', '<span class="text-purple-400">throw</span>')
                            .replace('new', '<span class="text-purple-400">new</span>')
                            .replace('Error', '<span class="text-yellow-400">Error</span>')
                            .replace('// AI Fix: Added null check', '<span class="text-green-400 font-bold">// AI Fix: Added null check</span>')
                    }} />
                    {step === 0 && <span className="animate-pulse inline-block w-2 h-4 bg-blue-400 ml-1 align-middle" />}
                </pre>
            </div>

            {/* Error Overlay */}
            <AnimatePresence>
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-8 right-8 bg-red-500/10 border border-red-500/50 p-4 rounded-xl backdrop-blur-md flex items-center gap-3 max-w-sm"
                    >
                        <div className="p-2 bg-red-500 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-red-400 font-bold">Runtime Error Detected</h4>
                            <p className="text-red-200/70 text-xs">Cannot read properties of undefined (reading 'balance')</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Scanning Overlay */}
            <AnimatePresence>
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px] flex items-center justify-center"
                    >
                        <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping" />
                                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Cpu className="w-10 h-10 text-blue-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">DebugMate AI Analysis</h3>
                            <p className="text-blue-300">Generating fix...</p>
                        </div>
                        {/* Scan line */}
                        <motion.div
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Overlay */}
            <AnimatePresence>
                {step >= 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring" }}
                        className="absolute top-8 right-8 bg-green-500/10 border border-green-500/50 p-4 rounded-xl backdrop-blur-md flex items-center gap-3"
                    >
                        <div className="p-2 bg-green-500 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-green-400 font-bold">Bug Fixed</h4>
                            <p className="text-green-200/70 text-xs">+50 XP Earned</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Modal Component ---
export const DemoVideoModal = ({ isOpen, onClose }: DemoVideoModalProps) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Auto-play when opened
    useEffect(() => {
        if (isOpen) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
                    >
                        <div className="bg-[#0f172a] w-full max-w-6xl aspect-video rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative pointer-events-auto group">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all z-30 opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Simulated Video Player */}
                            <div className="w-full h-full relative bg-black group/video cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                                <SimulatedDemo
                                    isPlaying={isPlaying}
                                    isMuted={isMuted}
                                    onComplete={() => { }}
                                />

                                {/* Central Play Button (visible when paused) */}
                                {!isPlaying && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-transform"
                                        >
                                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                                        </motion.div>
                                    </div>
                                )}

                                {/* Overlay Controls */}
                                <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover/video:opacity-100' : 'opacity-100'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsPlaying(!isPlaying);
                                                }}
                                                className="p-4 bg-white text-black rounded-full hover:scale-105 transition-transform shadow-lg shadow-white/10"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-6 h-6 fill-current" />
                                                ) : (
                                                    <Play className="w-6 h-6 fill-current ml-1" />
                                                )}
                                            </button>
                                            <div>
                                                <h3 className="text-white font-bold text-xl mb-1">DebugMate Live Demo</h3>
                                                <p className="text-slate-300 text-sm">Real-time AI error resolution</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsMuted(!isMuted);
                                            }}
                                            className="p-3 text-white hover:bg-white/10 rounded-full transition-colors backdrop-blur-md bg-black/20 border border-white/10"
                                        >
                                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
