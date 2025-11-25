export interface CodeIssue {
    id: string;
    type: 'vulnerability' | 'deprecation' | 'performance' | 'breaking-change' | 'best-practice';
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    file: string;
    line?: number;
    suggestion: string;
    autoFixable: boolean;
}

export interface PreventionScanResult {
    totalIssues: number;
    criticalIssues: number;
    vulnerabilities: CodeIssue[];
    deprecations: CodeIssue[];
    performanceIssues: CodeIssue[];
    breakingChanges: CodeIssue[];
    bestPractices: CodeIssue[];
    score: number; // 0-100
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

// Simulate code scanning (in production, this would use real static analysis tools)
export const scanCode = async (code: string, language: string): Promise<PreventionScanResult> => {
    const issues: CodeIssue[] = [];

    // Check for common vulnerabilities
    if (code.includes('eval(')) {
        issues.push({
            id: 'vuln-1',
            type: 'vulnerability',
            severity: 'critical',
            title: 'Dangerous eval() usage',
            description: 'Using eval() can lead to code injection vulnerabilities',
            file: 'current-file.js',
            line: code.split('\n').findIndex(line => line.includes('eval(')) + 1,
            suggestion: 'Use JSON.parse() or a safer alternative',
            autoFixable: false,
        });
    }

    if (code.includes('innerHTML')) {
        issues.push({
            id: 'vuln-2',
            type: 'vulnerability',
            severity: 'high',
            title: 'XSS vulnerability with innerHTML',
            description: 'Setting innerHTML with user input can lead to XSS attacks',
            file: 'current-file.js',
            line: code.split('\n').findIndex(line => line.includes('innerHTML')) + 1,
            suggestion: 'Use textContent or sanitize input with DOMPurify',
            autoFixable: true,
        });
    }

    // Check for deprecated features
    if (code.includes('componentWillMount')) {
        issues.push({
            id: 'dep-1',
            type: 'deprecation',
            severity: 'medium',
            title: 'Deprecated React lifecycle method',
            description: 'componentWillMount is deprecated in React 16.9+',
            file: 'current-file.jsx',
            line: code.split('\n').findIndex(line => line.includes('componentWillMount')) + 1,
            suggestion: 'Use componentDidMount or useEffect hook instead',
            autoFixable: true,
        });
    }

    // Check for performance issues
    if (code.match(/map\(.*\)\.map\(/)) {
        issues.push({
            id: 'perf-1',
            type: 'performance',
            severity: 'medium',
            title: 'Multiple array iterations',
            description: 'Chaining multiple map() calls is inefficient',
            file: 'current-file.js',
            suggestion: 'Combine into a single map() or use reduce()',
            autoFixable: true,
        });
    }

    if (code.includes('for (') && code.includes('.length')) {
        const forLoops = code.match(/for\s*\([^)]*\.length[^)]*\)/g);
        if (forLoops && forLoops.length > 0) {
            issues.push({
                id: 'perf-2',
                type: 'performance',
                severity: 'low',
                title: 'Inefficient loop condition',
                description: 'Accessing .length in loop condition on every iteration',
                file: 'current-file.js',
                suggestion: 'Cache array length before loop',
                autoFixable: true,
            });
        }
    }

    // Check for best practices
    if (code.includes('var ')) {
        issues.push({
            id: 'bp-1',
            type: 'best-practice',
            severity: 'low',
            title: 'Use const/let instead of var',
            description: 'var has function scope and can lead to bugs',
            file: 'current-file.js',
            suggestion: 'Use const for constants, let for variables',
            autoFixable: true,
        });
    }

    if (code.includes('console.log') && !code.includes('// DEBUG')) {
        issues.push({
            id: 'bp-2',
            type: 'best-practice',
            severity: 'low',
            title: 'Console.log in production code',
            description: 'Remove console.log statements before deploying',
            file: 'current-file.js',
            suggestion: 'Use a proper logging library or remove',
            autoFixable: true,
        });
    }

    // Categorize issues
    const vulnerabilities = issues.filter(i => i.type === 'vulnerability');
    const deprecations = issues.filter(i => i.type === 'deprecation');
    const performanceIssues = issues.filter(i => i.type === 'performance');
    const breakingChanges = issues.filter(i => i.type === 'breaking-change');
    const bestPractices = issues.filter(i => i.type === 'best-practice');

    // Calculate score
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;
    const lowIssues = issues.filter(i => i.severity === 'low').length;

    const score = Math.max(
        0,
        100 - (criticalIssues * 20 + highIssues * 10 + mediumIssues * 5 + lowIssues * 2)
    );

    const grade =
        score >= 95 ? 'A+' :
            score >= 90 ? 'A' :
                score >= 80 ? 'B' :
                    score >= 70 ? 'C' :
                        score >= 60 ? 'D' : 'F';

    return {
        totalIssues: issues.length,
        criticalIssues,
        vulnerabilities,
        deprecations,
        performanceIssues,
        breakingChanges,
        bestPractices,
        score,
        grade,
    };
};

// Auto-fix simple issues
export const autoFixIssue = (code: string, issue: CodeIssue): string => {
    if (!issue.autoFixable) return code;

    switch (issue.id) {
        case 'vuln-2':
            return code.replace(/\.innerHTML\s*=/g, '.textContent =');
        case 'dep-1':
            return code.replace(/componentWillMount/g, 'componentDidMount');
        case 'bp-1':
            return code.replace(/\bvar\b/g, 'const');
        case 'bp-2':
            return code.replace(/console\.log\([^)]*\);?/g, '');
        default:
            return code;
    }
};
