import { CollegeNotice, NoticeFormData } from '../types/notice';

const STORAGE_KEY = 'campus_beacon_notices_v1';

/**
 * Storage service managing local persistence on the device.
 * Defaults strictly to an EMPTY list [] as per specifications.
 */
class NoticeStorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  /**
   * Retrieves all notices stored on the device.
   * Starts with an empty array if not previously initialized.
   */
  public getNotices(): CollegeNotice[] {
    if (!this.isBrowser()) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Strict requirement: Start with empty list; do NOT auto-populate mock data
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (err) {
      console.error('Failed to read notices from local storage:', err);
      return [];
    }
  }

  /**
   * Saves a new notice to device storage and returns the created notice.
   */
  public createNotice(data: NoticeFormData): CollegeNotice {
    const existing = this.getNotices();
    const now = Date.now();
    
    // Generate college circular reference number e.g. CB/2026/CSE/104
    const deptPrefix = data.department.split(' ')[0].substring(0, 4).toUpperCase();
    const refNum = `CB/${new Date().getFullYear()}/${deptPrefix}/${Math.floor(100 + Math.random() * 900)}`;

    const newNotice: CollegeNotice = {
      id: `notice_${now}_${Math.random().toString(36).substring(2, 7)}`,
      title: data.title.trim(),
      department: data.department.trim(),
      category: data.category,
      priority: data.priority,
      issuedBy: data.issuedBy.trim(),
      date: data.date,
      createdAt: now,
      content: data.content.trim(),
      referenceNumber: data.referenceNumber?.trim() || refNum,
      attachmentName: data.attachmentName?.trim(),
      isRead: false
    };

    const updated = [newNotice, ...existing];
    this.persist(updated);
    return newNotice;
  }

  /**
   * Updates an existing notice
   */
  public updateNotice(updatedNotice: CollegeNotice): boolean {
    const existing = this.getNotices();
    const index = existing.findIndex(n => n.id === updatedNotice.id);
    if (index === -1) return false;
    
    existing[index] = updatedNotice;
    this.persist(existing);
    return true;
  }

  /**
   * Deletes a notice by ID
   */
  public deleteNotice(id: string): boolean {
    const existing = this.getNotices();
    const filtered = existing.filter(n => n.id !== id);
    if (filtered.length === existing.length) return false;
    this.persist(filtered);
    return true;
  }

  /**
   * Marks a notice as read
   */
  public markAsRead(id: string): void {
    const existing = this.getNotices();
    const target = existing.find(n => n.id === id);
    if (target && !target.isRead) {
      target.isRead = true;
      this.persist(existing);
    }
  }

  /**
   * Get single notice by ID
   */
  public getNoticeById(id: string): CollegeNotice | null {
    const existing = this.getNotices();
    return existing.find(n => n.id === id) || null;
  }

  /**
   * Completely clears device notices
   */
  public clearAll(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Optional manual utility: seeds 3 realistic college notices for quick evaluation
   * Only called if user explicitly clicks the testing utility button.
   */
  public seedSampleNotices(): CollegeNotice[] {
    const samples: CollegeNotice[] = [
      {
        id: `notice_sample_1_${Date.now()}`,
        title: 'End-Semester Theory Examinations Schedule: Autumn Session 2026',
        department: 'Office of Examination & Evaluation',
        category: 'Examination',
        priority: 'Urgent',
        issuedBy: 'Prof. Robert Jenkins, Controller of Examinations',
        date: new Date().toISOString().split('T')[0],
        createdAt: Date.now() - 3600000 * 2,
        referenceNumber: 'EXAM/CIR/2026/891',
        content: `All students of 2nd, 3rd, and 4th Year B.Tech and M.Tech programs are hereby notified that the End-Semester Theory Examinations for the Autumn Session 2026 will commence from November 24, 2026.\n\nKey Guidelines for Candidates:\n1. Hall tickets will be downloadable via the Student Information Portal starting November 15, 2026.\n2. No student will be allowed inside the examination hall without their physical College Identity Card and printed Hall Ticket.\n3. Electronic items, programmable calculators, and smartwatches are strictly prohibited inside the hall.\n4. Reporting time at the exam hall is 30 minutes prior to paper commencement.\n\nStudents facing any discrepancy regarding subject registration or attendance shortage must report to the Examination Cell before November 12, 2026.`,
        attachmentName: 'Autumn_2026_Exam_Timetable_Draft.pdf',
        isRead: false
      },
      {
        id: `notice_sample_2_${Date.now()}`,
        title: 'Annual Campus Placement Drive: Google Cloud & Microsoft India',
        department: 'Training & Career Placement Cell',
        category: 'Placement',
        priority: 'High',
        issuedBy: 'Ms. Priya Nambiar, Head Corporate Relations',
        date: new Date().toISOString().split('T')[0],
        createdAt: Date.now() - 3600000 * 6,
        referenceNumber: 'T&P/DRIVE/2026/104',
        content: `The Training and Placement Cell is pleased to announce on-campus placement recruitment drives for final-year students (CSE, IT, ECE).\n\nRoles Offered: Associate Cloud Architect & Software Development Engineer\nCTC Package: 18.5 LPA - 24.0 LPA\nEligibility Criteria: Minimum CGPA 7.5 throughout without standing arrears.\n\nSelection Process:\n- Round 1: Online Technical & Coding Assessment (Nov 18, 2026)\n- Round 2: Technical Architecture & System Design Interviews (Nov 20, 2026)\n- Round 3: Leadership Principles & HR Interaction\n\nInterested and eligible candidates must register via the Placement Portal before November 14, 2026, 5:00 PM. Late submissions will strictly not be entertained.`,
        attachmentName: 'JD_Google_Microsoft_Campus2026.pdf',
        isRead: false
      },
      {
        id: `notice_sample_3_${Date.now()}`,
        title: 'HackCampus 2026: 36-Hour National Inter-College Hackathon',
        department: 'Computer Science & Engineering',
        category: 'Event & Cultural',
        priority: 'Normal',
        issuedBy: 'Dr. Katherine Bell, Professor & HOD CSE',
        date: new Date().toISOString().split('T')[0],
        createdAt: Date.now() - 3600000 * 24,
        referenceNumber: 'CSE/HACK/2026/44',
        content: `The Department of Computer Science & Engineering in association with the ACM Student Chapter invites teams of 2 to 4 students for HackCampus 2026!\n\nTheme Tracks:\n- Generative AI & Assistive Technologies\n- Decentralized Systems & Web3 Safety\n- Sustainable Campus Energy & Smart Grid IoT\n- Accessible Healthcare Diagnostics\n\nPrize Pool: ₹2,50,000 in cash prizes, internship sponsorships, and cloud compute credits.\nRegistration Deadline: November 20, 2026.\nVenue: Central Computing Labs, Turing Block.\nFood, refreshments, and 24x7 Wi-Fi will be arranged for all registered offline participants.`,
        attachmentName: 'HackCampus2026_Brochure.pdf',
        isRead: true
      }
    ];

    const current = this.getNotices();
    const combined = [...samples, ...current];
    this.persist(combined);
    return combined;
  }

  private persist(notices: CollegeNotice[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
    } catch (err) {
      console.error('Failed to write notices to local storage:', err);
    }
  }
}

export const noticeStorage = new NoticeStorageService();
