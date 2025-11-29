// Google Analytics 4 Integration
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

// Track page views
export const pageview = (url: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        });
    }
};

// Track custom events
export const event = ({ action, category, label, value }: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Track error analysis
export const trackErrorAnalysis = (errorType: string, severity: string) => {
    event({
        action: 'error_analyzed',
        category: 'Analysis',
        label: `${errorType} - ${severity}`,
    });
};

// Track user signup
export const trackSignup = (method: string) => {
    event({
        action: 'sign_up',
        category: 'User',
        label: method,
    });
};

// Track subscription upgrade
export const trackUpgrade = (tier: string) => {
    event({
        action: 'upgrade',
        category: 'Subscription',
        label: tier,
    });
};

// Track feature usage
export const trackFeatureUsage = (feature: string) => {
    event({
        action: 'feature_used',
        category: 'Features',
        label: feature,
    });
};

// Extend Window interface for TypeScript
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}
