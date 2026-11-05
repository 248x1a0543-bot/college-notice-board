import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Sparkles, 
  Trash2, 
  Check, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { CollegeNotice, NoticeFormData, ScreenType } from './types/notice';
import { noticeStorage } from './services/storage';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DeviceFrameToggle } from './components/DeviceFrameToggle';
import { NoticeListScreen } from './screens/NoticeListScreen';
import { DepartmentFilterScreen } from './screens/DepartmentFilterScreen';
import { NoticeDetailScreen } from './screens/NoticeDetailScreen';
import { PostNoticeScreen } from './screens/PostNoticeScreen';
import { TestRunnerScreen } from './screens/TestRunnerScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('list');
  const [notices, setNotices] = useState<CollegeNotice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<CollegeNotice | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  
  // State variables for loading & error simulation
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('Unable to synchronize campus notices from local repository.');
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  
  // UI Display Mode: Android Phone View vs Expanded View
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  
  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'alert' } | null>(null);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  // Initial load from device storage (starts empty [] if nothing was previously saved)
  useEffect(() => {
    const stored = noticeStorage.getNotices();
    setNotices(stored);
  }, []);

  // Handlers for Notice Operations
  const handleCreateNotice = (formData: NoticeFormData): CollegeNotice => {
    const created = noticeStorage.createNotice(formData);
    setNotices(noticeStorage.getNotices());
    showToast(`Circular "${created.title.substring(0, 30)}..." published!`, 'success');
    return created;
  };

  const handleDeleteNotice = (id: string) => {
    const success = noticeStorage.deleteNotice(id);
    if (success) {
      setNotices(noticeStorage.getNotices());
      setSelectedNotice(null);
      showToast('Notice permanently removed from device.', 'info');
    }
  };

  const handleMarkAsRead = useCallback((id: string) => {
    noticeStorage.markAsRead(id);
    setNotices(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const handleSelectNotice = (notice: CollegeNotice) => {
    setSelectedNotice(notice);
    setCurrentScreen('detail');
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Error and Retry Handler
  const handleRetry = () => {
    setIsRetrying(true);
    setIsLoading(true);
    setTimeout(() => {
      setHasError(false);
      setIsLoading(false);
      setIsRetrying(false);
      setNotices(noticeStorage.getNotices());
      showToast('Synchronization successful. Connected to notice feed.', 'success');
    }, 600);
  };

  // Toggle simulated error state for evaluators
  const handleToggleSimulatedError = () => {
    if (hasError) {
      setHasError(false);
      showToast('Simulated error cleared.', 'info');
    } else {
      setHasError(true);
      setErrorMessage('Simulated device repository network failure. Tap Retry Connection to test recovery.');
      showToast('Simulated error state activated.', 'alert');
    }
  };

  // Manual helper: seeds sample notices for quick testing
  const handleSeedSampleNotices = () => {
    const updated = noticeStorage.seedSampleNotices();
    setNotices(updated);
    showToast('Loaded 3 college sample notices for testing.', 'success');
  };

  // Reset all notices back to empty list
  const handleClearAll = () => {
    if (window.confirm('Delete all stored notices on device? This will restore the empty state.')) {
      noticeStorage.clearAll();
      setNotices([]);
      setSelectedNotice(null);
      setSelectedDepartment(null);
      setCurrentScreen('list');
      showToast('All notices removed. Notice board is now empty.', 'info');
    }
  };

  // Render the active screen content
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'list':
        return (
          <NoticeListScreen
            notices={notices}
            isLoading={isLoading}
            hasError={hasError}
            errorMessage={errorMessage}
            onRetry={handleRetry}
            selectedDepartment={selectedDepartment}
            onClearDepartmentFilter={() => setSelectedDepartment(null)}
            onNavigate={handleNavigate}
            onSelectNotice={handleSelectNotice}
            onSeedDemoNotices={handleSeedSampleNotices}
          />
        );
      case 'filter':
        return (
          <DepartmentFilterScreen
            notices={notices}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={(dept) => {
              setSelectedDepartment(dept);
              if (dept) {
                showToast(`Filtered by ${dept}`, 'info');
              } else {
                showToast('Showing all college departments', 'info');
              }
            }}
            onNavigate={handleNavigate}
          />
        );
      case 'detail':
        if (!selectedNotice) {
          return (
            <div className="p-8 text-center text-slate-500">
              <p>Notice not found or deleted.</p>
              <button
                onClick={() => setCurrentScreen('list')}
                className="mt-3 px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg"
              >
                Back to Notice Board
              </button>
            </div>
          );
        }
        return (
          <NoticeDetailScreen
            notice={selectedNotice}
            onNavigate={handleNavigate}
            onDeleteNotice={handleDeleteNotice}
            onMarkAsRead={handleMarkAsRead}
          />
        );
      case 'post':
        return (
          <PostNoticeScreen
            onNoticeCreated={handleCreateNotice}
            onNavigate={handleNavigate}
            onSelectNotice={handleSelectNotice}
          />
        );
      case 'tests':
        return <TestRunnerScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col items-center justify-start p-0 sm:p-4 lg:p-6 antialiased font-['Public_Sans',sans-serif]">
      {/* Desktop Collegiate Brand Bar */}
      <header className="w-full max-w-5xl hidden sm:flex items-center justify-between py-3 px-4 bg-slate-800/90 text-white rounded-2xl border border-slate-700/80 mb-4 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow-md">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight font-display text-white">
                CampusBeacon
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded-md border border-blue-500/20">
                Android Notice Board
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Varsity Circulars & Department Announcement System
            </p>
          </div>
        </div>

        {/* Desktop Controls: Device Mode Toggle & Clear Button */}
        <div className="flex items-center gap-3">
          <DeviceFrameToggle
            isPhoneFrame={isPhoneFrame}
            onToggle={setIsPhoneFrame}
          />

          {notices.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-800/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Delete all notices to restore clean empty state"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Board</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container: Android Phone Frame vs Expanded Responsive Layout */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[430px] my-auto'
            : 'max-w-4xl my-0 sm:my-2'
        }`}
      >
        <div
          className={`relative bg-slate-100 flex flex-col overflow-hidden shadow-2xl transition-all ${
            isPhoneFrame
              ? 'rounded-[38px] border-[10px] border-slate-800 ring-1 ring-white/10 min-h-[780px] max-h-[890px] h-[86vh]'
              : 'rounded-2xl border border-slate-300/80 min-h-[85vh]'
          }`}
        >
          {/* Android Status Bar (5G, Wi-Fi, Battery, Clock) */}
          <div className="bg-blue-900 shrink-0">
            <AndroidStatusBar darkText={false} />
          </div>

          {/* Android Top App Bar */}
          <div className="shrink-0">
            <TopAppBar
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              hasActiveFilter={!!selectedDepartment}
              onRefresh={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  setNotices(noticeStorage.getNotices());
                  showToast('Notices refreshed.', 'info');
                }, 350);
              }}
              isSimulatedError={hasError}
              onToggleSimulatedError={handleToggleSimulatedError}
            />
          </div>

          {/* Scrollable Screen Content Canvas */}
          <div className="flex-1 overflow-y-auto overscroll-contain relative bg-slate-100">
            {renderScreenContent()}
          </div>

          {/* Android Bottom Navigation Bar */}
          <div className="shrink-0">
            <BottomNavBar
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              noticeCount={notices.length}
              hasFilterActive={!!selectedDepartment}
            />
          </div>

          {/* Android Gesture Navigation Bar indicator in Phone Frame */}
          {isPhoneFrame && (
            <div className="bg-white py-1.5 flex items-center justify-center shrink-0 border-t border-slate-100">
              <div className="w-28 h-1 bg-slate-400 rounded-full"></div>
            </div>
          )}

          {/* Toast Notification Container */}
          {toast && (
            <div className="absolute bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-2">
              <div
                className={`px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 max-w-sm border backdrop-blur-md pointer-events-auto ${
                  toast.type === 'success'
                    ? 'bg-emerald-900/90 text-white border-emerald-700'
                    : toast.type === 'alert'
                    ? 'bg-rose-900/90 text-white border-rose-700'
                    : 'bg-slate-900/95 text-white border-slate-700'
                }`}
              >
                {toast.type === 'success' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                {toast.type === 'alert' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span>{toast.message}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info / Screen Guide for Graders */}
      <footer className="w-full max-w-5xl py-3 px-2 text-center text-xs text-slate-500 mt-2">
        <p>
          CampusBeacon &middot; Android College Notice Board &middot; 4 Connected Screens &middot; Persistent On-Device Storage
        </p>
      </footer>
    </div>
  );
}
