# Auric One ERP — Design System Specifications (`v1.0.0-rc1`)

## 1. Visual Philosophy & Identity
The Auric One frontend design language blends **luxury jewellery aesthetics** with **high-density enterprise SaaS performance**. It emphasizes quiet luxury, warm tones, and high information clarity.

- **Foundation:** Warm Light Ivory (`#FDFBF7`), Off-White (`#FAF8F5`), Pure Elevated White (`#FFFFFF`).
- **Primary Highlight Accent:** Refined Champagne Gold (`hsl(38, 65%, 42%)` / `#B18224`). Gold is reserved strictly for primary accents, brand iconography, and active highlighted states.
- **Text & Contrast:** Deep Charcoal (`#0F172A`), Muted Slate (`#64748B`), and subtle warm borders (`#E8E3DA`).
- **Domain Status Pastels:** Soft Champagne, Soft Peach, Lavender, Powder Blue, Soft Mint, and Muted Rose.

---

## 2. Centralized CSS Tokens (`apps/web/src/app/globals.css`)

```css
:root {
  --background: 40 33% 98%;      /* #FDFBF7 Light Ivory */
  --foreground: 222 47% 11%;     /* #0F172A Deep Charcoal */

  --card: 0 0% 100%;             /* #FFFFFF Pure White for Cards */
  --card-foreground: 222 47% 11%;

  --primary: 38 65% 42%;         /* #B18224 Refined Champagne Gold */
  --primary-foreground: 40 33% 98%;

  --secondary: 40 25% 94%;       /* #F5F1EA Warm Neutral */
  --accent: 42 60% 94%;          /* #FAF4E5 Soft Gold Highlight */
  --border: 38 20% 89%;          /* #E8E3DA Subtle Warm Border */
  --radius: 0.5rem;              /* 8px restrained border radius */

  /* Domain Status Pastels */
  --jewellery-gold: 38 65% 42%;
  --jewellery-champagne: 42 65% 94%;
  --jewellery-peach: 22 90% 94%;
  --jewellery-lavender: 265 70% 95%;
  --jewellery-powder: 205 80% 94%;
  --jewellery-pink: 340 75% 95%;
  --jewellery-mint: 145 60% 93%;
}
```

---

## 3. Core Component Library Architecture

```text
apps/web/src/
├── app/                        # Next.js App Router Routes
│   ├── page.tsx                # Executive Dashboard Reference Page
│   ├── pos/page.tsx            # POS Terminal Checkout Experience
│   ├── products/page.tsx       # Barcoded Product Catalog & Stock
│   ├── customers/page.tsx      # Customer CRM & KYC Verification
│   └── globals.css             # Centralized CSS Design Tokens
├── components/
│   ├── ui/                     # Primitives (Button, Card, Badge, Input, StatusBadge)
│   ├── layout/                 # Shell Architecture (AppShell, Sidebar, Topbar)
│   └── domain/                 # Business UI Widgets (ExecutiveDashboard, GoldRateCard)
└── lib/
    └── utils.ts                # `cn()`, `formatCurrency()`, `formatWeight()`, `formatPercentage()`
```

---

## 4. Status Badge Standard Mapping

| Domain Status | Visual Palette Variant | Background / Text Accent |
| :--- | :---: | :--- |
| `IN_STOCK`, `COMPLETED`, `PAID`, `ACTIVE` | `mint` | Soft Mint (`#EBF7F1`) / Dark Green (`#1E7E4E`) |
| `RESERVED`, `PENDING`, `IN_TRANSIT` | `powder` | Powder Blue (`#EEF6FB`) / Dark Blue (`#1B6497`) |
| `TRANSFERRED`, `REDEEMED` | `lavender` | Lavender (`#F4EFFC`) / Purple (`#6B3BA7`) |
| `REPAIR`, `MELTING` | `peach` | Soft Peach (`#FDF2E9`) / Burnt Orange (`#B85B14`) |
| `SOLD`, `CLOSED` | `gray` | Muted Gray (`#F1F5F9`) / Slate Charcoal (`#334155`) |
| `CANCELLED`, `DEFAULTED`, `AUCTIONED` | `destructive` | Soft Crimson (`#FEF2F2`) / Red (`#991B1B`) |

---

## 5. Data Display Formatting Standards

- **Currencies:** `formatCurrency(amount, "BHD")` $\rightarrow$ `BHD 1,250.000` (3 decimal places for BHD/OMR/KWD, 2 for SAR/AED/USD/INR).
- **Weights:** `formatWeight(grams)` $\rightarrow$ `48.500 g` (3 decimal places).
- **Percentages:** `formatPercentage(value)` $\rightarrow$ `2.50%` (2 decimal places).
