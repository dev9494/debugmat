import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

interface EmailCaptureProps {
    source?: string;
}

export const EmailCapture = ({ source = 'landing' }: EmailCaptureProps) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setStatus('loading');

        try {
            // In production, integrate with your email service (ConvertKit, Mailchimp, etc.)
            // For now, we'll save to Firestore
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source }),
            });

            if (response.ok) {
                setStatus('success');
                setMessage('Thanks! Check your inbox for updates.');
                setEmail('');

                // Track in analytics
                if (typeof window.gtag !== 'undefined') {
                    window.gtag('event', 'email_signup', {
                        event_category: 'Marketing',
                        event_label: source,
                    });
                }
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{message}</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        disabled={status === 'loading'}
                    />
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Subscribing...</span>
                        </>
                    ) : (
                        <span>Get Updates</span>
                    )}
                </button>
            </div>
            {status === 'error' && (
                <p className="mt-2 text-sm text-red-400">{message}</p>
            )}
        </form>
    );
};
