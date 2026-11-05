import React from 'react';
import { Bell, Filter, PlusCircle, CheckSquare } from 'lucide-react';
import { ScreenType } from '../types/notice';

interface BottomNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  noticeCount?: number;
  hasFilterActive?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  noticeCount = 0,
  hasFilterActive = false
}) => {
  const navItems = [
    {
      id: 'list' as ScreenType,
      label: 'Notices',
      icon: Bell,
      badge: noticeCount > 0 ? noticeCount : undefined
    },
    {
      id: 'filter' as ScreenType,
      label: 'Departments',
      icon: Filter,
      activeBadge: hasFilterActive
    },
    {
      id: 'post' as ScreenType,
      label: 'Post Notice',
      icon: PlusCircle,
      isPrimaryAction: true
    },
    {
      id: 'tests' as ScreenType,
      label: 'Test Suite',
      icon: CheckSquare
    }
  ];

  return (
    <nav className="sticky bottom-0 z-20 w-full bg-white border-t border-slate-200/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center h-full relative transition-all active:scale-95 ${
                isActive ? 'text-blue-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <div
                  className={`flex items-center justify-center w-10 h-8 rounded-full transition-colors ${
                    isActive ? 'bg-blue-100 text-blue-900' : 'text-slate-500'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>

                {/* Counter Badge */}
                {typeof item.badge === 'number' && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] text-[10px] font-bold text-white bg-blue-700 rounded-full text-center shadow-sm">
                    {item.badge}
                  </span>
                )}

                {/* Filter dot badge */}
                {item.activeBadge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
                )}
              </div>

              <span className={`text-[11px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-blue-900' : 'text-slate-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
