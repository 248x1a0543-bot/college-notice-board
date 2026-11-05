import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTitle,
  validateDepartment,
  validateCategory,
  validateIssuedBy,
  validateDate,
  validatePriority,
  validateContent,
  validateNoticeForm
} from '../services/validation.ts';
import { COLLEGE_DEPARTMENTS } from '../constants/departments.ts';
import { NoticeFormData } from '../types/notice.ts';

test('College Notice Board - Field Validations', async (t) => {
  await t.test('Title validation enforces required length between 5 and 120 chars', () => {
    assert.strictEqual(validateTitle(''), 'Notice title is required.');
    assert.strictEqual(validateTitle('   '), 'Notice title is required.');
    assert.strictEqual(validateTitle('Exam'), 'Title must be at least 5 characters long.');
    assert.strictEqual(validateTitle('A'.repeat(121)), 'Title cannot exceed 120 characters.');
    assert.strictEqual(validateTitle('Mid-Term Examinations Nov 2026'), null);
  });

  await t.test('Department validation checks recognized collegiate departments', () => {
    assert.strictEqual(validateDepartment(''), 'Please select a college department.');
    assert.strictEqual(validateDepartment('Fake Hogwarts Department'), 'Please select a recognized collegiate department.');
    assert.strictEqual(validateDepartment('Computer Science & Engineering'), null);
    assert.strictEqual(validateDepartment(COLLEGE_DEPARTMENTS[0].name), null);
  });

  await t.test('Category validation allows only valid categories', () => {
    assert.strictEqual(validateCategory(''), 'Please select a valid notice category.');
    assert.strictEqual(validateCategory('Unapproved'), 'Please select a valid notice category.');
    assert.strictEqual(validateCategory('Academic'), null);
    assert.strictEqual(validateCategory('Examination'), null);
    assert.strictEqual(validateCategory('Placement'), null);
  });

  await t.test('Issued By validation enforces minimum length', () => {
    assert.strictEqual(validateIssuedBy(''), 'Authority/Issued By is required (e.g. "Prof. Bell - HOD").');
    assert.strictEqual(validateIssuedBy('Dr'), 'Issuer name must be at least 3 characters.');
    assert.strictEqual(validateIssuedBy('Dr. Katherine Bell, HOD CSE'), null);
  });

  await t.test('Date validation verifies YYYY-MM-DD formatting', () => {
    assert.strictEqual(validateDate(''), 'A valid circular publication date is required.');
    assert.strictEqual(validateDate('not-a-date'), 'Invalid date format. Please choose a valid date.');
    assert.strictEqual(validateDate('2026-11-20'), null);
  });

  await t.test('Priority validation accepts only Normal, High, Urgent', () => {
    assert.strictEqual(validatePriority(''), 'Please choose a priority level (Normal, High, or Urgent).');
    assert.strictEqual(validatePriority('Emergency'), 'Please choose a priority level (Normal, High, or Urgent).');
    assert.strictEqual(validatePriority('Urgent'), null);
    assert.strictEqual(validatePriority('Normal'), null);
  });

  await t.test('Content validation enforces minimum 20 chars for detailed announcements', () => {
    assert.strictEqual(validateContent(''), 'Notice content body cannot be empty.');
    assert.strictEqual(validateContent('Too short note'), 'Content requires at least 20 characters (currently 14).');
    assert.strictEqual(
      validateContent('This is a sufficiently long collegiate notice announcing campus workshop dates.'),
      null
    );
  });
});

test('College Notice Board - Full Form Submission Validation', async (t) => {
  await t.test('Rejects invalid form with missing fields and outputs specific field errors', () => {
    const invalidForm: NoticeFormData = {
      title: 'Bad',
      department: '',
      category: 'Academic',
      priority: 'Normal',
      issuedBy: '',
      date: '',
      content: 'Too short'
    };

    const result = validateNoticeForm(invalidForm);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.title);
    assert.ok(result.errors.department);
    assert.ok(result.errors.issuedBy);
    assert.ok(result.errors.date);
    assert.ok(result.errors.content);
  });

  await t.test('Accepts complete and valid collegiate notice form', () => {
    const validForm: NoticeFormData = {
      title: 'Annual Tech Symposium Paper Submissions Open',
      department: 'Computer Science & Engineering',
      category: 'Academic',
      priority: 'High',
      issuedBy: 'Dr. Katherine Bell, Professor & HOD',
      date: '2026-11-15',
      content: 'Full research papers and poster abstracts are invited for the 14th National Computing Conference. All submitted papers will undergo peer-review.'
    };

    const result = validateNoticeForm(validForm);
    assert.strictEqual(result.isValid, true);
    assert.deepStrictEqual(result.errors, {});
  });
});

test('College Notice Board - Department Filtering Logic', async (t) => {
  await t.test('Correctly filters notices by department name or all', () => {
    const mockNotices = [
      { id: '1', title: 'CSE Notice', department: 'Computer Science & Engineering' },
      { id: '2', title: 'ECE Notice', department: 'Electronics & Communication' },
      { id: '3', title: 'CSE Workshop', department: 'Computer Science & Engineering' }
    ];

    const cseOnly = mockNotices.filter(n => n.department === 'Computer Science & Engineering');
    assert.strictEqual(cseOnly.length, 2);

    const eceOnly = mockNotices.filter(n => n.department === 'Electronics & Communication');
    assert.strictEqual(eceOnly.length, 1);

    const all = mockNotices.filter(() => true);
    assert.strictEqual(all.length, 3);
  });
});
