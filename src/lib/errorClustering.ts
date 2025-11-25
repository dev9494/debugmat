import type { ErrorHistoryItem, ErrorSeverity } from '../stores/errorStore';

export interface ErrorCluster {
    id: string;
    name: string;
    errorType: string;
    count: number;
    severity: ErrorSeverity;
    errors: ErrorHistoryItem[];
    commonPattern: string;
    rootCause?: string;
    affectedFiles: string[];
    firstSeen: number;
    lastSeen: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}

// Calculate similarity between two error messages
const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size; // Jaccard similarity
};

// Extract common pattern from similar errors
const extractCommonPattern = (errors: ErrorHistoryItem[]): string => {
    if (errors.length === 0) return '';
    if (errors.length === 1) return errors[0].errorMessage;

    const messages = errors.map(e => e.errorMessage);
    const words = messages[0].split(/\s+/);

    // Find words that appear in all messages
    const commonWords = words.filter(word =>
        messages.every(msg => msg.toLowerCase().includes(word.toLowerCase()))
    );

    return commonWords.join(' ') || errors[0].analysis.errorType;
};

// Detect if errors are part of a cascade
const detectCascade = (errors: ErrorHistoryItem[]): boolean => {
    if (errors.length < 2) return false;

    // Check if errors occurred within a short time window (5 minutes)
    const timeWindow = 5 * 60 * 1000;
    const sortedErrors = [...errors].sort((a, b) => a.timestamp - b.timestamp);

    for (let i = 1; i < sortedErrors.length; i++) {
        if (sortedErrors[i].timestamp - sortedErrors[i - 1].timestamp > timeWindow) {
            return false;
        }
    }

    return true;
};

// Calculate trend based on error timestamps
const calculateTrend = (errors: ErrorHistoryItem[]): 'increasing' | 'decreasing' | 'stable' => {
    if (errors.length < 3) return 'stable';

    const now = Date.now();
    const last24h = errors.filter(e => now - e.timestamp < 24 * 60 * 60 * 1000).length;
    const prev24h = errors.filter(e => {
        const age = now - e.timestamp;
        return age >= 24 * 60 * 60 * 1000 && age < 48 * 60 * 60 * 1000;
    }).length;

    if (last24h > prev24h * 1.5) return 'increasing';
    if (last24h < prev24h * 0.5) return 'decreasing';
    return 'stable';
};

// Main clustering function
export const clusterErrors = (errors: ErrorHistoryItem[]): ErrorCluster[] => {
    if (errors.length === 0) return [];

    const clusters: ErrorCluster[] = [];
    const processed = new Set<string>();

    errors.forEach((error, index) => {
        if (processed.has(error.id)) return;

        // Find similar errors
        const similarErrors = errors.filter((otherError, otherIndex) => {
            if (otherIndex === index || processed.has(otherError.id)) return false;

            // Check if error types match
            if (error.analysis.errorType !== otherError.analysis.errorType) return false;

            // Check message similarity
            const similarity = calculateSimilarity(error.errorMessage, otherError.errorMessage);
            return similarity > 0.6; // 60% similarity threshold
        });

        // Create cluster
        const clusterErrors = [error, ...similarErrors];
        clusterErrors.forEach(e => processed.add(e.id));

        const affectedFiles = Array.from(
            new Set(
                clusterErrors.flatMap(e =>
                    e.analysis.filesLikelyAffected.map(f => f.path)
                )
            )
        );

        const timestamps = clusterErrors.map(e => e.timestamp);
        const severities = clusterErrors.map(e => e.analysis.severity);
        const highestSeverity = severities.includes('critical') ? 'critical' :
            severities.includes('high') ? 'high' :
                severities.includes('medium') ? 'medium' : 'low';

        clusters.push({
            id: `cluster-${Date.now()}-${index}`,
            name: extractCommonPattern(clusterErrors),
            errorType: error.analysis.errorType,
            count: clusterErrors.length,
            severity: highestSeverity,
            errors: clusterErrors,
            commonPattern: extractCommonPattern(clusterErrors),
            rootCause: error.analysis.rootCause,
            affectedFiles,
            firstSeen: Math.min(...timestamps),
            lastSeen: Math.max(...timestamps),
            trend: calculateTrend(clusterErrors),
        });
    });

    // Sort clusters by count (most errors first)
    return clusters.sort((a, b) => b.count - a.count);
};

// Detect error cascades
export const detectErrorCascades = (errors: ErrorHistoryItem[]): ErrorCluster[] => {
    const clusters = clusterErrors(errors);

    return clusters.filter(cluster => detectCascade(cluster.errors));
};

// Get cluster statistics
export const getClusterStats = (clusters: ErrorCluster[]) => {
    const totalErrors = clusters.reduce((sum, c) => sum + c.count, 0);
    const criticalClusters = clusters.filter(c => c.severity === 'critical').length;
    const increasingClusters = clusters.filter(c => c.trend === 'increasing').length;

    return {
        totalClusters: clusters.length,
        totalErrors,
        criticalClusters,
        increasingClusters,
        averageClusterSize: totalErrors / clusters.length || 0,
    };
};
