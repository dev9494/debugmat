import { Shield, Check, AlertTriangle, Lock, Activity } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { cn } from '../../lib/utils';

export const PreventionScanner = () => {
    const { tier } = useUserStore();
    const isPro = tier !== 'free';

    return (
        <div className="flex flex-col h-full">
            <div className="p-5 border-b border-white/5">
                <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="p-1.5 rounded-md bg-purple-500/10">
                        <Shield className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-xl text-white">Prevention Scanner</h3>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                    Prevent errors before they happen with real-time analysis.
                </p>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                {/* ESLint Rule Card */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold uppercase tracking-wider text-muted-foreground">Recommended ESLint Rule</h4>
                        {!isPro && <Lock className="w-3 h-3 text-muted-foreground" />}
                    </div>

                    <div className={cn(
                        "relative rounded-xl overflow-hidden border border-white/5 bg-[#141414] transition-all duration-300 group",
                        !isPro && "opacity-80"
                    )}>
                        <div className={cn("p-4 font-mono text-sm overflow-x-auto", !isPro && "blur-[3px] select-none")}>
                            <span className="text-purple-400">"rules"</span>: {'{'}
                            <br />
                            &nbsp;&nbsp;<span className="text-green-400">"react/no-unknown-property"</span>: <span className="text-yellow-400">"error"</span>
                            <br />
                            {'}'}
                        </div>

                        {!isPro && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 text-center">
                                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-purple-500/20 transform hover:scale-105 transition-all">
                                    ✨ Upgrade to View
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Project Health Widget */}
                <div className="space-y-3">
                    <h4 className="text-base font-bold uppercase tracking-wider text-muted-foreground">Project Health</h4>
                    <div className="rounded-xl border border-white/5 bg-[#141414] p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-base text-muted-foreground mb-1">Overall Score</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">A-</span>
                                    <span className="text-xl text-green-400 font-semibold">82%</span>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-full border-4 border-green-500/20 border-t-green-500 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-green-500" />
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[82%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-base text-gray-300">
                                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                <span>3 Potential Issues</span>
                            </div>
                            <div className="flex items-center gap-2 text-base text-gray-300">
                                <Check className="w-3 h-3 text-green-500" />
                                <span>47 Checks Passed</span>
                            </div>
                        </div>

                        <button className={cn(
                            "w-full mt-4 py-2.5 rounded-lg text-base font-semibold transition-all",
                            isPro
                                ? "bg-white/5 hover:bg-white/10 text-white"
                                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                        )}>
                            {isPro ? "Run Full Scan" : "Unlock Pro Scanner"}
                        </button>
                    </div>
                </div>

                {/* Team Insights */}
                <div className="space-y-3">
                    <h4 className="text-base font-bold uppercase tracking-wider text-muted-foreground">Team Insights</h4>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                        <div className="p-1 rounded-full bg-green-500/10 mt-0.5">
                            <Check className="w-3 h-3 text-green-500" />
                        </div>
                        <p className="text-base text-gray-300 leading-relaxed">
                            No other team members have reported this error recently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
