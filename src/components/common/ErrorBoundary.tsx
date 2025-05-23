
import React, { Component, ErrorInfo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Wrapper component to use hooks with class component
const ErrorBoundaryWithNavigation = (props: Props) => {
  // This will be available to the Reset button
  return <ErrorBoundaryClass {...props} />;
};

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error);
    console.error("Component stack trace:", errorInfo.componentStack);
    
    // Log specific router-related errors
    if (error.message && error.message.includes("Router")) {
      console.error("Router-related error detected:", error.message);
      console.error("This may indicate multiple router instances or navigation outside router context");
    }
  }

  handleReset = () => {
    // Reset the error boundary state instead of reloading the page
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <h2 className="mb-4 text-xl font-semibold text-red-700">Etwas ist schief gelaufen</h2>
            <p className="mb-4 text-red-600">
              Ein Fehler ist aufgetreten. Bitte versuche es erneut.
            </p>
            {this.state.error && (
              <pre className="mb-4 overflow-auto rounded bg-red-100 p-2 text-left text-xs text-red-800">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithNavigation;
