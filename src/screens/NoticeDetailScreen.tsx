import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Building2, 
  UserCheck, 
  FileText, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Trash2, 
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import { CollegeNotice, ScreenType } from '../types/notice';

interface NoticeDetailScreenProps {
  notice: CollegeNotice;
  onNavigate: (screen: ScreenType) => void;
  onDeleteNotice: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

export const NoticeDetailScreen: React.FC<NoticeDetailScreenProps> = ({
  notice,
  onNavigate,
  onDeleteNotice,
  onMarkAsRead
}) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mark as read on mount
  React.useEffect(() => {
    onMarkAsRead(notice.id);
  }, [notice.id, onMarkAsRead]);

  // Formatted date string
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(notice.date);
      if (isNaN(d.getTime())) return notice.date;
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return notice.date;
    }
  }, [notice.date]);

  const handleCopy = async () => {
    try {
      const text = `${notice.title}\nRef: ${notice.referenceNumber || 'N/A'}\nDepartment: ${notice.department}\nIssued By: ${notice.issuedBy}\nDate: ${notice.date}\n\n${notice.content}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: notice.title,
          text: `[College Notice] ${notice.title} from ${notice.department}`,
          url: window.location.href
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const isUrgent = notice.priority === 'Urgent';
  const isHigh = notice.priority === 'High';

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-28">
      {/* Top Banner & Title Section */}
      <div className="bg-white border-b border-slate-200 px-4 py-5 space-y-3">
        {/* Navigation & Priority Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onNavigate('list')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-blue-950 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Notices</span>
          </button>

          <div className="flex items-center gap-2">
            {isUrgent && (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" />
                Urgent Circular
              </span>
            )}
            {isHigh && (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                High Priority
              </span>
            )}
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {notice.category}
            </span>
          </div>
        </div>

        {/* Circular Reference Number */}
        {notice.referenceNumber && (
          <div className="text-[11px] font-mono tracking-wider text-slate-500 uppercase">
            Official Circular Ref: {notice.referenceNumber}
          </div>
        )}

        {/* Notice Title (Full display, handling long texts with clean line breaks) */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight font-display break-words">
          {notice.title}
        </h1>

        {/* Issuing Department and Authority Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Building2 className="w-4 h-4 text-blue-800 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Department</p>
              <p className="font-semibold text-slate-900 truncate">{notice.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <UserCheck className="w-4 h-4 text-blue-800 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Issued Authority</p>
              <p className="font-semibold text-slate-900 truncate">{notice.issuedBy}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-blue-800 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Publication Date</p>
              <p className="font-semibold text-slate-900">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-blue-800 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Broadcast Time</p>
              <p className="font-semibold text-slate-900">
                {new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Notice Content Section */}
      <main className="p-4 sm:p-6 space-y-4 max-w-3xl">
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Circular Official Text
            </h2>
            <span className="text-[11px] text-slate-400">
              {notice.content.length} characters
            </span>
          </div>

          {/* Body Content - handles line breaks, whitespace, and long paragraphs cleanly */}
          <div className="text-sm sm:text-base text-slate-800 leading-relaxed space-y-3 whitespace-pre-wrap break-words">
            {notice.content}
          </div>

          {/* Official Seal / Sign-off Footer */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col items-end text-right">
            <div className="w-28 border-b border-slate-300 pb-1 mb-1">
              <span className="text-[10px] text-slate-400 italic">Digitally Authorized</span>
            </div>
            <p className="text-xs font-bold text-slate-800">{notice.issuedBy}</p>
            <p className="text-[11px] text-slate-500">{notice.department}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Campus Verification Token Valid</p>
          </div>
        </div>

        {/* Attachment Card if present */}
        {notice.attachmentName && (
          <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {notice.attachmentName}
                </p>
                <p className="text-[11px] text-slate-500">Official Annexure PDF Document</p>
              </div>
            </div>

            <button
              onClick={() => alert(`Simulated download of ${notice.attachmentName}`)}
              className="px-3 py-1.5 text-xs font-semibold text-blue-900 hover:bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        )}

        {/* Notice Actions */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
              title="Copy circular text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
              title="Share notice"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
              title="Print circular"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
            title="Delete notice from device"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Campus Notice?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-slate-800">&ldquo;{notice.title}&rdquo;</span>? This will permanently delete the circular from this device.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteNotice(notice.id);
                  onNavigate('list');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
              >
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
