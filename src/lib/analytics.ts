import type { ErrorHistoryItem, ErrorSeverity } from '../stores/errorStore';

export interface AnalyticsData {
    totalErrors: number;
    errorsByDay: Array<{ date: string; count: number }>;
    errorsBySeverity: Record<ErrorSeverity, number>;
    errorsByType: Array<{ type: string; count: number }>;
    errorsByLanguage: Array<{ language: string; count: number }>;
    mttr: number; // Mean Time To Resolution in minutes
    errorRate: number; // Errors per day
    topErrorProducers: Array<{ file: string; count: number }>;
    resolutionRate: number; // Percentage of resolved errors
    trends: {
        last7Days: number;
        last30Days: number;
        percentageChange: number;
    };
}

// Calculate analytics from error history
export const calculateAnalytics = (errors: ErrorHistoryItem[]): AnalyticsData => {
    if (errors.length === 0) {
        return {
            totalErrors: 0,
            errorsByDay: [],
            errorsBySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
            errorsByType: [],
            errorsByLanguage: [],
            mttr: 0,
            errorRate: 0,
            topErrorProducers: [],
            resolutionRate: 0,
            trends: { last7Days: 0, last30Days: 0, percentageChange: 0 },
        };
    }

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const sevenDaysMs = 7 * oneDayMs;
    const thirtyDaysMs = 30 * oneDayMs;

    // Errors by day (last 30 days)
    const errorsByDay: Record<string, number> = {};
    const last30Days = errors.filter(e => now - e.timestamp < thirtyDaysMs);

    last30Days.forEach(error => {
        const date = new Date(error.timestamp).toISOString().split('T')[0];
        errorsByDay[date] = (errorsByDay[date] || 0) + 1;
    });

    const errorsByDayArray = Object.entries(errorsByDay)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Errors by severity
    const errorsBySeverity: Record<ErrorSeverity, number> = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
    };

    errors.forEach(error => {
        errorsBySeverity[error.analysis.severity]++;
    });

    // Errors by type
    const errorTypeCount: Record<string, number> = {};
    errors.forEach(error => {
        const type = error.analysis.errorType;
        errorTypeCount[type] = (errorTypeCount[type] || 0) + 1;
    });

    const errorsByType = Object.entries(errorTypeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10

    // Errors by language
    const languageCount: Record<string, number> = {};
    errors.forEach(error => {
        languageCount[error.language] = (languageCount[error.language] || 0) + 1;
    });

    const errorsByLanguage = Object.entries(languageCount)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count);

    // MTTR (Mean Time To Resolution) - simplified calculation
    const resolvedErrors = errors.filter(e => e.status === 'resolved');
    const mttr = resolvedErrors.length > 0
        ? resolvedErrors.reduce((sum, e) => sum + (now - e.timestamp), 0) / resolvedErrors.length / (60 * 1000)
        : 0;

    // Error rate (errors per day)
    const oldestError = errors.reduce((oldest, e) =>
        e.timestamp < oldest ? e.timestamp : oldest, now
    );
    const daysSpan = Math.max(1, (now - oldestError) / oneDayMs);
    const errorRate = errors.length / daysSpan;

    // Top error producers (files with most errors)
    const fileCount: Record<string, number> = {};
    errors.forEach(error => {
        error.analysis.filesLikelyAffected.forEach(file => {
            fileCount[file.path] = (fileCount[file.path] || 0) + 1;
        });
    });

    const topErrorProducers = Object.entries(fileCount)
        .map(([file, count]) => ({ file, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Resolution rate
    const resolutionRate = (resolvedErrors.length / errors.length) * 100;

    // Trends
    const last7DaysErrors = errors.filter(e => now - e.timestamp < sevenDaysMs).length;
    const last30DaysErrors = errors.filter(e => now - e.timestamp < thirtyDaysMs).length;
    const prev7DaysErrors = errors.filter(e => {
        const age = now - e.timestamp;
        return age >= sevenDaysMs && age < sevenDaysMs * 2;
    }).length;

    const percentageChange = prev7DaysErrors > 0
        ? ((last7DaysErrors - prev7DaysErrors) / prev7DaysErrors) * 100
        : 0;

    return {
        totalErrors: errors.length,
        errorsByDay: errorsByDayArray,
        errorsBySeverity,
        errorsByType,
        errorsByLanguage,
        mttr: Math.round(mttr),
        errorRate: Math.round(errorRate * 10) / 10,
        topErrorProducers,
        resolutionRate: Math.round(resolutionRate * 10) / 10,
        trends: {
            last7Days: last7DaysErrors,
            last30Days: last30DaysErrors,
            percentageChange: Math.round(percentageChange * 10) / 10,
        },
    };
};

// Generate chart data for error trends
export const generateTrendChartData = (errorsByDay: Array<{ date: string; count: number }>) => {
    // Fill in missing days with 0
    if (errorsByDay.length === 0) return [];

    const result: Array<{ date: string; count: number }> = [];
    const startDate = new Date(errorsByDay[0].date);
    const endDate = new Date(errorsByDay[errorsByDay.length - 1].date);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const existing = errorsByDay.find(d => d.date === dateStr);
        result.push({
            date: dateStr,
            count: existing?.count || 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
};
