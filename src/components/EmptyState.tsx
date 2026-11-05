import React from 'react';
import { ClipboardList, PlusCircle, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onPostNotice: () => void;
  onSeedDemo?: () => void;
  isFiltered?: boolean;
  selectedDepartment?: string | null;
  onClearFilter?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onPostNotice,
  onSeedDemo,
  isFiltered = false,
  selectedDepartment,
  onClearFilter
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 shadow-sm">
          <ClipboardList className="w-10 h-10 stroke-[1.8]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-blue-950 flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2 font-display">
        {isFiltered ? 'No Notices for Department' : 'Official Notice Board Is Empty'}
      </h2>

      <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
        {isFiltered ? (
          <>
            No circulars match <span className="font-semibold text-slate-800">{selectedDepartment}</span>. You can clear the filter or post a circular for this department.
          </>
        ) : (
          'There are currently no circulars or announcements posted on the campus notice board. Tap below to create and publish the first notice.'
        )}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <button
          onClick={onPostNotice}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 active:scale-95 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Publish First Notice</span>
        </button>

        {isFiltered && onClearFilter && (
          <button
            onClick={onClearFilter}
            className="w-full px-4 py-2.5 text-xs font-semibold text-blue-900 hover:bg-blue-50 rounded-xl border border-blue-200 transition-colors"
          >
            Show All Departments
          </button>
        )}

        {!isFiltered && onSeedDemo && (
          <button
            onClick={onSeedDemo}
            className="w-full px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Populate 3 realistic exam, placement, and hackathon notices for testing"
          >
            Load 3 Sample Notices for Testing
          </button>
        )}
      </div>
    </div>
  );
};
