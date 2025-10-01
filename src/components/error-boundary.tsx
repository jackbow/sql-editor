"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-8 w-8 text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Something went wrong
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>
                                        An unexpected error occurred. Please refresh the page and try again.
                                    </p>
                                    {process.env.NODE_ENV === "development" && this.state.error && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-xs">
                                                Error details (development only)
                                            </summary>
                                            <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
                                                {this.state.error.message}
                                                {this.state.error.stack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                                onClick={() => {
                                    this.setState({ hasError: false, error: undefined });
                                    window.location.reload();
                                }}
                            >
                                Refresh page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}