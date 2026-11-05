import React from 'react';
import { ChevronRight, Calendar, Building2, AlertCircle } from 'lucide-react';
import { CollegeNotice } from '../types/notice';

interface NoticeCardProps {
  notice: CollegeNotice;
  onClick: () => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onClick }) => {
  // Format publication date e.g. "Nov 5, 2026"
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(notice.date);
      if (isNaN(d.getTime())) return notice.date;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return notice.date;
    }
  }, [notice.date]);

  const isUrgent = notice.priority === 'Urgent';
  const isHigh = notice.priority === 'High';

  return (
    <article
      onClick={onClick}
      className={`group relative bg-white rounded-xl p-4 sm:p-5 border transition-all cursor-pointer select-none active:scale-[0.99] hover:shadow-md ${
        isUrgent 
          ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400' 
          : 'border-slate-200/90 hover:border-blue-300'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Notice: ${notice.title}`}
    >
      {/* Top Department & Date Row (Clean unboxed metadata with separators) */}
      <div className="flex items-center justify-between gap-2 mb-2 text-xs">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold truncate">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-blue-700" />
          <span className="truncate">{notice.department}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 shrink-0 tabular-nums">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Main Notice Title (handles long text gracefully) */}
      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-950 transition-colors leading-snug mb-2 font-display break-words">
        {notice.title}
      </h3>

      {/* Excerpt Snippet */}
      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3 break-words">
        {notice.content}
      </p>

      {/* Footer Metadata & Indicator Row */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
        {/* Category & Priority without pill slop */}
        <div className="flex items-center gap-2 text-slate-500">
          <span className="font-medium text-slate-700">{notice.category}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          {isUrgent && (
            <span className="flex items-center gap-1 font-bold text-rose-600">
              <AlertCircle className="w-3 h-3" />
              Urgent Circular
            </span>
          )}
          {isHigh && (
            <span className="font-semibold text-amber-700">
              Important
            </span>
          )}
          {!isUrgent && !isHigh && (
            <span>Routine</span>
          )}
          {notice.referenceNumber && (
            <>
              <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>
              <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
                {notice.referenceNumber}
              </span>
            </>
          )}
        </div>

        {/* View indicator */}
        <div className="flex items-center gap-0.5 text-blue-800 font-medium text-xs group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>Read notice</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </article>
  );
};
