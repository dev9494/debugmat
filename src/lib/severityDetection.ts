import type { ErrorSeverity } from '../stores/errorStore';

interface SeverityAnalysis {
    severity: ErrorSeverity;
    confidence: number;
    reasoning: string;
    businessImpact: {
        usersAffected: 'none' | 'few' | 'some' | 'many' | 'all';
        revenueImpact: 'none' | 'low' | 'medium' | 'high' | 'critical';
        urgency: 'low' | 'medium' | 'high' | 'critical';
    };
}

export const detectSeverity = (errorMessage: string, errorType: string, rootCause?: string): SeverityAnalysis => {
    const message = errorMessage.toLowerCase();
    const type = errorType.toLowerCase();
    const cause = rootCause?.toLowerCase() || '';

    // Critical severity indicators
    const criticalKeywords = [
        'cannot connect to database',
        'database connection failed',
        'payment failed',
        'authentication failed',
        'security breach',
        'data loss',
        'corruption',
        'crash',
        'fatal',
        'segmentation fault',
        'out of memory',
        'memory leak',
        'server down',
        'service unavailable',
        'cannot start',
        'critical error',
    ];

    // High severity indicators
    const highKeywords = [
        'undefined is not',
        'cannot read property',
        'cannot access',
        'permission denied',
        'unauthorized',
        'forbidden',
        'timeout',
        'network error',
        'connection refused',
        'failed to fetch',
        'api error',
        'server error',
        '500',
        '503',
        'exception',
    ];

    // Medium severity indicators
    const mediumKeywords = [
        'warning',
        'deprecated',
        'not found',
        '404',
        'invalid',
        'missing',
        'unexpected',
        'failed to load',
        'could not',
        'unable to',
    ];

    // Low severity indicators
    const lowKeywords = [
        'info',
        'debug',
        'notice',
        'suggestion',
        'recommendation',
        'optional',
    ];

    // Check for critical errors
    if (criticalKeywords.some(keyword => message.includes(keyword) || type.includes(keyword) || cause.includes(keyword))) {
        return {
            severity: 'critical',
            confidence: 0.95,
            reasoning: 'System-critical error detected. Immediate action required.',
            businessImpact: {
                usersAffected: 'all',
                revenueImpact: 'critical',
                urgency: 'critical',
            },
        };
    }

    // Check for high severity
    if (highKeywords.some(keyword => message.includes(keyword) || type.includes(keyword) || cause.includes(keyword))) {
        return {
            severity: 'high',
            confidence: 0.85,
            reasoning: 'Significant error affecting core functionality.',
            businessImpact: {
                usersAffected: 'many',
                revenueImpact: 'high',
                urgency: 'high',
            },
        };
    }

    // Check for medium severity
    if (mediumKeywords.some(keyword => message.includes(keyword) || type.includes(keyword) || cause.includes(keyword))) {
        return {
            severity: 'medium',
            confidence: 0.75,
            reasoning: 'Non-critical error with moderate impact.',
            businessImpact: {
                usersAffected: 'some',
                revenueImpact: 'medium',
                urgency: 'medium',
            },
        };
    }

    // Check for low severity
    if (lowKeywords.some(keyword => message.includes(keyword) || type.includes(keyword) || cause.includes(keyword))) {
        return {
            severity: 'low',
            confidence: 0.65,
            reasoning: 'Minor issue with minimal impact.',
            businessImpact: {
                usersAffected: 'few',
                revenueImpact: 'low',
                urgency: 'low',
            },
        };
    }

    // Default to medium if uncertain
    return {
        severity: 'medium',
        confidence: 0.5,
        reasoning: 'Unable to determine severity. Manual review recommended.',
        businessImpact: {
            usersAffected: 'some',
            revenueImpact: 'medium',
            urgency: 'medium',
        },
    };
};

export const getSeverityColor = (severity: ErrorSeverity): {
    bg: string;
    border: string;
    text: string;
    icon: string;
    gradient: string;
} => {
    switch (severity) {
        case 'critical':
            return {
                bg: 'bg-red-500/10',
                border: 'border-red-500/30',
                text: 'text-red-400',
                icon: '🔴',
                gradient: 'from-red-500/20 to-red-600/20',
            };
        case 'high':
            return {
                bg: 'bg-orange-500/10',
                border: 'border-orange-500/30',
                text: 'text-orange-400',
                icon: '🟠',
                gradient: 'from-orange-500/20 to-orange-600/20',
            };
        case 'medium':
            return {
                bg: 'bg-yellow-500/10',
                border: 'border-yellow-500/30',
                text: 'text-yellow-400',
                icon: '🟡',
                gradient: 'from-yellow-500/20 to-yellow-600/20',
            };
        case 'low':
            return {
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/30',
                text: 'text-blue-400',
                icon: '🔵',
                gradient: 'from-blue-500/20 to-blue-600/20',
            };
        default:
            return {
                bg: 'bg-gray-500/10',
                border: 'border-gray-500/30',
                text: 'text-gray-400',
                icon: '⚪',
                gradient: 'from-gray-500/20 to-gray-600/20',
            };
    }
};

export const getSeverityLabel = (severity: ErrorSeverity): string => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
};

export const getSeverityPriority = (severity: ErrorSeverity): number => {
    switch (severity) {
        case 'critical':
            return 4;
        case 'high':
            return 3;
        case 'medium':
            return 2;
        case 'low':
            return 1;
        default:
            return 0;
    }
};

export const estimateBusinessImpact = (severity: ErrorSeverity): {
    usersAffected: string;
    estimatedRevenueLoss: string;
    recommendedAction: string;
    timeToFix: string;
} => {
    switch (severity) {
        case 'critical':
            return {
                usersAffected: '100% of users',
                estimatedRevenueLoss: '$1,000 - $10,000/hour',
                recommendedAction: 'Drop everything and fix immediately',
                timeToFix: '< 1 hour',
            };
        case 'high':
            return {
                usersAffected: '50-100% of users',
                estimatedRevenueLoss: '$100 - $1,000/hour',
                recommendedAction: 'Fix within 24 hours',
                timeToFix: '2-4 hours',
            };
        case 'medium':
            return {
                usersAffected: '10-50% of users',
                estimatedRevenueLoss: '$10 - $100/hour',
                recommendedAction: 'Fix within this sprint',
                timeToFix: '4-8 hours',
            };
        case 'low':
            return {
                usersAffected: '< 10% of users',
                estimatedRevenueLoss: '< $10/hour',
                recommendedAction: 'Fix when convenient',
                timeToFix: '1-2 days',
            };
        default:
            return {
                usersAffected: 'Unknown',
                estimatedRevenueLoss: 'Unknown',
                recommendedAction: 'Assess and prioritize',
                timeToFix: 'Unknown',
            };
    }
};
