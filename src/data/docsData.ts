import { Rocket, Zap, Brain, Shield, Code2, Terminal, BookOpen, Target } from 'lucide-react';

export interface Article {
    id: string;
    title: string;
    description: string;
    readTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    content: string;
    codeExamples: number;
    hasVideo: boolean;
    apiEndpoints: number;
}

export interface DocSection {
    id: string;
    title: string;
    icon: any;
    description: string;
    articles: Article[];
}

export const docsData: DocSection[] = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: Rocket,
        description: 'Quick start guides and essential concepts',
        articles: [
            {
                id: '1',
                title: 'Installation & Setup',
                description: 'Get DebugMate running in your project in under 2 minutes',
                readTime: '3 min',
                difficulty: 'beginner',
                tags: ['setup', 'installation', 'quickstart'],
                content: '# Installation\n\nRun `npm install debugmate`...',
                codeExamples: 2,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: '2',
                title: 'Your First AI-Powered Fix',
                description: 'Learn how to analyze and fix your first error with AI assistance',
                readTime: '5 min',
                difficulty: 'beginner',
                tags: ['tutorial', 'ai', 'debugging'],
                content: '# First Fix\n\n...',
                codeExamples: 3,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: '3',
                title: 'Understanding AI Analysis',
                description: 'Deep dive into how our AI understands and solves your code issues',
                readTime: '8 min',
                difficulty: 'intermediate',
                tags: ['ai', 'concepts', 'analysis'],
                content: '# AI Analysis\n\n...',
                codeExamples: 1,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: 'gs-4',
                title: 'Workspace Configuration',
                description: 'Setting up your development environment for optimal debugging',
                readTime: '5 min',
                difficulty: 'beginner',
                tags: ['workspace', 'config'],
                content: '',
                codeExamples: 4,
                hasVideo: false,
                apiEndpoints: 0
            },
            {
                id: 'gs-5',
                title: 'Team Collaboration',
                description: 'Inviting team members and sharing debugging sessions',
                readTime: '4 min',
                difficulty: 'beginner',
                tags: ['team', 'collaboration'],
                content: '',
                codeExamples: 0,
                hasVideo: true,
                apiEndpoints: 0
            }
        ]
    },
    {
        id: 'core-features',
        title: 'Core Features',
        icon: Zap,
        description: 'Master the powerful features of DebugMate',
        articles: [
            {
                id: '4',
                title: 'Auto-Fix Engine',
                description: 'Automatic code generation and intelligent error resolution',
                readTime: '10 min',
                difficulty: 'intermediate',
                tags: ['auto-fix', 'ai', 'automation'],
                content: '# Auto-Fix\n\n...',
                codeExamples: 5,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: '5',
                title: 'Prevention Mode',
                description: 'Catch bugs before they reach production with predictive analysis',
                readTime: '7 min',
                difficulty: 'intermediate',
                tags: ['prevention', 'proactive', 'security'],
                content: '# Prevention\n\n...',
                codeExamples: 2,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: '6',
                title: 'Error Clustering & Patterns',
                description: 'Identify systemic issues through intelligent error grouping',
                readTime: '6 min',
                difficulty: 'advanced',
                tags: ['clustering', 'patterns', 'analytics'],
                content: '# Clustering\n\n...',
                codeExamples: 1,
                hasVideo: false,
                apiEndpoints: 0
            },
            {
                id: '7',
                title: 'Real-time Analytics Dashboard',
                description: 'Monitor your codebase health with live metrics and insights',
                readTime: '5 min',
                difficulty: 'beginner',
                tags: ['analytics', 'dashboard', 'monitoring'],
                content: '# Analytics\n\n...',
                codeExamples: 0,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: 'cf-5',
                title: 'Smart Notifications',
                description: 'Configuring alerts for critical errors and system events',
                readTime: '4 min',
                difficulty: 'beginner',
                tags: ['notifications', 'alerts'],
                content: '',
                codeExamples: 2,
                hasVideo: false,
                apiEndpoints: 0
            },
            {
                id: 'cf-6',
                title: 'Custom Rules Engine',
                description: 'Define your own error detection rules and patterns',
                readTime: '15 min',
                difficulty: 'advanced',
                tags: ['rules', 'customization'],
                content: '',
                codeExamples: 8,
                hasVideo: true,
                apiEndpoints: 0
            }
        ]
    },
    {
        id: 'advanced',
        title: 'Advanced Usage',
        icon: Brain,
        description: 'Expert techniques and optimization strategies',
        articles: [
            {
                id: '8',
                title: 'Custom AI Training',
                description: 'Train the AI on your codebase patterns for better accuracy',
                readTime: '15 min',
                difficulty: 'advanced',
                tags: ['ai', 'training', 'customization'],
                content: '# Training\n\n...',
                codeExamples: 6,
                hasVideo: true,
                apiEndpoints: 2
            },
            {
                id: '9',
                title: 'CI/CD Integration',
                description: 'Integrate DebugMate into your deployment pipeline',
                readTime: '12 min',
                difficulty: 'advanced',
                tags: ['ci/cd', 'devops', 'automation'],
                content: '# CI/CD\n\n...',
                codeExamples: 4,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: '10',
                title: 'Performance Optimization',
                description: 'Optimize DebugMate for large-scale enterprise applications',
                readTime: '10 min',
                difficulty: 'advanced',
                tags: ['performance', 'optimization', 'enterprise'],
                content: '# Performance\n\n...',
                codeExamples: 3,
                hasVideo: false,
                apiEndpoints: 0
            },
            {
                id: 'adv-4',
                title: 'Monorepo Configuration',
                description: 'Best practices for using DebugMate in monorepo architectures',
                readTime: '12 min',
                difficulty: 'advanced',
                tags: ['monorepo', 'architecture'],
                content: '',
                codeExamples: 5,
                hasVideo: false,
                apiEndpoints: 0
            },
            {
                id: 'adv-5',
                title: 'Plugin Development',
                description: 'Create custom plugins to extend DebugMate functionality',
                readTime: '20 min',
                difficulty: 'advanced',
                tags: ['plugins', 'development'],
                content: '',
                codeExamples: 12,
                hasVideo: true,
                apiEndpoints: 5
            }
        ]
    },
    {
        id: 'security',
        title: 'Security & Privacy',
        icon: Shield,
        description: 'Keep your code secure and private',
        articles: [
            {
                id: '11',
                title: 'Data Privacy & Encryption',
                description: 'How we protect your code and maintain zero-knowledge architecture',
                readTime: '6 min',
                difficulty: 'intermediate',
                tags: ['security', 'privacy', 'encryption'],
                content: '# Security\n\n...',
                codeExamples: 1,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: '12',
                title: 'Vulnerability Detection',
                description: 'Automatic security vulnerability scanning and remediation',
                readTime: '8 min',
                difficulty: 'intermediate',
                tags: ['security', 'vulnerabilities', 'scanning'],
                content: '# Vulnerabilities\n\n...',
                codeExamples: 3,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: 'sec-3',
                title: 'Audit Logs',
                description: 'Tracking and auditing all system activities and access',
                readTime: '5 min',
                difficulty: 'intermediate',
                tags: ['audit', 'compliance'],
                content: '',
                codeExamples: 2,
                hasVideo: false,
                apiEndpoints: 4
            },
            {
                id: 'sec-4',
                title: 'SSO Integration',
                description: 'Setting up Single Sign-On with Okta, Google, and Azure AD',
                readTime: '10 min',
                difficulty: 'advanced',
                tags: ['sso', 'auth', 'enterprise'],
                content: '',
                codeExamples: 4,
                hasVideo: true,
                apiEndpoints: 2
            }
        ]
    },
    {
        id: 'api',
        title: 'API Reference',
        icon: Terminal,
        description: 'Complete API documentation and SDK guides',
        articles: [
            {
                id: '13',
                title: 'REST API Overview',
                description: 'Complete reference for DebugMate REST API endpoints',
                readTime: '20 min',
                difficulty: 'advanced',
                tags: ['api', 'rest', 'reference'],
                content: '# API\n\n...',
                codeExamples: 15,
                hasVideo: false,
                apiEndpoints: 45
            },
            {
                id: '14',
                title: 'SDK Documentation',
                description: 'JavaScript, Python, and Go SDK usage guides',
                readTime: '15 min',
                difficulty: 'intermediate',
                tags: ['sdk', 'libraries', 'integration'],
                content: '# SDK\n\n...',
                codeExamples: 25,
                hasVideo: true,
                apiEndpoints: 0
            },
            {
                id: 'api-3',
                title: 'Authentication',
                description: 'Handling API keys, tokens, and request signing',
                readTime: '8 min',
                difficulty: 'intermediate',
                tags: ['auth', 'security'],
                content: '',
                codeExamples: 6,
                hasVideo: false,
                apiEndpoints: 3
            },
            {
                id: 'api-4',
                title: 'Rate Limiting',
                description: 'Understanding API limits and handling 429 responses',
                readTime: '5 min',
                difficulty: 'intermediate',
                tags: ['limits', 'headers'],
                content: '',
                codeExamples: 3,
                hasVideo: false,
                apiEndpoints: 0
            },
            {
                id: 'api-5',
                title: 'Webhooks',
                description: 'Receiving real-time event notifications via webhooks',
                readTime: '10 min',
                difficulty: 'advanced',
                tags: ['webhooks', 'events'],
                content: '',
                codeExamples: 8,
                hasVideo: true,
                apiEndpoints: 5
            }
        ]
    }
];
