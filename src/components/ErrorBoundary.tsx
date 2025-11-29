import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-8 font-sans relative overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

                    <div className="relative z-10 max-w-2xl w-full text-center">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-lg shadow-red-500/10">
                            <AlertTriangle className="w-10 h-10 text-red-400" />
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Something went wrong</h1>
                        <p className="text-slate-400 mb-8 text-lg">
                            Don't worry, we've logged this error and are looking into it.
                        </p>

                        <div className="glass-card rounded-xl p-6 text-left mb-8 border-red-500/20 bg-red-500/5 backdrop-blur-xl">
                            <p className="text-red-300 font-mono text-sm mb-4 font-semibold border-b border-red-500/10 pb-2">
                                {this.state.error?.message}
                            </p>
                            <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono overflow-auto max-h-64 custom-scrollbar">
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-white/20 hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
