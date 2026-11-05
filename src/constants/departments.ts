import { DepartmentInfo, NoticeCategory, NoticePriority } from '../types/notice';

export const COLLEGE_DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'dept-cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    building: 'Turing Block - Floor 3',
    hodTitle: 'Dr. Katherine Bell, Professor & HOD',
    description: 'Undergraduate and postgraduate computing, AI research, software engineering lab updates.'
  },
  {
    id: 'dept-ece',
    name: 'Electronics & Communication',
    code: 'ECE',
    building: 'Maxwell Tower - Floor 2',
    hodTitle: 'Dr. Marcus Vance, Professor & HOD',
    description: 'VLSI design, embedded systems, robotics club, signal processing labs.'
  },
  {
    id: 'dept-mech',
    name: 'Mechanical Engineering',
    code: 'MECH',
    building: 'Carnot Pavilion - Ground Floor',
    hodTitle: 'Dr. Raymond Gallagher, HOD',
    description: 'Thermal labs, CAD/CAM design studio, SAE collegiate club, manufacturing shop.'
  },
  {
    id: 'dept-civil',
    name: 'Civil & Environmental Engineering',
    code: 'CIVIL',
    building: 'Smeaton Hall - Floor 1',
    hodTitle: 'Dr. Sunita Rao, Professor & HOD',
    description: 'Structural engineering, surveying fieldwork, environmental hydraulics.'
  },
  {
    id: 'dept-eee',
    name: 'Electrical & Electronics',
    code: 'EEE',
    building: 'Tesla Complex - Floor 2',
    hodTitle: 'Dr. Henry Chen, Professor & HOD',
    description: 'Power systems, smart grid research, electric vehicle prototyping.'
  },
  {
    id: 'dept-it',
    name: 'Information Technology',
    code: 'IT',
    building: 'Lovelace Annex - Floor 4',
    hodTitle: 'Dr. Elena Rostova, HOD',
    description: 'Cloud systems, cybersecurity, web technology, network administration.'
  },
  {
    id: 'dept-mgmt',
    name: 'Department of Management Studies',
    code: 'MBA',
    building: 'Drucker House - Floor 1',
    hodTitle: 'Prof. David Sterling, Dean MBA',
    description: 'Business analytics, campus leadership symposiums, entrepreneurship cell.'
  },
  {
    id: 'dept-exam',
    name: 'Office of Examination & Evaluation',
    code: 'EXAM',
    building: 'Administrative Quad - Wing B',
    hodTitle: 'Prof. Robert Jenkins, Controller of Exams',
    description: 'Mid-term schedules, university end-semester circulars, hall tickets, grade sheets.'
  },
  {
    id: 'dept-placement',
    name: 'Training & Career Placement Cell',
    code: 'T&P',
    building: 'Corporate Relations Center',
    hodTitle: 'Ms. Priya Nambiar, Head Corporate Relations',
    description: 'On-campus recruitment drives, internships, pre-placement talks, resume clinics.'
  },
  {
    id: 'dept-admin',
    name: 'Dean of Academic & Student Affairs',
    code: 'ACAD',
    building: 'Main Administrative Hall',
    hodTitle: 'Dr. Arthur Pendelton, Dean Academics',
    description: 'Academic calendar, fee circulars, scholarship announcements, general holidays.'
  },
  {
    id: 'dept-sports',
    name: 'Sports & Student Cultural Affairs',
    code: 'SPORTS',
    building: 'Campus Recreation Center',
    hodTitle: 'Coach Michael Vance, Director Physical Education',
    description: 'Inter-collegiate tournaments, annual cultural fest, gymnasium schedule, athletic meets.'
  },
  {
    id: 'dept-library',
    name: 'Central University Library',
    code: 'LIB',
    building: 'Knowledge Center - Central Block',
    hodTitle: 'Dr. Clara Oswald, Chief Librarian',
    description: 'Digital journal access, book returns, reading room timings, research thesis archives.'
  }
];

export const NOTICE_CATEGORIES: NoticeCategory[] = [
  'Academic',
  'Examination',
  'Placement',
  'Event & Cultural',
  'Administration',
  'Urgent Circular'
];

export const NOTICE_PRIORITIES: NoticePriority[] = ['Normal', 'High', 'Urgent'];
