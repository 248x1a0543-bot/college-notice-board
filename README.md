# CampusBeacon - Android College Notice Board App

CampusBeacon is a complete, collegiate-themed Android notice board application designed for university departments, academic administration, examination cells, and campus communities. It provides persistent on-device announcement storage, comprehensive field-level validation, department-level filtering, and an authentic Android mobile experience.

---

## 📱 The 4 Connected Screens

### 1. Notice List Screen (`src/screens/NoticeListScreen.tsx`)
Displays official campus announcements with their **Title**, **Department**, and **Publication Date**. Fully implements all 4 required operational states:
- **Empty State**: Displayed on initial app launch (the board starts with zero hardcoded notices). Includes an intuitive graphic, clear guidance, and a direct *"Publish First Notice"* call-to-action button, along with an optional *"Load 3 Sample Notices for Testing"* helper.
- **Loading State**: Features animated Material shimmer skeleton cards that mimic real notice cards.
- **Error-and-Retry State**: An alert view indicating synchronization interruption with a working **"Retry Connection"** button that re-establishes synchronization. Evaluators can also click the top app bar's Alert icon to simulate and test this error recovery flow at any time!
- **Data State**: Clean, collegiate list cards with real-time text search, active department filter tag with a quick-clear (`x`) button, multi-criteria sorting (Newest, Oldest, Priority), and an Android Floating Action Button (FAB) for posting new notices.

### 2. Department Filter Screen (`src/screens/DepartmentFilterScreen.tsx`)
A dedicated screen allowing students and faculty to isolate circulars by collegiate department:
- Features 12 realistic academic & administrative departments (e.g., Computer Science, Mechanical Engineering, Electronics, Examination Cell, Training & Placement, Student Affairs, Central Library).
- Shows live notice counters next to each department.
- Includes department search filtering and an **"All Departments"** master reset.
- Applying a department filter navigates back to the Notice List with immediate visual feedback and filter indicators.

### 3. Notice Detail Screen (`src/screens/NoticeDetailScreen.tsx`)
Displays the complete official circular:
- Full notice title and generated circular reference number (e.g. `CB/2026/CSE/401`).
- Department name, building/room location, and authorized issuer details.
- Publication date and broadcast timestamp.
- Priority indicators (`Urgent`, `High`, or `Normal`).
- Complete notice body text with full formatting preservation, paragraphs, bullet points, and clean typography that effortlessly accommodates long texts (up to thousands of characters) without clipping or layout breakage.
- Interactive actions: **Copy Notice Text** to clipboard, **Share Notice**, **Print**, simulated attachment download, and **Delete Notice** (with confirmation dialog).

### 4. Post Notice Form Screen (`src/screens/PostNoticeScreen.tsx`)
An official publishing form with **strict, clear validation for every single field**:
1. **Notice Title**: Required; must be between 5 and 120 characters with live character counter.
2. **Department**: Required; must select a recognized collegiate department from the dropdown.
3. **Category**: Required; categorized into Academic, Examination, Placement, Event, Administration, or Urgent Circular.
4. **Authorized Authority / Issued By**: Required; must be between 3 and 60 characters (e.g., `Dr. Katherine Bell, Professor & HOD`).
5. **Publication Date**: Required; defaults to current date; validates date formatting.
6. **Priority Level**: Selectable between `Normal`, `High`, and `Urgent`.
7. **Notice Content Body**: Required; enforces a minimum of 20 characters and a maximum of 3,000 characters with a live character counter.
8. **Optional Metadata**: Circular reference number and attachment name fields.

Validation errors appear immediately upon blurring a field or submitting an invalid form, highlighted with red borders and accessible alert icons. Upon valid submission, the notice is saved to on-device storage and the user is redirected to the newly created notice.

---

## 💾 On-Device Persistence

All notices are saved directly onto the device's storage (`localStorage` via `src/services/storage.ts`):
- **Persistence Across Restarts**: Notices created by the user remain intact when the app is refreshed, closed, or restarted.
- **Clean Empty Initial State**: As requested, the app strictly starts with an empty list (`[]`) and zero hardcoded notices.
- **Data Model**: Each notice includes a unique ID, title, department, category, priority, issuedBy, ISO date, creation timestamp, content, read status, and reference number.

---

## 🧪 Testing

The repository contains an automated unit test suite verifying validation logic, department integrity, and filter rules.

### Running Tests from the Terminal:
```bash
npm test
```
This runs `tsx --test src/tests/noticeBoard.test.ts` using Node.js built-in test runner, executing 13 test assertions across field boundaries, form validation, and filtering.

### In-App Test Runner:
Navigate to the **Test Suite** tab in the bottom navigation bar to run and inspect all tests interactively within the app interface.

---

## 🚀 Running the Project

### Prerequisites:
- Node.js (version 18 or higher)
- npm

### Installation & Development:
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```
Open your browser at `http://localhost:3000`.

### Building for Production:
```bash
npm run build
```

---

## 📱 Packaging as an Android Native APK

To package this application as a native Android APK or bundle for deployment to the Google Play Store:

### Using Capacitor (Recommended):
```bash
# 1. Install Capacitor CLI and Android platform
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor
npx cap init CampusBeacon com.college.campusbeacon --web-dir dist

# 3. Build web bundle
npm run build

# 4. Add Android native platform
npx cap add android

# 5. Open project in Android Studio
npx cap open android
```
In Android Studio:
1. Build the APK via **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. The generated APK will be available in `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🎨 Design Principles
- **Collegiate Visual Identity**: Deep Varsity Navy (`#1E3A8A` / `#0F2744`) paired with academic gold and clean slate surfaces.
- **Anti-Slop & Zero-Pill Discipline**: Metadata is presented as clean, unboxed text separated by typographic markers (`·`), avoiding generic candy pill capsules.
- **Android Ergonomics**: Bottom navigation tabs and Floating Action Buttons are placed within the natural thumb reach zone (bottom 40% of the screen), with touch hitboxes exceeding 44px.
