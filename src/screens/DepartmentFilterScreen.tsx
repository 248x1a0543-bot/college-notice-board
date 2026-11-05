import React, { useState, useMemo } from 'react';
import { Check, Search, Building2, Layers, RotateCcw, ArrowRight } from 'lucide-react';
import { COLLEGE_DEPARTMENTS } from '../constants/departments';
import { CollegeNotice, ScreenType } from '../types/notice';

interface DepartmentFilterScreenProps {
  notices: CollegeNotice[];
  selectedDepartment: string | null;
  onSelectDepartment: (dept: string | null) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const DepartmentFilterScreen: React.FC<DepartmentFilterScreenProps> = ({
  notices,
  selectedDepartment,
  onSelectDepartment,
  onNavigate
}) => {
  const [searchDept, setSearchDept] = useState('');
  const [pendingSelection, setPendingSelection] = useState<string | null>(selectedDepartment);

  // Compute notice counts per department
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of COLLEGE_DEPARTMENTS) {
      counts[d.name] = 0;
    }
    for (const n of notices) {
      if (counts[n.department] !== undefined) {
        counts[n.department] += 1;
      } else {
        counts[n.department] = 1;
      }
    }
    return counts;
  }, [notices]);

  // Filtered departments list
  const filteredDepartments = useMemo(() => {
    if (!searchDept.trim()) return COLLEGE_DEPARTMENTS;
    const q = searchDept.toLowerCase().trim();
    return COLLEGE_DEPARTMENTS.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.building.toLowerCase().includes(q)
    );
  }, [searchDept]);

  const handleApply = () => {
    onSelectDepartment(pendingSelection);
    onNavigate('list');
  };

  const handleReset = () => {
    setPendingSelection(null);
    onSelectDepartment(null);
    onNavigate('list');
  };

  return (
    <div className="flex flex-col min-h-full pb-28">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-slate-200/80 shadow-sm space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search academic & administrative departments..."
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:border-blue-800"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <span>Select a department to isolate campus notices</span>
          {pendingSelection && (
            <button
              onClick={() => setPendingSelection(null)}
              className="text-blue-900 font-semibold hover:underline"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      {/* Department List */}
      <div className="p-4 space-y-2 flex-1">
        {/* All Departments Option */}
        <button
          onClick={() => setPendingSelection(null)}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all active:scale-[0.99] cursor-pointer ${
            pendingSelection === null
              ? 'bg-blue-900 text-white border-blue-950 shadow-sm font-semibold'
              : 'bg-white border-slate-200/90 text-slate-800 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                pendingSelection === null
                  ? 'bg-amber-400 text-blue-950'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              ALL
            </div>
            <div>
              <p className="text-sm font-bold">All Departments</p>
              <p className={`text-xs ${pendingSelection === null ? 'text-blue-200' : 'text-slate-500'}`}>
                View aggregate campus-wide notices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md tabular-nums ${
                pendingSelection === null ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {notices.length}
            </span>
            {pendingSelection === null && <Check className="w-5 h-5 text-amber-400" />}
          </div>
        </button>

        {/* Individual College Departments */}
        {filteredDepartments.map((dept) => {
          const isSelected = pendingSelection === dept.name;
          const count = departmentCounts[dept.name] || 0;

          return (
            <button
              key={dept.id}
              onClick={() => setPendingSelection(dept.name)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all active:scale-[0.99] cursor-pointer ${
                isSelected
                  ? 'bg-blue-900 text-white border-blue-950 shadow-sm'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 pr-2">
                <div
                  className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-amber-400 text-blue-950' : 'bg-blue-50 text-blue-900'
                  }`}
                >
                  {dept.code}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{dept.name}</p>
                  <p className={`text-xs truncate ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                    {dept.building}
                  </p>
                  <p className={`text-[11px] line-clamp-1 mt-0.5 ${isSelected ? 'text-blue-200/80' : 'text-slate-400'}`}>
                    {dept.hodTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md tabular-nums ${
                    isSelected
                      ? 'bg-blue-800 text-white'
                      : count > 0
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
                {isSelected && <Check className="w-5 h-5 text-amber-400 shrink-0" />}
              </div>
            </button>
          );
        })}

        {filteredDepartments.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            No departments match &ldquo;{searchDept}&rdquo;
          </div>
        )}
      </div>

      {/* Sticky Bottom Apply CTA Bar (Thumb reach zone) */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg z-20 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleApply}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-900 hover:bg-blue-800 active:scale-95 text-white rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            <span>
              {pendingSelection ? `Filter by ${pendingSelection.split(' ')[0]}` : 'Show All Circulars'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
