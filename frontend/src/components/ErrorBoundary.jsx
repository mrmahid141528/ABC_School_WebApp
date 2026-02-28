import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // In production, log to an external service like Sentry or our backend /api/health/bug-report
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-screen bg-slate-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 text-center">
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h2>
                        <p className="text-slate-500 mb-6 text-sm">
                            The application encountered an unexpected error. We've logged this issue.
                        </p>
                        <div className="bg-slate-100 p-4 rounded-xl text-left mb-6 overflow-auto max-h-32 text-xs text-slate-600 font-mono">
                            {this.state.error?.message || 'Unknown Error'}
                        </div>
                        <Button onClick={() => window.location.href = '/'} className="w-full">
                            Return to Safety
                        </Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
