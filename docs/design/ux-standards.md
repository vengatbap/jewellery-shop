# Auric One UI/UX Standards v1.0

This document defines the layout rules, interface patterns, and usability guidelines to ensure a consistent, professional, and high-efficiency user experience across all Auric One modules.

---

## 1. Design Principles
* **Enterprise First**: Focus on information density, readability, and structural efficiency rather than decorative white space.
* **Minimal Clicks**: Streamline core paths (e.g. POS Billing checkout should be completed with minimal screen transitions).
* **Keyboard First**: Critical operational tasks (POS, Inventory counts, barcode lookups) must be fully navigable using keyboard shortcuts.
* **Consistency**: Forms, lists, header bars, and navigation elements must behave identically across all modules.

---

## 2. Core UI Tech Stack
To prevent design system drift, all Auric One frontend modules must align on the following technology stack:
* **Framework**: Next.js (App Router) + React
* **Styling Engine**: Tailwind CSS
* **Core Design Tokens & Components**: `shadcn/ui` + Radix UI Primitives
* **Icons Library**: Lucide Icons
* **Forms & Validation**: React Hook Form + Zod
* **Data Ingestion**: TanStack Query (React Query) + Axios client

---

## 3. Screen Layout Standard
All pages (excluding full-screen interfaces like POS Billing) must follow this grid structure:

```
┌──────────────────────────────────────────────────────────────┐
│  Top Navigation (Brand Logo, Global Search, Tenant Switcher) │
├───────────────────┬──────────────────────────────────────────┤
│                   │  Page Header (Breadcrumbs, Action Button)│
│  Sidebar          ├──────────────────────────────────────────┤
│  Navigation       │  Filters & Search Bar                    │
│  (Domain Groups)  ├──────────────────────────────────────────┤
│                   │  Data Table (Main Workspace Grid)        │
│                   ├──────────────────────────────────────────┤
│                   │  Pagination & Info Bar                   │
└───────────────────┴──────────────────────────────────────────┘
```

---

## 4. Main Data Table Specifications
Data tables are the core of ERP interfaces and must support the following:
* **Sticky Headers**: Freeze headers when scrolling large datasets.
* **Keyboard Shortcuts**: Arrow keys to select rows; `Enter` to open row detail page.
* **Visibility Toggles**: Let users show/hide columns.
* **Export Controls**: Standard exports (CSV, Excel) must be rendered in the table toolbar.
* **Bulk Operations**: Bulk checkbox selections with floating action toolbars.

---

## 5. Form Standards
* **Grouping**: Group fields in clear subsections using cards, tabs, or accordions.
* **Feedback**: Provide inline validation errors immediately upon losing focus (on blur).
* **Warnings**: Trigger confirmation alerts if a user tries to navigate away with unsaved changes.
* **Accessors**: Mark required inputs clearly with red asterisks (`*`) and place inline helper text under inputs.

---

## 6. Color & Typographic Guidelines
* **Status Signaling**: Pair status colors (Green = Success, Yellow = Warning, Red = Error, Blue = Info, Gray = Inactive) with visible labels or icons.
* **Typography Scale**: Use a single sans-serif font family (e.g. Inter or Outfit) with strict header hierarchy (`h1` for Page Headers, `h2` for Section Titles, `h3` for Cards, `body` for forms and grids).

---

## 7. Responsive Breakpoints
* **Desktop (1024px+)**: The primary workspace. Full ERP tables, side-by-side forms, and detailed dashboards are rendered.
* **Tablet (768px - 1023px)**: Sidebars collapse to slide-out drawers. Grids shrink to essential columns.
* **Mobile (<768px)**: Focus on specialized lightweight operations: approval chains, dashboard KPI metrics, and notifications. Large transaction tables are restricted.

---

## 8. POS Billing Usability Standard
The POS Billing checkout is optimized for rapid checkout:
* **Auto-focus scan**: The search input automatically focuses on load and resets focus after each barcode scan.
* **No-mouse flow**: Scan Item ➔ Auto-insert row ➔ Keyboard shortcut `Ctrl+Enter` to proceed ➔ Select Payment Cash/Card ➔ `Enter` to finalize and print receipt.
* **Error notifications**: Out-of-stock items trigger high-visibility toast alerts.

---

## 9. Empty States
Every empty screen (such as no search matches, empty inventory, or blank CRM accounts) must contain:
1. An explanation of why the area is empty.
2. A single primary action button guiding the next step (e.g. `+ Create Customer`).
