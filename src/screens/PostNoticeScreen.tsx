import React, { useState } from 'react';
import { 
  Send, 
  RotateCcw, 
  Building2, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Hash, 
  Paperclip,
  Info
} from 'lucide-react';
import { COLLEGE_DEPARTMENTS, NOTICE_CATEGORIES, NOTICE_PRIORITIES } from '../constants/departments';
import { NoticeFormData, NoticeFormErrors, ScreenType, CollegeNotice } from '../types/notice';
import { validateNoticeForm, validateTitle, validateDepartment, validateIssuedBy, validateDate, validateContent } from '../services/validation';

interface PostNoticeScreenProps {
  onNoticeCreated: (noticeData: NoticeFormData) => CollegeNotice;
  onNavigate: (screen: ScreenType) => void;
  onSelectNotice: (notice: CollegeNotice) => void;
}

export const PostNoticeScreen: React.FC<PostNoticeScreenProps> = ({
  onNoticeCreated,
  onNavigate,
  onSelectNotice
}) => {
  const today = new Date().toISOString().split('T')[0];

  const initialFormState: NoticeFormData = {
    title: '',
    department: '',
    category: 'Academic',
    priority: 'Normal',
    issuedBy: '',
    date: today,
    content: '',
    referenceNumber: '',
    attachmentName: ''
  };

  const [formData, setFormData] = useState<NoticeFormData>(initialFormState);
  const [errors, setErrors] = useState<NoticeFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Field change handler with live validation for touched fields
  const handleChange = (field: keyof NoticeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (touched[field]) {
      // Revalidate single field
      let error: string | null = null;
      if (field === 'title') error = validateTitle(value);
      if (field === 'department') error = validateDepartment(value);
      if (field === 'issuedBy') error = validateIssuedBy(value);
      if (field === 'date') error = validateDate(value);
      if (field === 'content') error = validateContent(value);

      setErrors(prev => ({
        ...prev,
        [field]: error || undefined
      }));
    }
  };

  // Blur handler triggers touched & validation
  const handleBlur = (field: keyof NoticeFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    let error: string | null = null;
    const value = formData[field] || '';
    if (field === 'title') error = validateTitle(value);
    if (field === 'department') error = validateDepartment(value);
    if (field === 'issuedBy') error = validateIssuedBy(value);
    if (field === 'date') error = validateDate(value);
    if (field === 'content') error = validateContent(value);

    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all required fields as touched
    setTouched({
      title: true,
      department: true,
      category: true,
      priority: true,
      issuedBy: true,
      date: true,
      content: true
    });

    const validation = validateNoticeForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const createdNotice = onNoticeCreated(formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        onSelectNotice(createdNotice);
      }, 700);
    } catch (err) {
      console.error('Failed to post notice:', err);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Clear all form fields?')) {
      setFormData(initialFormState);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-28">
      {/* Header Info Banner */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 space-y-1">
        <h2 className="text-lg font-bold text-slate-900 font-display">
          Publish Official Notice
        </h2>
        <p className="text-xs text-slate-500">
          Notices are persistently stored on this device and viewable by all campus students and faculty.
        </p>
      </div>

      {submitSuccess && (
        <div className="m-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Notice Successfully Published!</p>
            <p>Saved securely to on-device storage. Redirecting to full notice view...</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-w-2xl mx-auto w-full">
        {/* Field 1: Notice Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Notice Title <span className="text-rose-600">*</span>
            </label>
            <span className={`text-[11px] tabular-nums ${formData.title.length > 120 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
              {formData.title.length}/120 chars
            </span>
          </div>

          <input
            id="title"
            type="text"
            placeholder="e.g. End-Semester Lab Examination Timetable & Guidelines"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.title && touched.title
                ? 'border-rose-300 ring-2 ring-rose-200 text-rose-900'
                : 'border-slate-300 focus:ring-blue-800/30 focus:border-blue-800'
            }`}
          />

          {errors.title && touched.title && (
            <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Field 2 & 3: Department and Category (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Department */}
          <div className="space-y-1.5">
            <label htmlFor="department" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Department <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <select
                id="department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                  errors.department && touched.department
                    ? 'border-rose-300 ring-2 ring-rose-200 text-rose-900'
                    : 'border-slate-300 focus:ring-blue-800/30 focus:border-blue-800'
                }`}
              >
                <option value="">-- Choose College Department --</option>
                {COLLEGE_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.code} - {dept.name}
                  </option>
                ))}
              </select>
              <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {errors.department && touched.department && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.department}</span>
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Category <span className="text-rose-600">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:border-blue-800 cursor-pointer"
            >
              {NOTICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 4 & 5: Issued By and Publication Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Issued By / Author */}
          <div className="space-y-1.5">
            <label htmlFor="issuedBy" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Authorized Authority / Issued By <span className="text-rose-600">*</span>
            </label>
            <input
              id="issuedBy"
              type="text"
              placeholder="e.g. Dr. K. Bell, Professor & HOD"
              value={formData.issuedBy}
              onChange={(e) => handleChange('issuedBy', e.target.value)}
              onBlur={() => handleBlur('issuedBy')}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.issuedBy && touched.issuedBy
                  ? 'border-rose-300 ring-2 ring-rose-200 text-rose-900'
                  : 'border-slate-300 focus:ring-blue-800/30 focus:border-blue-800'
              }`}
            />
            {errors.issuedBy && touched.issuedBy && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.issuedBy}</span>
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Publication Date <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                onBlur={() => handleBlur('date')}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.date && touched.date
                    ? 'border-rose-300 ring-2 ring-rose-200 text-rose-900'
                    : 'border-slate-300 focus:ring-blue-800/30 focus:border-blue-800'
                }`}
              />
            </div>
            {errors.date && touched.date && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.date}</span>
              </p>
            )}
          </div>
        </div>

        {/* Field 6: Priority Level */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Circular Priority Level <span className="text-rose-600">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {NOTICE_PRIORITIES.map((prio) => {
              const isSelected = formData.priority === prio;
              return (
                <button
                  type="button"
                  key={prio}
                  onClick={() => handleChange('priority', prio)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? prio === 'Urgent'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                        : prio === 'High'
                        ? 'bg-amber-500 text-blue-950 border-amber-600 shadow-sm'
                        : 'bg-blue-900 text-white border-blue-950 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {prio}
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 7: Notice Content (handles long text up to 3,000 chars) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="content" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Notice Content Body <span className="text-rose-600">*</span>
            </label>
            <span
              className={`text-[11px] tabular-nums ${
                formData.content.length < 20
                  ? 'text-amber-600 font-medium'
                  : formData.content.length > 3000
                  ? 'text-rose-600 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {formData.content.length}/3,000 chars (min 20)
            </span>
          </div>

          <textarea
            id="content"
            rows={6}
            placeholder="Write the comprehensive notice details, dates, venue, eligibility rules, and instructions here..."
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            onBlur={() => handleBlur('content')}
            className={`w-full p-3.5 text-sm bg-white border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 leading-relaxed transition-all resize-y ${
              errors.content && touched.content
                ? 'border-rose-300 ring-2 ring-rose-200 text-rose-900'
                : 'border-slate-300 focus:ring-blue-800/30 focus:border-blue-800'
            }`}
          />

          {errors.content && touched.content && (
            <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.content}</span>
            </p>
          )}

          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Preserves exact paragraph line breaks and formatting for readers.</span>
          </p>
        </div>

        {/* Optional Secondary Fields: Reference Number & Attachment Name */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Administrative Metadata (Optional)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="referenceNumber" className="text-xs font-medium text-slate-600 block mb-1">
                Circular Ref Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  id="referenceNumber"
                  type="text"
                  placeholder="Auto-generated if blank (e.g. CB/2026/CSE/401)"
                  value={formData.referenceNumber}
                  onChange={(e) => handleChange('referenceNumber', e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="attachmentName" className="text-xs font-medium text-slate-600 block mb-1">
                Attachment / Document Name
              </label>
              <div className="relative">
                <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  id="attachmentName"
                  type="text"
                  placeholder="e.g. Exam_Syllabus_Revised.pdf"
                  value={formData.attachmentName}
                  onChange={(e) => handleChange('attachmentName', e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-900 hover:bg-blue-800 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.2]" />
            <span>{isSubmitting ? 'Publishing Circular...' : 'Publish Notice to Board'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
