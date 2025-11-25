import { X, Play, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DemoVideoModal = ({ isOpen, onClose }: DemoVideoModalProps) => {
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
                    >
                        <div className="bg-[#0f172a] w-full max-w-5xl aspect-video rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative pointer-events-auto group">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all z-20 opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Video Player */}
                            <div className="w-full h-full relative bg-black">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    poster="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
                                >
                                    <source src="https://assets.mixkit.co/videos/preview/mixkit-programming-codes-on-a-monitor-close-up-1658-large.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Overlay Controls */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => {
                                                    if (videoRef.current) {
                                                        if (videoRef.current.paused) videoRef.current.play();
                                                        else videoRef.current.pause();
                                                    }
                                                }}
                                                className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
                                            >
                                                <Play className="w-5 h-5 fill-current" />
                                            </button>
                                            <div>
                                                <h3 className="text-white font-bold text-lg">DebugMate in Action</h3>
                                                <p className="text-slate-300 text-sm">See how AI fixes your bugs in real-time</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setIsMuted(!isMuted)}
                                            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
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
