import { COLLEGE_DEPARTMENTS, NOTICE_CATEGORIES, NOTICE_PRIORITIES } from '../constants/departments';
import { NoticeFormData, NoticeFormErrors } from '../types/notice';

export interface ValidationResult {
  isValid: boolean;
  errors: NoticeFormErrors;
}

export function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (!trimmed) {
    return 'Notice title is required.';
  }
  if (trimmed.length < 5) {
    return 'Title must be at least 5 characters long.';
  }
  if (trimmed.length > 120) {
    return 'Title cannot exceed 120 characters.';
  }
  return null;
}

export function validateDepartment(dept: string): string | null {
  const trimmed = dept.trim();
  if (!trimmed) {
    return 'Please select a college department.';
  }
  const exists = COLLEGE_DEPARTMENTS.some(d => d.name === trimmed || d.id === trimmed);
  if (!exists) {
    return 'Please select a recognized collegiate department.';
  }
  return null;
}

export function validateCategory(category: string): string | null {
  if (!category || !NOTICE_CATEGORIES.includes(category as any)) {
    return 'Please select a valid notice category.';
  }
  return null;
}

export function validateIssuedBy(issuedBy: string): string | null {
  const trimmed = issuedBy.trim();
  if (!trimmed) {
    return 'Authority/Issued By is required (e.g. "Prof. Bell - HOD").';
  }
  if (trimmed.length < 3) {
    return 'Issuer name must be at least 3 characters.';
  }
  if (trimmed.length > 60) {
    return 'Issuer name cannot exceed 60 characters.';
  }
  return null;
}

export function validateDate(dateStr: string): string | null {
  if (!dateStr || !dateStr.trim()) {
    return 'A valid circular publication date is required.';
  }
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date format. Please choose a valid date.';
  }
  return null;
}

export function validatePriority(priority: string): string | null {
  if (!priority || !NOTICE_PRIORITIES.includes(priority as any)) {
    return 'Please choose a priority level (Normal, High, or Urgent).';
  }
  return null;
}

export function validateContent(content: string): string | null {
  const trimmed = content.trim();
  if (!trimmed) {
    return 'Notice content body cannot be empty.';
  }
  if (trimmed.length < 20) {
    return `Content requires at least 20 characters (currently ${trimmed.length}).`;
  }
  if (trimmed.length > 3000) {
    return `Content cannot exceed 3,000 characters (currently ${trimmed.length}).`;
  }
  return null;
}

/**
 * Validates the complete notice form
 */
export function validateNoticeForm(data: NoticeFormData): ValidationResult {
  const errors: NoticeFormErrors = {};

  const titleErr = validateTitle(data.title);
  if (titleErr) errors.title = titleErr;

  const deptErr = validateDepartment(data.department);
  if (deptErr) errors.department = deptErr;

  const catErr = validateCategory(data.category);
  if (catErr) errors.category = catErr;

  const issuerErr = validateIssuedBy(data.issuedBy);
  if (issuerErr) errors.issuedBy = issuerErr;

  const dateErr = validateDate(data.date);
  if (dateErr) errors.date = dateErr;

  const prioErr = validatePriority(data.priority);
  if (prioErr) errors.priority = prioErr;

  const contentErr = validateContent(data.content);
  if (contentErr) errors.content = contentErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
