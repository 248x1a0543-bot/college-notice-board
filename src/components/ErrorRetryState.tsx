import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorRetryStateProps {
  errorMessage?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ErrorRetryState: React.FC<ErrorRetryStateProps> = ({
  errorMessage = 'Unable to synchronize campus notices from device storage.',
  onRetry,
  isRetrying = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-auto text-center min-h-[360px]">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-1.5 font-display">
        Connection & Sync Interrupted
      </h2>

      <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
        {errorMessage}
      </p>

      <button
        onClick={onRetry}
        disabled={isRetrying}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 active:scale-95 rounded-xl shadow-md transition-all disabled:opacity-60 cursor-pointer"
      >
        <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
        <span>{isRetrying ? 'Reconnecting...' : 'Retry Connection'}</span>
      </button>

      <p className="text-[11px] text-slate-400 mt-4">
        Error code: SYNC_LOCAL_DISCONNECTED (Tap Retry to restore)
      </p>
    </div>
  );
};
