import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-3.5 p-4 animate-pulse" aria-label="Loading circulars">
      <div className="flex items-center justify-between pb-2">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
      </div>

      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm space-y-3"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="h-3.5 bg-slate-200 rounded w-2/5"></div>
            <div className="h-3.5 bg-slate-200 rounded w-1/4"></div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <div className="h-5 bg-slate-200 rounded w-4/5"></div>
            <div className="h-4 bg-slate-200 rounded w-3/5"></div>
          </div>

          {/* Body snippet */}
          <div className="space-y-1 pt-1">
            <div className="h-3 bg-slate-100 rounded w-full"></div>
            <div className="h-3 bg-slate-100 rounded w-5/6"></div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
