import React from "react";
import { useNavigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="card bg-white/80 backdrop-blur shadow-xl w-96 border border-black/10">
            <div className="card-body text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="card-title justify-center text-error">
                Something went wrong
              </h2>
              <p className="text-slate-700 py-4">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => window.location.href = "/"}
                className="btn btn-primary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card bg-white/80 backdrop-blur shadow-xl w-96 border border-black/10">
        <div className="card-body text-center">
          <div className="text-6xl mb-4 font-bold text-error">404</div>
          <h2 className="card-title justify-center">Page Not Found</h2>
          <p className="text-slate-700 py-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a href="/" className="btn btn-primary">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
