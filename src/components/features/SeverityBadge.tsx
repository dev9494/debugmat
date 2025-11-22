import { AlertTriangle, TrendingUp, DollarSign, Clock, Users } from 'lucide-react';
import type { ErrorSeverity } from '../../stores/errorStore';
import { getSeverityColor, getSeverityLabel, estimateBusinessImpact } from '../../lib/severityDetection';
import { cn } from '../../lib/utils';

interface SeverityBadgeProps {
    severity: ErrorSeverity;
    showDetails?: boolean;
    className?: string;
}

export const SeverityBadge = ({ severity, showDetails = false, className }: SeverityBadgeProps) => {
    const colors = getSeverityColor(severity);
    const label = getSeverityLabel(severity);
    const impact = estimateBusinessImpact(severity);

    if (!showDetails) {
        return (
            <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-sm",
                colors.bg,
                colors.border,
                colors.text,
                className
            )}>
                <span>{colors.icon}</span>
                <span>{label}</span>
            </div>
        );
    }

    return (
        <div className={cn(
            "rounded-xl border p-6 space-y-4",
            colors.bg,
            colors.border,
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg",
                        colors.bg,
                        colors.border,
                        "border"
                    )}>
                        <AlertTriangle className={cn("w-5 h-5", colors.text)} />
                    </div>
                    <div>
                        <h3 className={cn("text-xl font-bold", colors.text)}>
                            {colors.icon} {label} Severity
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Business Impact Analysis
                        </p>
                    </div>
                </div>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Users Affected</span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                        {impact.usersAffected}
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>Revenue Impact</span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                        {impact.estimatedRevenueLoss}
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Time to Fix</span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                        {impact.timeToFix}
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>Priority</span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                        {severity === 'critical' ? 'P0 - Critical' :
                            severity === 'high' ? 'P1 - High' :
                                severity === 'medium' ? 'P2 - Medium' : 'P3 - Low'}
                    </p>
                </div>
            </div>

            {/* Recommended Action */}
            <div className={cn(
                "p-4 rounded-lg border",
                `bg-gradient-to-r ${colors.gradient}`,
                colors.border
            )}>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                    Recommended Action
                </p>
                <p className={cn("text-base font-semibold", colors.text)}>
                    {impact.recommendedAction}
                </p>
            </div>
        </div>
    );
};
