import { Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface LevelProgressProps {
    level?: number;
    xp?: number;
    maxXp?: number;
}

export const LevelProgress = ({ level = 5, xp = 750, maxXp = 1000 }: LevelProgressProps) => {
    const progress = (xp / maxXp) * 100;

    return (
        <div className="glass-card p-4 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="font-bold text-white">Level {level}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{xp} / {maxXp} XP</span>
                </div>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative z-10">
                <motion.div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
            </div>

            <div className="mt-2 text-xs text-slate-500 text-right relative z-10">
                {maxXp - xp} XP to next level
            </div>
        </div>
    );
};
