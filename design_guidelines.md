# MedMap Admin Dashboard - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Utility-Focused)
- **Primary Reference:** Linear's admin aesthetic + Vercel Dashboard patterns
- **Rationale:** Admin dashboards prioritize efficiency, data density, and rapid task completion. Clear information hierarchy and consistent patterns are essential for daily operational use.

## Core Design Principles

1. **Data-First Layout:** Information takes precedence over decoration
2. **Scannable Hierarchy:** Quick visual parsing of critical metrics and actions
3. **Consistent Patterns:** Repeated UI elements for predictable workflows
4. **Contextual Density:** Dense where needed (tables), spacious where required (forms)

---

## Typography System

### Font Family
- **Primary:** Inter (via Google Fonts CDN)
- **Monospace:** JetBrains Mono (for IDs, codes, technical data)

### Hierarchy
- **Page Titles:** text-2xl font-semibold
- **Section Headers:** text-lg font-medium
- **Card Headers:** text-base font-medium
- **Body Text:** text-sm font-normal
- **Captions/Metadata:** text-xs font-normal
- **Data Tables:** text-sm (consistent readability)
- **Stats/Numbers:** text-3xl font-bold for key metrics

---

## Layout System

### Spacing Primitives
Core spacing units: **2, 4, 6, 8, 12, 16**
- Component padding: p-4, p-6
- Section spacing: space-y-6, gap-8
- Card spacing: p-6
- Table cells: px-4 py-3
- Form elements: space-y-4

### Grid Structure
- **Sidebar:** Fixed width 256px (w-64)
- **Main Content:** flex-1 with max-w-7xl container
- **Dashboard Cards:** grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- **Data Tables:** Full width with horizontal scroll on mobile

---

## Component Library

### Navigation
- **Top Bar:** Fixed header with logo, breadcrumbs, admin profile
- **Sidebar:** Persistent left navigation with sections:
  - Dashboard (overview)
  - Doctors Management
  - Patients Management
  - Appointments
  - Analytics
  - Settings
- Icon + label pattern for all nav items
- Active state: subtle background highlight

### Dashboard Cards
- **Stat Cards:** Display key metrics (Total Doctors, Active Patients, Today's Appointments, Revenue)
  - Large number (text-3xl font-bold)
  - Label below (text-sm text-muted)
  - Trend indicator (optional: up/down percentage)
  - Card padding: p-6

### Data Tables
- **Headers:** Sticky positioning, subtle background
- **Rows:** Hover state for interactivity
- **Columns:** Doctors (Name, Specialty, Province, Status, Actions), Appointments (Patient, Doctor, Date/Time, Status, Actions)
- **Status Badges:** Pill-shaped indicators (Verified, Pending, Cancelled)
- **Actions Column:** Icon buttons (View, Edit, Delete)
- **Pagination:** Bottom-right placement with page numbers

### Forms
- **Layouts:** Single column max-w-2xl for clarity
- **Input Fields:** Consistent height (h-10), full-width labels above inputs
- **Grouping:** Fieldsets with space-y-4
- **Buttons:** Primary action (right-aligned), Secondary actions (left-aligned)
- **Validation:** Inline error messages below fields

### Modals/Dialogs
- **Confirmation Dialogs:** Simple, centered overlay for delete/approval actions
- **Detail Views:** Slide-over panel from right for viewing doctor/patient profiles
- **Max Width:** max-w-md for confirmations, max-w-2xl for detailed forms

### Filters & Search
- **Search Bar:** Prominent placement above tables with icon
- **Filter Chips:** Multi-select filters (Province, Specialty, Status)
- **Date Range Picker:** For appointment and analytics filtering

---

## Page-Specific Layouts

### 1. Dashboard Overview
- **4-column stat cards** at top (grid-cols-4)
- **Recent Appointments table** (last 10 entries)
- **Charts:** Line chart for bookings trend, bar chart for province distribution
- **Quick Actions:** Approve pending doctors, view flagged reviews

### 2. Doctors Management
- **Search + Filters** at top (Province, Specialty, Verification Status)
- **Data table** with pagination
- **Bulk Actions:** Approve multiple doctors, export to CSV
- **Detail View:** Slide-over with full doctor profile, verification documents, review history

### 3. Appointments Management
- **Calendar View Toggle:** Option to switch between table and calendar layout
- **Filters:** Date range, status (Pending, Confirmed, Cancelled, Completed)
- **Table Columns:** Patient name, Doctor name, Date/Time, Status, Actions

### 4. Analytics Dashboard
- **Date Range Selector** at top
- **Grid of Charts:** 2-column layout
  - Revenue over time (line chart)
  - Bookings by specialty (pie chart)
  - Provincial distribution (bar chart)
  - Patient retention metrics (area chart)
- **Export Button:** Download reports as PDF/CSV

---

## Images

**No hero images required** - This is a data-focused admin interface.

**Profile Avatars:**
- Doctor/patient profile pictures in tables and detail views
- Circular avatars (w-10 h-10 in tables, larger in detail views)
- Fallback: Initials on colored background

**Charts/Visualizations:**
- Use charting library (Chart.js or Recharts) for data visualization
- Placeholder data during development

---

## Accessibility & Interactions

- **Focus States:** Visible keyboard focus rings on all interactive elements
- **ARIA Labels:** Proper labeling for icon-only buttons
- **Loading States:** Skeleton loaders for tables, spinner for actions
- **Error Handling:** Toast notifications for success/error messages (top-right)
- **Responsive:** Mobile-friendly with collapsible sidebar, horizontal scroll for tables

---

## Technical Notes

- **Icons:** Lucide React icons throughout
- **No animations** except subtle transitions (hover states, modal open/close)
- **Performance:** Virtual scrolling for large data tables
- **Real-time Updates:** WebSocket connection for live appointment notifications (optional indicator in top bar)