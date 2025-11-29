import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Shield, Star } from 'lucide-react';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

export const PricingModal = () => {
    const { showPricingModal, setShowPricingModal, upgradeToPremium } = useSubscriptionStore();

    if (!showPricingModal) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Free Tier */}
                    <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-border bg-muted/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-slate-200 dark:bg-slate-800">
                                <Shield className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Starter</h3>
                                <p className="text-sm text-muted-foreground">For casual debugging</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold text-foreground">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm text-foreground">
                                <Check className="w-5 h-5 text-green-500" />
                                5 AI Analyses per month
                            </li>
                            <li className="flex items-center gap-3 text-sm text-foreground">
                                <Check className="w-5 h-5 text-green-500" />
                                Basic Error Explanations
                            </li>
                            <li className="flex items-center gap-3 text-sm text-foreground">
                                <Check className="w-5 h-5 text-green-500" />
                                Community Support
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <X className="w-5 h-5" />
                                No Advanced Solutions
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <X className="w-5 h-5" />
                                No History Retention
                            </li>
                        </ul>

                        <button
                            onClick={() => setShowPricingModal(false)}
                            className="w-full py-3 rounded-xl border border-border font-semibold hover:bg-accent transition-colors"
                        >
                            Continue Free
                        </button>
                    </div>

                    {/* Premium Tier */}
                    <div className="flex-1 p-8 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
                            RECOMMENDED
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-primary/20">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Pro Developer</h3>
                                <p className="text-sm text-muted-foreground">For serious coding</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold text-foreground">$19</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm text-foreground">
                                <div className="p-0.5 rounded-full bg-green-500/20">
                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="font-medium">Unlimited AI Analyses</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-foreground">
                                <div className="p-0.5 rounded-full bg-green-500/20">
                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                Advanced Solution Generation
                            </li>
                            <li className="flex items-center gap-3 text-sm text-foreground">
                                <div className="p-0.5 rounded-full bg-green-500/20">
                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                Priority Support
                            </li>
                            <li className="flex items-center gap-3 text-sm text-foreground">
                                <div className="p-0.5 rounded-full bg-green-500/20">
                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                Unlimited History
                            </li>
                            <li className="flex items-center gap-3 text-sm text-foreground">
                                <div className="p-0.5 rounded-full bg-green-500/20">
                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                VS Code Extension Access
                            </li>
                        </ul>

                        <button
                            onClick={upgradeToPremium}
                            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Star className="w-5 h-5 fill-current" />
                            Upgrade to Pro
                        </button>

                        <p className="text-xs text-center mt-4 text-muted-foreground">
                            Secure payment via Stripe. Cancel anytime.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
