import React from 'react';
import { Scale, FileCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to App
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <Scale className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold">Terms of Service</h1>
                </div>

                <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileCheck className="w-5 h-5" />
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using DebugMate ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">2. Description of Service</h2>
                        <p>
                            DebugMate is an AI-powered debugging assistant that helps developers analyze errors and find solutions. We provide both free and paid subscription plans.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">3. User Accounts</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">4. Subscriptions and Payments</h2>
                        <p>
                            Paid subscriptions are billed in advance on a monthly basis. You may cancel your subscription at any time, but we do not provide refunds for partial months. Payments are processed securely via Stripe.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            5. Disclaimer of Warranties
                        </h2>
                        <p>
                            The Service is provided "as is" and "as available" without warranties of any kind. While our AI strives for accuracy, we cannot guarantee that the code solutions provided will be error-free or suitable for your specific production environment. You use the generated code at your own risk.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, DebugMate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits or data, arising out of your use of the Service.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-border text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
};
