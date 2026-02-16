import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
    children?: ReactNode;
    featureName?: string; // Optional feature name for better error context
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class FeatureErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Error in ${this.props.featureName || 'feature'}:`, error, errorInfo);
        this.setState({ error, errorInfo });
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-600 mb-6">
                            {this.props.featureName
                                ? `There was an error loading the ${this.props.featureName} module.`
                                : 'An unexpected error occurred.'}
                        </p>

                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                                    Technical Details
                                </summary>
                                <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-800 overflow-auto max-h-40">
                                    <p className="mb-2 text-red-600">{this.state.error.toString()}</p>
                                    {this.state.errorInfo && (
                                        <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="flex gap-3">
                            <Button
                                onClick={this.handleRetry}
                                className="flex-1 bg-[#FF7A00] hover:bg-[#FF6A00]"
                            >
                                Try Again
                            </Button>
                            <Button
                                onClick={this.handleGoHome}
                                variant="outline"
                                className="flex-1"
                            >
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
