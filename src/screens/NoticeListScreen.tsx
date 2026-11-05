import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, X, ArrowUpDown, SlidersHorizontal, Layers } from 'lucide-react';
import { CollegeNotice, ScreenType } from '../types/notice';
import { NoticeCard } from '../components/NoticeCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorRetryState } from '../components/ErrorRetryState';
import { EmptyState } from '../components/EmptyState';

interface NoticeListScreenProps {
  notices: CollegeNotice[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  selectedDepartment: string | null;
  onClearDepartmentFilter: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectNotice: (notice: CollegeNotice) => void;
  onSeedDemoNotices: () => void;
}

export const NoticeListScreen: React.FC<NoticeListScreenProps> = ({
  notices,
  isLoading,
  hasError,
  errorMessage,
  onRetry,
  selectedDepartment,
  onClearDepartmentFilter,
  onNavigate,
  onSelectNotice,
  onSeedDemoNotices
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  // Filter notices by department and search query
  const filteredNotices = useMemo(() => {
    let result = [...notices];

    // Filter by department
    if (selectedDepartment) {
      result = result.filter(n => n.department.toLowerCase() === selectedDepartment.toLowerCase());
    }

    // Filter by search query (title, content, department, reference number)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q) ||
        (n.referenceNumber && n.referenceNumber.toLowerCase().includes(q))
      );
    }

    // Sort notices
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.createdAt - a.createdAt;
      }
      if (sortBy === 'oldest') {
        return a.createdAt - b.createdAt;
      }
      if (sortBy === 'priority') {
        const score = (p: string) => (p === 'Urgent' ? 3 : p === 'High' ? 2 : 1);
        return score(b.priority) - score(a.priority) || b.createdAt - a.createdAt;
      }
      return 0;
    });

    return result;
  }, [notices, selectedDepartment, searchQuery, sortBy]);

  // Priority counts for quick stats
  const urgentCount = useMemo(() => {
    return notices.filter(n => n.priority === 'Urgent').length;
  }, [notices]);

  // 1. Loading State
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // 2. Error and Retry State
  if (hasError) {
    return <ErrorRetryState errorMessage={errorMessage} onRetry={onRetry} />;
  }

  // 3. Empty State (Overall board is empty)
  if (notices.length === 0) {
    return (
      <EmptyState
        onPostNotice={() => onNavigate('post')}
        onSeedDemo={onSeedDemoNotices}
      />
    );
  }

  // 4. Data State
  return (
    <div className="relative pb-24">
      {/* Search and Filter Strip */}
      <div className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur-sm px-4 pt-3 pb-2.5 border-b border-slate-200/80 space-y-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars, subjects, or circular IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:border-blue-800 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges & Sort Controls */}
        <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Department Active Filter Button / Indicator */}
            {selectedDepartment ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-900 text-white rounded-lg font-medium shadow-sm">
                <span>{selectedDepartment}</span>
                <button
                  onClick={onClearDepartmentFilter}
                  className="hover:bg-blue-800 rounded p-0.5"
                  title="Clear department filter"
                  aria-label="Clear filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('filter')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium shadow-sm transition-colors cursor-pointer"
              >
                <Filter className="w-3 h-3 text-slate-500" />
                <span>Filter by Department</span>
              </button>
            )}

            {urgentCount > 0 && (
              <span className="text-rose-600 font-semibold px-2 py-0.5 bg-rose-50 border border-rose-200 rounded-md">
                {urgentCount} Urgent
              </span>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 text-slate-500 shrink-0">
            <ArrowUpDown className="w-3 h-3" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 font-medium text-xs focus:outline-none cursor-pointer"
              aria-label="Sort notices"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Notice Feed */}
      <main className="p-4 space-y-3">
        {filteredNotices.length === 0 ? (
          <EmptyState
            isFiltered={!!selectedDepartment || !!searchQuery}
            selectedDepartment={selectedDepartment || searchQuery}
            onClearFilter={() => {
              setSearchQuery('');
              onClearDepartmentFilter();
            }}
            onPostNotice={() => onNavigate('post')}
          />
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 mb-1">
              <span>Showing {filteredNotices.length} of {notices.length} notices</span>
              <span className="tabular-nums">Live Feed</span>
            </div>

            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onClick={() => onSelectNotice(notice)}
              />
            ))}
          </>
        )}
      </main>

      {/* Material Floating Action Button (FAB) for Post Notice (thumb reach zone) */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-20">
        <button
          onClick={() => onNavigate('post')}
          className="flex items-center gap-2 px-4 py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer"
          aria-label="Post new notice"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span className="text-sm font-bold tracking-tight pr-1">Post Notice</span>
        </button>
      </div>
    </div>
  );
};
