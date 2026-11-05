export type NoticeCategory = 
  | 'Academic'
  | 'Examination'
  | 'Placement'
  | 'Event & Cultural'
  | 'Administration'
  | 'Urgent Circular';

export type NoticePriority = 'Normal' | 'High' | 'Urgent';

export interface CollegeNotice {
  id: string;
  title: string;
  department: string;
  category: NoticeCategory;
  priority: NoticePriority;
  issuedBy: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
  content: string;
  isRead?: boolean;
  referenceNumber?: string;
  attachmentName?: string;
}

export interface NoticeFormData {
  title: string;
  department: string;
  category: NoticeCategory;
  priority: NoticePriority;
  issuedBy: string;
  date: string;
  content: string;
  referenceNumber?: string;
  attachmentName?: string;
}

export type NoticeFormErrors = Partial<Record<keyof NoticeFormData, string>>;

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  building: string;
  hodTitle: string;
  description: string;
}

export type ScreenType = 'list' | 'filter' | 'detail' | 'post' | 'tests';

export interface FilterState {
  department: string | null; // null = all departments
  searchQuery: string;
  category: NoticeCategory | 'All';
  priority: NoticePriority | 'All';
  sortBy: 'newest' | 'oldest' | 'priority';
}
