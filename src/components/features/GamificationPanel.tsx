import { Trophy, Award, Flame, Star, TrendingUp } from 'lucide-react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { cn } from '../../lib/utils';

export const GamificationPanel = () => {
    const { stats } = useGamificationStore();

    const pointsToNextLevel = (stats.level * 1000) - stats.totalPoints;
    const progressToNextLevel = ((stats.totalPoints % 1000) / 1000) * 100;

    return (
        <div className="space-y-6 animate-up">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
                    <span className="text-gradient-gold">Your Progress</span>
                </h2>
                <p className="text-base text-muted-foreground">
                    Track your debugging achievements and level up!
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Level */}
                <div className="glass-card p-5 rounded-xl border-yellow-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-yellow-400 font-semibold">Level</span>
                    </div>
                    <p className="text-4xl font-bold text-white relative z-10">{stats.level}</p>
                </div>

                {/* Points */}
                <div className="glass-card p-5 rounded-xl border-blue-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-blue-400 font-semibold">Points</span>
                    </div>
                    <p className="text-4xl font-bold text-white relative z-10">{stats.totalPoints}</p>
                </div>

                {/* Streak */}
                <div className="glass-card p-5 rounded-xl border-orange-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <span className="text-sm text-orange-400 font-semibold">Streak</span>
                    </div>
                    <p className="text-4xl font-bold text-white relative z-10">{stats.streak} days</p>
                </div>

                {/* Errors Fixed */}
                <div className="glass-card p-5 rounded-xl border-green-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                        <Award className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-green-400 font-semibold">Fixed</span>
                    </div>
                    <p className="text-4xl font-bold text-white relative z-10">{stats.totalErrorsFixed}</p>
                </div>
            </div>

            {/* Level Progress */}
            <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">Level {stats.level} Progress</h3>
                    <span className="text-sm text-muted-foreground">
                        {pointsToNextLevel} points to Level {stats.level + 1}
                    </span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 relative z-10"
                        style={{ width: `${progressToNextLevel}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={cn(
                                'border rounded-xl p-4 transition-all',
                                achievement.unlockedAt
                                    ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 shadow-lg shadow-yellow-500/5'
                                    : 'bg-white/5 border-white/10 opacity-60'
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-4xl filter drop-shadow-md">{achievement.icon}</span>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-white mb-1">
                                        {achievement.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {achievement.description}
                                    </p>
                                    {!achievement.unlockedAt && (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Progress</span>
                                                <span>
                                                    {achievement.progress}/{achievement.maxProgress}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                    style={{
                                                        width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {achievement.unlockedAt && (
                                        <p className="text-xs text-yellow-400 font-semibold animate-pulse">
                                            ✨ Unlocked!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboard Teaser */}
            <div className="glass-card p-6 rounded-xl text-center border-purple-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <Trophy className="w-12 h-12 text-purple-400 mx-auto mb-3 animate-float" />
                    <h3 className="text-xl font-bold text-white mb-2">Team Leaderboard</h3>
                    <p className="text-base text-muted-foreground mb-4">
                        Coming soon! Compete with your team and climb the ranks.
                    </p>
                    <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                        Join Waitlist
                    </button>
                </div>
            </div>
        </div>
    );
};
