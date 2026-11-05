import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface DeviceFrameToggleProps {
  isPhoneFrame: boolean;
  onToggle: (isPhone: boolean) => void;
}

export const DeviceFrameToggle: React.FC<DeviceFrameToggleProps> = ({
  isPhoneFrame,
  onToggle
}) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl shadow-xs text-xs font-semibold select-none">
      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          isPhoneFrame
            ? 'bg-white text-blue-950 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="View as Android Phone (390px viewport)"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Android Frame</span>
        <span className="sm:hidden">Phone</span>
      </button>

      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          !isPhoneFrame
            ? 'bg-white text-blue-950 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="View responsive wide layout"
      >
        <Monitor className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Expanded View</span>
        <span className="sm:hidden">Full</span>
      </button>
    </div>
  );
};
