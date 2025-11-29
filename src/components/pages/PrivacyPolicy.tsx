import React from 'react';
import { Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to App
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                </div>

                <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            1. Information We Collect
                        </h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Account information (name, email, profile picture)</li>
                            <li>Code snippets and error messages you submit for analysis</li>
                            <li>Usage data and interaction with our services</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            2. How We Use Your Data
                        </h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process your transactions and manage your subscription</li>
                            <li>Send you technical notices, updates, and support messages</li>
                            <li>Analyze trends and usage to optimize user experience</li>
                        </ul>
                        <p className="p-4 bg-muted/50 rounded-lg border border-border mt-4">
                            <strong>Important:</strong> We do not sell your personal code snippets or error logs to third parties. Your debugging data is used solely to provide you with the analysis service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">3. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">4. Third-Party Services</h2>
                        <p>
                            We use trusted third-party services to operate our business:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Google Firebase:</strong> For authentication and database hosting</li>
                            <li><strong>Stripe:</strong> For payment processing (we do not store credit card details)</li>
                            <li><strong>Google Gemini API:</strong> For AI analysis of your code</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br />
                            <a href="mailto:support@debugmate.com" className="text-primary hover:underline">support@debugmate.com</a>
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
