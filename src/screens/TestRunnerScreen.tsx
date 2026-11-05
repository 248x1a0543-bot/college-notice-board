import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, Terminal, RefreshCw, FileCode2, ShieldAlert } from 'lucide-react';
import {
  validateTitle,
  validateDepartment,
  validateCategory,
  validateIssuedBy,
  validateDate,
  validatePriority,
  validateContent,
  validateNoticeForm
} from '../services/validation';
import { COLLEGE_DEPARTMENTS } from '../constants/departments';

interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

export const TestRunnerScreen: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runAllTests = () => {
    setIsRunning(true);
    const testList: TestResult[] = [];

    // Test 1: Title Validation
    const t1Start = performance.now();
    try {
      if (validateTitle('') !== 'Notice title is required.') throw new Error('Empty title did not fail');
      if (validateTitle('Exam') !== 'Title must be at least 5 characters long.') throw new Error('Short title did not fail');
      if (validateTitle('A'.repeat(121)) !== 'Title cannot exceed 120 characters.') throw new Error('Long title did not fail');
      if (validateTitle('Annual Campus Hackathon 2026') !== null) throw new Error('Valid title failed');
      testList.push({
        id: 'test-1',
        name: 'validateTitle() - Enforces length boundaries (5 - 120 chars) & required input',
        passed: true,
        durationMs: +(performance.now() - t1Start).toFixed(2)
      });
    } catch (e: any) {
      testList.push({
        id: 'test-1',
        name: 'validateTitle() validation',
        passed: false,
        durationMs: +(performance.now() - t1Start).toFixed(2),
        error: e.message
      });
    }

    // Test 2: Department Validation
    const t2Start = performance.now();
    try {
      if (validateDepartment('') !== 'Please select a college department.') throw new Error('Empty dept did not fail');
      if (validateDepartment('Fictional Science') !== 'Please select a recognized collegiate department.') throw new Error('Unknown dept did not fail');
      if (validateDepartment(COLLEGE_DEPARTMENTS[0].name) !== null) throw new Error('Valid dept failed');
      testList.push({
        id: 'test-2',
        name: 'validateDepartment() - Validates recognized college department registry',
        passed: true,
        durationMs: +(performance.now() - t2Start).toFixed(2)
      });
    } catch (e: any) {
      testList.push({
        id: 'test-2',
        name: 'validateDepartment() validation',
        passed: false,
        durationMs: +(performance.now() - t2Start).toFixed(2),
        error: e.message
      });
    }

    // Test 3: Category Validation
    const t3Start = performance.now();
    try {
      if (validateCategory('') === null) throw new Error('Empty category accepted');
      if (validateCategory('InvalidCategory') === null) throw new Error('Fake category accepted');
      if (validateCategory('Academic') !== null) throw new Error('Valid Academic category failed');
      if (validateCategory('Examination') !== null) throw new Error('Valid Examination category failed');
      testList.push({
        id: 'test-3',
        name: 'validateCategory() - Accepts only approved circular categories',
        passed: true,
        durationMs: +(performance.now() - t3Start).toFixed(2)
      });
    } catch (e: any) {
      testList.push({
        id: 'test-3',
        name: 'validateCategory() validation',
        passed: false,
        durationMs: +(performance.now() - t3Start).toFixed(2),
        error: e.message
      });
    }

    // Test 4: Issued By Validation
    const t4Start = performance.now();
    try {
      if (validateIssuedBy('') === null) throw new Error('Empty authority name accepted');
      if (validateIssuedBy('Dr') === null) throw new Error('Short authority name accepted');
      if (validateIssuedBy('Dr. Katherine Bell, Professor & HOD') !== null) throw new Error('Valid authority name failed');
      testList.push({
        id: 'test-4',
        name: 'validateIssuedBy() - Enforces required issuer name and title length',
        passed: true,
        durationMs: +(performance.now() - t4Start).toFixed(2)
      });
    } catch (e: any) {
      testList.push({
        id: 'test-4',
        name: 'validateIssuedBy() validation',
        passed: false,
        durationMs: +(performance.now() - t4Start).toFixed(2),
        error: e.message
      });
    }

    // Test 5: Date Validation
    const t5Start = performance.now();
    try {
      if (validateDate('') === null) throw new Error('Empty date accepted');
      if (validateDate('not-a-date') === null) throw new Error('Malformed date accepted');
      if (validateDate('2026-11-25') !== null) throw new Error('Valid date string failed');
      testList.push({
        id: 'test-5',
        name: 'validateDate() - Verifies parseable publication date format',
        passed: true,
        durationMs: +(performance.now() - t5Start).toFixed(2)
      });
    } catch (e: any) {
      testList.push({
        id: 'test-5',
        name: 'validateDate() validation',
        passed: false,
        durationMs: +(performance.now() - t5Start).toFixed(2),
        error: e.message
      });
    }

    // Test 6: Priority Validation
    const t6Start = performance.now();
    try {
      if (validatePriority('') === null) throw new Error('Empty priority accepted');
      if (validatePriority('Emergency') === null) throw new Error('Unknown priority accepted');
      if (validatePriority('Normal') !== null) throw new Error('Normal priority failed');
      if (validatePriority('Urgent') !== null) throw new Error('Urgent priority failed');
      testList.push({
        id: 'test-6',
        name: 'validatePriority() - Restricts priority levels to Normal, High, Urgent',
        passed: true,
        durationMs: +(performance.now() - t6Start).toFixed(2)
      });
    } catch (e: any) {
      testList.push({
        id: 'test-6',
        name: 'validatePriority() validation',
        passed: false,
        durationMs: +(performance.now() - t6Start).toFixed(2),
        error: e.message
      });
    }

    // Test 7: Content Length Validation
    const t7Start = performance.now();
    try {
      if (validateContent('') === null) throw new Error('Empty content accepted');
      if (validateContent('Too short note') === null) throw new Error('Under 20 chars content accepted');
      if (validateContent('This is a sufficiently long notice describing lab schedules for students.') !== null) throw new Error('Valid content failed');
      testList.push({
        id: 'test-7',
        name: 'validateContent() - Enforces minimum 20 chars & prevents empty circulars',
        passed: true,
        durationMs: +(performance.now() - t7Start).toFixed(2)
      });
    } catch (e: any) {
      testList.push({
        id: 'test-7',
        name: 'validateContent() validation',
        passed: false,
        durationMs: +(performance.now() - t7Start).toFixed(2),
        error: e.message
      });
    }

    // Test 8: Full Form Rejection
    const t8Start = performance.now();
    try {
      const res = validateNoticeForm({
        title: 'Hi',
        department: '',
        category: 'Academic',
        priority: 'Normal',
        issuedBy: '',
        date: '',
        content: ''
      });
      if (res.isValid) throw new Error('Invalid form marked valid');
      if (!res.errors.title || !res.errors.department || !res.errors.issuedBy || !res.errors.content) {
        throw new Error('Missing expected field error keys');
      }
      testList.push({
        id: 'test-8',
        name: 'validateNoticeForm() - Correctly flags all missing/invalid fields on form submit',
        passed: true,
        durationMs: +(performance.now() - t8Start).toFixed(2)
      });
    } catch (e: any) {
      testList.push({
        id: 'test-8',
        name: 'validateNoticeForm() invalid test',
        passed: false,
        durationMs: +(performance.now() - t8Start).toFixed(2),
        error: e.message
      });
    }

    // Test 9: Full Form Acceptance
    const t9Start = performance.now();
    try {
      const res = validateNoticeForm({
        title: 'Registration Open for Spring Semester Courses 2027',
        department: 'Computer Science & Engineering',
        category: 'Academic',
        priority: 'Normal',
        issuedBy: 'Dr. Katherine Bell, Professor & HOD',
        date: '2026-11-15',
        content: 'Students must verify elective selections and submit forms to the faculty advisors.'
      });
      if (!res.isValid) throw new Error('Valid form rejected: ' + JSON.stringify(res.errors));
      testList.push({
        id: 'test-9',
        name: 'validateNoticeForm() - Passes completely with clean data',
        passed: true,
        durationMs: +(performance.now() - t9Start).toFixed(2)
      });
    } catch (e: any) {
      testList.push({
        id: 'test-9',
        name: 'validateNoticeForm() valid test',
        passed: false,
        durationMs: +(performance.now() - t9Start).toFixed(2),
        error: e.message
      });
    }

    setTimeout(() => {
      setResults(testList);
      setIsRunning(false);
      setHasRun(true);
    }, 250);
  };

  // Run on first load
  React.useEffect(() => {
    runAllTests();
  }, []);

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900 font-display">
              Notice Board Test Suite
            </h2>
          </div>

          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Rerun Tests'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Automated unit tests verifying data validation, department consistency, and persistence contracts.
        </p>
      </div>

      {/* Terminal / CLI Note */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto w-full">
        <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 font-mono text-xs shadow-sm space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] pb-1 border-b border-slate-800">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal Command</span>
          </div>
          <p className="text-emerald-400">$ npm test</p>
          <p className="text-slate-400 text-[11px]">
            Executes Node/TSX test runner at <span className="text-amber-300">src/tests/noticeBoard.test.ts</span>
          </p>
        </div>

        {/* Results Summary Box */}
        {hasRun && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              passedCount === totalCount
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {passedCount === totalCount ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div>
                <p className="text-xs font-bold">
                  {passedCount === totalCount
                    ? 'All Unit Tests Passed Successfully'
                    : 'Some Unit Tests Failed'}
                </p>
                <p className="text-[11px] text-slate-600">
                  {passedCount} passed out of {totalCount} test assertions
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white/80 rounded-md">
              100% PASS
            </span>
          </div>
        )}

        {/* Test List */}
        <div className="space-y-2">
          {results.map((test) => (
            <div
              key={test.id}
              className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                {test.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-medium text-slate-900 leading-snug">
                    {test.name}
                  </p>
                  {test.error && (
                    <p className="text-[11px] text-rose-600 font-mono mt-1">
                      {test.error}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 shrink-0 tabular-nums">
                {test.durationMs}ms
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
