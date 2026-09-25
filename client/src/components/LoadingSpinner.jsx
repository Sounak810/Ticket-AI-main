import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
        <p className="text-lg font-semibold text-slate-700">Loading...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
