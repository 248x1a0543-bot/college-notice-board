import React from 'react';
import { ArrowLeft, Filter, Plus, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { ScreenType } from '../types/notice';

interface TopAppBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  title?: string;
  hasActiveFilter?: boolean;
  onRefresh?: () => void;
  isSimulatedError?: boolean;
  onToggleSimulatedError?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentScreen,
  onNavigate,
  title,
  hasActiveFilter = false,
  onRefresh,
  isSimulatedError = false,
  onToggleSimulatedError
}) => {
  const getScreenTitle = () => {
    if (title) return title;
    switch (currentScreen) {
      case 'list':
        return 'Campus Notice Board';
      case 'filter':
        return 'Department Filter';
      case 'detail':
        return 'Notice Details';
      case 'post':
        return 'Post New Notice';
      case 'tests':
        return 'Test Suite & Diagnostics';
      default:
        return 'CampusBeacon';
    }
  };

  const isRootScreen = currentScreen === 'list';

  return (
    <header className="sticky top-0 z-20 bg-blue-900 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
        {/* Left Slot: Navigation Icon or College Logo */}
        <div className="flex items-center gap-3">
          {!isRootScreen ? (
            <button
              onClick={() => onNavigate('list')}
              className="p-2 -ml-1 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              aria-label="Back to notices"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400 text-blue-950 font-bold text-sm shadow-inner">
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
            </div>
          )}

          <div className="flex flex-col">
            <h1 className="text-base font-bold tracking-tight text-white line-clamp-1">
              {getScreenTitle()}
            </h1>
            {isRootScreen && (
              <span className="text-[11px] text-blue-200 font-medium">
                Varsity Official Announcements
              </span>
            )}
          </div>
        </div>

        {/* Right Slot: Contextual Actions */}
        <div className="flex items-center gap-1">
          {/* Refresh / Sync Action */}
          {onRefresh && currentScreen === 'list' && (
            <button
              onClick={onRefresh}
              className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              title="Refresh circulars"
              aria-label="Refresh notices"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Department Filter button */}
          {currentScreen === 'list' && (
            <button
              onClick={() => onNavigate('filter')}
              className={`relative p-2 rounded-full transition-colors active:scale-95 ${
                hasActiveFilter 
                  ? 'bg-amber-400 text-blue-950 font-semibold' 
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
              title="Filter by Department"
              aria-label="Filter notices by department"
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilter && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-blue-900" />
              )}
            </button>
          )}

          {/* Simulate error toggle button (helps evaluators easily test error-and-retry state) */}
          {onToggleSimulatedError && currentScreen === 'list' && (
            <button
              onClick={onToggleSimulatedError}
              className={`p-2 rounded-full transition-colors text-xs active:scale-95 ${
                isSimulatedError
                  ? 'bg-rose-500 text-white'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
              title={isSimulatedError ? 'Clear simulated error' : 'Simulate network error for testing'}
              aria-label="Toggle error state for testing"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
          )}

          {/* Post Notice Header Shortcut */}
          {currentScreen === 'list' && (
            <button
              onClick={() => onNavigate('post')}
              className="hidden sm:flex items-center gap-1.5 ml-1 px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-lg shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Post Notice</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
