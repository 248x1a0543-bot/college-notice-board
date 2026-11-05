import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface AndroidStatusBarProps {
  darkText?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ darkText = false }) => {
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const textColorClass = darkText ? 'text-slate-800' : 'text-white';

  return (
    <div className={`w-full px-5 pt-2 pb-1.5 flex items-center justify-between text-xs font-semibold select-none z-30 transition-colors ${textColorClass}`}>
      {/* Clock */}
      <span className="tracking-tight font-medium text-[13px]">{currentTime}</span>

      {/* Camera Hole Punch representation in phone view */}
      <div className="w-3.5 h-3.5 rounded-full bg-slate-900/60 dark:bg-black border border-white/10 hidden sm:block"></div>

      {/* Status Icons: 5G, Wi-Fi, Battery */}
      <div className="flex items-center gap-1.5 opacity-90">
        <span className="text-[10px] font-bold tracking-widest mr-0.5">5G</span>
        <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4 stroke-[2.2]" />
          <span className="text-[10px] font-medium">96%</span>
        </div>
      </div>
    </div>
  );
};
