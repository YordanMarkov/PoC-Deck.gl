# Redbeech OS Style Guide

> **Visual Design System Reference**
> For external teams building standalone look-alike interfaces.
>
> Design philosophy: **Apple Human Interface Guidelines + Glassmorphism**
> Stack: React 18, Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Motion (Framer Motion)

---

## Table of Contents

1. [Foundations](#1-foundations)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius](#5-border-radius)
6. [Shadows](#6-shadows)
7. [Glassmorphism](#7-glassmorphism)
8. [Animations & Transitions](#8-animations--transitions)
9. [Buttons](#9-buttons)
10. [Inputs & Form Controls](#10-inputs--form-controls)
11. [Cards](#11-cards)
12. [Badges](#12-badges)
13. [Dialogs & Modals](#13-dialogs--modals)
14. [Panels (Left / Right)](#14-panels-left--right)
15. [TopBar](#15-topbar)
16. [BottomBar](#16-bottombar)
17. [Tabs](#17-tabs)
18. [Accordions](#18-accordions)
19. [Tooltips](#19-tooltips)
20. [Dropdowns & Context Menus](#20-dropdowns--context-menus)
21. [Skeleton Loaders](#21-skeleton-loaders)
22. [Status Colors](#22-status-colors)
23. [Node Shapes (Workflow Canvas)](#23-node-shapes-workflow-canvas)
24. [Icon System](#24-icon-system)
25. [Z-Index Layers](#25-z-index-layers)
26. [Responsive Breakpoints](#26-responsive-breakpoints)
27. [Dark Mode](#27-dark-mode)
28. [Login & Auth Screens](#28-login--auth-screens)
29. [Accessibility](#29-accessibility)
30. [CSS Custom Properties Reference](#30-css-custom-properties-reference)

---

## 1. Foundations

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| CSS Framework | Tailwind CSS v4 | Utility-first styling |
| Component Primitives | Radix UI | Accessible headless components |
| Class Merging | `clsx` + `tailwind-merge` | Conflict-free class composition |
| Class Variants | `class-variance-authority` (CVA) | Type-safe component variants |
| Icons | Lucide React | Consistent icon library |
| Animation | Motion (`motion/react`) | Spring-based animations |
| Font | Red Hat Display (400, 500, 600, 700) | Brand typeface |

### Utility Function: `cn()`

All components use a shared `cn()` utility for merging Tailwind classes without conflicts:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Font Import

```css
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700&display=swap');
```

Red Hat Display is the primary brand font used throughout the application. Apply it via `font-family: 'Red Hat Display', sans-serif`.

---

## 2. Color System

### CSS Custom Properties (Light Mode)

```css
:root {
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);           /* Near-black */
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);                  /* White */
  --popover-foreground: oklch(0.145 0 0);
  --primary: #030213;                        /* Deep navy-black */
  --primary-foreground: oklch(1 0 0);        /* White */
  --secondary: oklch(0.95 0.0058 264.53);   /* Very light blue-gray */
  --secondary-foreground: #030213;
  --muted: #ececf0;                          /* Light gray */
  --muted-foreground: #717182;               /* Medium gray */
  --accent: #e9ebef;                         /* Light cool gray */
  --accent-foreground: #030213;
  --destructive: #d4183d;                    /* Red */
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);             /* Subtle border */
  --input: transparent;
  --input-background: #f3f3f5;              /* Input fill */
  --switch-background: #cbced4;             /* Toggle off state */
  --ring: oklch(0.708 0 0);                 /* Focus ring */
  --radius: 0.625rem;                       /* 10px default radius */
}
```

### Dark Mode Properties

```css
.dark {
  --background: oklch(0.145 0 0);           /* Very dark */
  --foreground: oklch(0.985 0 0);           /* Near-white */
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);              /* Near-white */
  --primary-foreground: oklch(0.205 0 0);   /* Dark */
  --secondary: oklch(0.269 0 0);            /* Dark gray */
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --border: oklch(0.269 0 0);
  --destructive: oklch(0.396 0.141 25.723);
}
```

### Semantic Text Colors (Tailwind)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `text.primary` | `text-gray-900` | `dark:text-white` | Headings, primary content |
| `text.secondary` | `text-gray-600` | `dark:text-gray-300` | Supporting text |
| `text.tertiary` | `text-gray-500` | `dark:text-gray-400` | Labels, metadata |
| `text.muted` | `text-gray-400` | `dark:text-gray-500` | Disabled, placeholder |

### Accent Color Pairs

Used for badges, tags, and category highlights:

| Color | Light Background | Light Text | Dark Background | Dark Text |
|-------|-----------------|------------|-----------------|-----------|
| Blue | `bg-blue-50` | `text-blue-700` | `dark:bg-blue-900/20` | `dark:text-blue-400` |
| Purple | `bg-purple-50` | `text-purple-700` | `dark:bg-purple-900/20` | `dark:text-purple-400` |
| Green | `bg-green-50` | `text-green-700` | `dark:bg-green-900/20` | `dark:text-green-400` |
| Red | `bg-red-50` | `text-red-700` | `dark:bg-red-900/20` | `dark:text-red-400` |

### Brand Color: Apple Blue

The system uses Apple's signature blue `#007AFF` for hover states and call-to-action emphasis, particularly on login/auth screens.

```css
/* Hover state pattern */
.hover:text-[#007AFF]
.group-hover:from-[#007AFF] .group-hover:to-[#0051D5]
```

### Gradient Accents

Primary action gradients used consistently for icon containers and CTA buttons:

```
/* Blue-Indigo (primary action) */
bg-gradient-to-br from-blue-500 to-indigo-600
hover:from-blue-600 hover:to-indigo-700

/* Green (create/success action) */
bg-gradient-to-br from-emerald-500 to-green-600
hover:from-emerald-600 hover:to-green-700

/* Page backgrounds */
bg-gradient-to-br from-blue-50 to-indigo-100
dark:from-gray-900 dark:to-gray-800

/* Session expired / error */
bg-gradient-to-br from-gray-50 to-gray-100
dark:from-gray-900 dark:to-gray-800
```

---

## 3. Typography

### Font Weights

| Weight | Token | Usage |
|--------|-------|-------|
| 400 | `font-normal` / `--font-weight-normal` | Body text |
| 500 | `font-medium` / `--font-weight-medium` | Labels, nav items |
| 600 | `font-semibold` | Section titles, dialog headers |
| 700 | `font-bold` | Page titles, emphasis |

### Text Sizes (common patterns)

| Class | Size | Usage |
|-------|------|-------|
| `text-2xl font-semibold` | 1.5rem | Login headers, page titles |
| `text-lg font-semibold` | 1.125rem | Dialog titles, section headers |
| `text-sm font-medium` | 0.875rem | Button labels, list items |
| `text-sm` | 0.875rem | Body text in panels |
| `text-xs font-medium` | 0.75rem | Badges, metadata |
| `text-xs` | 0.75rem | Timestamps, helper text |

### Line Height Tokens

```
leading-tight   → 1.25
leading-normal  → 1.5
leading-relaxed → 1.625
```

### Text Truncation

```
truncate        → Single-line overflow with ellipsis
line-clamp-2    → Multi-line clamp at 2 lines
```

---

## 4. Spacing & Layout

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | `0.25rem` (4px) | Tight gaps, icon margins |
| sm | `0.5rem` (8px) | Inline spacing, small padding |
| md | `1rem` (16px) | Standard gaps, section padding |
| lg | `1.5rem` (24px) | Panel padding, between sections |
| xl | `2rem` (32px) | Page margins, large spacing |

### Dialog Spacing

```
padding:     p-6       → 1.5rem all sides
gap:         gap-6     → 1.5rem between sections
section-gap: gap-4     → 1rem within sections
```

### Dropdown Spacing

```
container:   p-2       → 0.5rem
item:        px-3 py-2.5 → Comfortable click target
```

### Common Layout Patterns

```html
<!-- Full-page centered layout -->
<div class="min-h-screen flex items-center justify-center px-4">

<!-- Two-column panel layout -->
<div class="flex-1 flex min-h-0">
  <div class="w-[340px] flex-shrink-0 border-r"><!-- Left --></div>
  <div class="flex-1 min-w-0"><!-- Right --></div>
</div>

<!-- Grid layouts -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 5. Border Radius

| Token | Class | Value | Usage |
|-------|-------|-------|-------|
| Small | `rounded-lg` | 0.5rem (8px) | Badges, small buttons, inputs |
| Medium | `rounded-xl` | 0.75rem (12px) | Cards, buttons, inputs, dropdowns |
| Large | `rounded-2xl` | 1rem (16px) | Dialogs, panels, large containers |
| Extra Large | `rounded-3xl` | 1.5rem (24px) | Login cards, start screens, full-page modals |
| Full | `rounded-full` | 50% | Avatars, toggle switches, pills |
| System | `--radius` | 0.625rem (10px) | Default component radius |

### Usage Hierarchy

- `rounded-3xl` — Top-level containers: login cards, workspace selector, start screen
- `rounded-2xl` — Mid-level containers: floating panels, dialogs, settings, process panels
- `rounded-xl` — Interactive elements: buttons, icon containers, inputs, inner cards
- `rounded-lg` — Small elements: dropdown items, badges, small buttons
- `rounded-md` — Base UI primitives (shadcn defaults)

---

## 6. Shadows

### Standard Tailwind Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation: bottom bars, zoom indicators |
| `shadow-md` | Dropdown menus, popovers |
| `shadow-lg` | Floating panels, sidebars |
| `shadow-2xl` | Primary dialogs, login cards, modals |

### Custom Glassmorphism Shadows

The application uses custom shadow tokens for glass-like elevation:

| Class | Description | Typical usage |
|-------|-------------|---------------|
| `shadow-glass` | Soft medium shadow for floating glass panels | Left/right panels, navigation menus, cards |
| `shadow-glass-2xl` | Stronger shadow for major glass containers | Start screens, browse dialogs, large modals |

**Note:** These are custom shadow utilities. If your Tailwind config doesn't include them, define them as:

```css
/* Approximate definitions — adjust to taste */
.shadow-glass {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.02);
}

.shadow-glass-2xl {
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.02);
}
```

---

## 7. Glassmorphism

The core visual identity. Glass surfaces combine semi-transparent backgrounds with backdrop blur and subtle borders.

### Glass Tokens

```ts
const GLASS = {
  background: {
    light: 'bg-white/90',          // Standard glass
    dark: 'dark:bg-gray-800/90',
    lightSoft: 'bg-white/60',      // Softer glass (less opaque)
    darkSoft: 'dark:bg-gray-800/60',
  },
  blur: {
    soft: 'backdrop-blur-sm',      // 4px  — backdrops, overlays
    medium: 'backdrop-blur',       // 8px  — secondary surfaces
    strong: 'backdrop-blur-xl',    // 24px — primary panels, dialogs
  },
  border: {
    light: 'border-gray-200/50',   // Semi-transparent border
    dark: 'dark:border-gray-700/50',
  },
};
```

### Glass Surface Recipes

**Standard Panel** (Left Panel, Right Panel, Cards):
```
bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
border border-gray-200/50 dark:border-gray-700/50
rounded-2xl shadow-glass
```

**Strong Panel** (Dialogs, Settings, Modals):
```
bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl
border border-gray-200/50 dark:border-gray-700/50
rounded-2xl shadow-glass
```

**Extra Strong Surface** (Login, Start Screen, Browse Dialog):
```
bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl
border border-gray-200/50 dark:border-gray-700/50
rounded-3xl shadow-2xl
```

**Dialog Backdrop**:
```
fixed inset-0 bg-black/50 backdrop-blur-sm
```

**Soft Overlay Backdrop** (Chat, lightweight dialogs):
```
fixed inset-0 bg-black/20 backdrop-blur-sm
```

### Auth/Login Glass (Stone palette)

Login and authentication screens use `stone` colors instead of `gray`:
```
bg-white/95 backdrop-blur-xl
border border-stone-200/50
rounded-3xl shadow-2xl
```

---

## 8. Animations & Transitions

### Animation Duration Tokens

```ts
const ANIMATION = {
  duration: {
    fast: 0.15,    // Button presses, toggles
    normal: 0.2,   // Dialogs, panels
    slow: 0.3,     // Page transitions
  },
};
```

### Apple Easing Curves

```ts
const EASING = {
  standard: [0.16, 1, 0.3, 1],   // Smooth deceleration (primary)
  enter: [0, 0, 0.2, 1],          // Element entering
  exit: [0.4, 0, 1, 1],           // Element leaving
};
```

### CSS Theme Transition

```css
:root {
  transition:
    background-color var(--theme-transition-duration, 0ms) cubic-bezier(0.4, 0, 0.2, 1),
    color var(--theme-transition-duration, 0ms) cubic-bezier(0.4, 0, 0.2, 1),
    border-color var(--theme-transition-duration, 0ms) cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Motion (Framer Motion) Patterns

**Dialog enter/exit:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.96, y: 8 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.96, y: 8 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
/>
```

**Backdrop fade:**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.15 }}
  className="fixed inset-0 bg-black/50 backdrop-blur-sm"
/>
```

**Staggered list items:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
/>
```

### Interactive State Classes

```
hover:scale-[1.02]       → Subtle grow on hover
active:scale-[0.98]      → Press feedback
hover:opacity-80          → Fade on hover
hover:brightness-95       → Dim on hover
disabled:opacity-60       → Disabled state
disabled:cursor-not-allowed
```

### Shimmer Animation (Skeleton loaders)

```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
```

### Walking Ants (React Flow edges)

```css
.react-flow__edge.animated path {
  stroke-dasharray: 10 5;
  animation: dashdraw 0.8s linear infinite;
}

@keyframes dashdraw {
  from { stroke-dashoffset: 15; }
  to   { stroke-dashoffset: 0; }
}
```

---

## 9. Buttons

Built with `class-variance-authority` (CVA) for type-safe variants.

### Base Classes

```
inline-flex items-center justify-center gap-2
whitespace-nowrap rounded-md text-sm font-medium
transition-all
disabled:pointer-events-none disabled:opacity-50
outline-none
focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
```

### Variants

| Variant | Classes | Usage |
|---------|---------|-------|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/90` | Primary actions |
| `destructive` | `bg-destructive text-white hover:bg-destructive/90` | Delete, remove |
| `outline` | `border bg-background text-foreground hover:bg-accent` | Secondary actions |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` | Tertiary actions |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` | Toolbar buttons, inline |
| `link` | `text-primary underline-offset-4 hover:underline` | Text links |

### Sizes

| Size | Classes | Usage |
|------|---------|-------|
| `sm` | `h-8 rounded-md gap-1.5 px-3` | Compact buttons |
| `default` | `h-9 px-4 py-2` | Standard buttons |
| `lg` | `h-10 rounded-md px-6` | Prominent buttons |
| `icon` | `size-9 rounded-md` | Icon-only buttons |

### Custom Button Patterns

**Gradient CTA Button** (login/auth):
```html
<button class="w-full group relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-stone-900 to-stone-800
    group-hover:from-[#007AFF] group-hover:to-[#0051D5]
    rounded-xl transition-all duration-300 group-hover:scale-[1.02]" />
  <div class="relative px-6 py-4 flex items-center justify-between">
    <!-- Content -->
  </div>
</button>
```

**Toolbar/Panel Button** (ghost-like):
```
p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50
rounded-lg transition-colors
```

**Confirm Button** (dialogs):
```
px-5 py-2 text-sm font-medium
bg-blue-600 hover:bg-blue-700 text-white
rounded-xl transition-colors
disabled:opacity-50 disabled:cursor-not-allowed
shadow-sm
```

**Cancel Button** (dialogs):
```
px-4 py-2 text-sm font-medium
text-gray-600 dark:text-gray-400
hover:text-gray-900 dark:hover:text-white
transition-colors
```

**Close Icon Button** (dialogs, panels):
```
p-2 rounded-lg
text-gray-400 hover:text-gray-600
dark:hover:text-gray-300
hover:bg-gray-100 dark:hover:bg-gray-700/50
transition-colors
```

---

## 10. Inputs & Form Controls

### Text Input

```
flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base md:text-sm
bg-input-background
border-input
placeholder:text-muted-foreground
transition-[color,box-shadow] outline-none
focus-visible:border-ring
focus-visible:ring-ring/50
focus-visible:ring-[3px]
disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
```

Dark mode additions:
```
dark:bg-input/30
```

### Search Input Pattern

```html
<div class="relative">
  <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <input
    class="w-full pl-9 pr-3 py-2 text-sm
      bg-gray-50 dark:bg-gray-700/50
      border border-gray-200 dark:border-gray-600
      rounded-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    placeholder="Search..."
  />
</div>
```

### Select Trigger

```
flex w-full items-center justify-between gap-2
rounded-md border bg-input-background px-3 py-2 text-sm
border-input
focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
h-9
```

### Switch / Toggle

```
inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full
border border-transparent transition-all outline-none

/* States */
data-[state=checked]:bg-primary
data-[state=unchecked]:bg-switch-background
dark:data-[state=unchecked]:bg-input/80
```

### Checkbox

Standard Radix checkbox with `size-4 rounded-sm border border-primary`.

---

## 11. Cards

### Base Card

```
bg-card text-card-foreground
flex flex-col gap-6 rounded-xl border
```

### Card Anatomy

| Part | Class |
|------|-------|
| Card | `rounded-xl border bg-card` |
| CardHeader | `px-6 pt-6` |
| CardTitle | `leading-none` |
| CardDescription | `text-muted-foreground` |
| CardContent | `px-6 [&:last-child]:pb-6` |
| CardFooter | `flex items-center px-6 pb-6` |

### Glass Card Pattern (used in projects, dashboards)

```
bg-white/80 dark:bg-gray-800/80
backdrop-blur-xl rounded-2xl
border border-gray-200/50 dark:border-gray-700/50
p-6 shadow-glass
```

### Stat Card Pattern

```
rounded-xl border border-gray-200 dark:border-gray-700
bg-gradient-to-br from-blue-50 to-blue-100
dark:from-blue-900/20 dark:to-blue-800/20
p-4
```

Color variants: blue, emerald, amber, violet (same gradient pattern).

---

## 12. Badges

### Base Badge

```
inline-flex items-center justify-center rounded-md
border px-2 py-0.5 text-xs font-medium
w-fit whitespace-nowrap shrink-0
transition-[color,box-shadow]
```

### Badge Variants

| Variant | Classes |
|---------|---------|
| `default` | `border-transparent bg-primary text-primary-foreground` |
| `secondary` | `border-transparent bg-secondary text-secondary-foreground` |
| `destructive` | `border-transparent bg-destructive text-white` |
| `outline` | `text-foreground` (border from base) |

### Status Badge Pattern

```
bg-blue-500 text-white       → Active
bg-emerald-500 text-white    → Done
bg-amber-500 text-white      → Waiting
bg-gray-500 text-white       → Not started
bg-rose-500 text-white       → Failed
```

---

## 13. Dialogs & Modals

### Dialog Overlay (Backdrop)

```
fixed inset-0 z-50
bg-black/50 backdrop-blur-sm
```

With animation:
```
data-[state=open]:animate-in data-[state=closed]:animate-out
data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
```

### Dialog Content (Radix-based)

```
fixed top-[50%] left-[50%] z-50
translate-x-[-50%] translate-y-[-50%]
w-full max-w-[calc(100%-2rem)] sm:max-w-lg
bg-background border rounded-lg p-6 shadow-lg
gap-4 duration-200
```

### Custom Glass Dialog (primary pattern)

Used for most application-specific modals:

```html
<!-- Overlay -->
<div class="fixed inset-0 z-[9999] flex items-center justify-center
  bg-black/50 backdrop-blur-sm p-4">

  <!-- Content -->
  <div class="w-full max-w-6xl h-[90vh] max-h-[860px]
    bg-white dark:bg-gray-800
    rounded-2xl shadow-2xl
    border border-gray-200/50 dark:border-gray-700/50
    flex flex-col overflow-hidden">

    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4
      border-b border-gray-200/50 dark:border-gray-700/50
      bg-gradient-to-r from-blue-50/80 to-indigo-50/40
      dark:from-blue-900/20 dark:to-indigo-900/10">
      <!-- Icon + Title + Close button -->
    </div>

    <!-- Body -->
    <div class="flex-1 flex min-h-0">
      <!-- Content panels -->
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between px-6 py-3.5
      border-t border-gray-200/50 dark:border-gray-700/50
      bg-gray-50/80 dark:bg-gray-900/30">
      <!-- Info text + Cancel + Confirm buttons -->
    </div>
  </div>
</div>
```

### Dialog Header Pattern

```
flex items-center gap-3

/* Icon container */
w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30
flex items-center justify-center

/* Title */
text-lg font-semibold text-gray-900 dark:text-white

/* Subtitle */
text-xs text-gray-500 dark:text-gray-400
```

### Dialog Footer Pattern

```
flex items-center justify-between px-6 py-3.5
border-t border-gray-200/50 dark:border-gray-700/50
bg-gray-50/80 dark:bg-gray-900/30
```

### Dialog Sizes (by `max-w-`)

| Size | Class | Usage |
|------|-------|-------|
| Small | `max-w-md` | Confirmations, alerts |
| Medium | `max-w-lg` | Settings sections |
| Large | `max-w-2xl` | Create forms |
| X-Large | `max-w-4xl` | Settings dialog, browse projects |
| XX-Large | `max-w-5xl` | Chat, edit parameters |
| Full | `max-w-6xl` | Mission selector, dashboards |

---

## 14. Panels (Left / Right)

Floating glass panels positioned with fixed/absolute positioning.

### Left Panel

```
bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
border rounded-2xl shadow-glass
h-full flex flex-col overflow-hidden select-none
transition-all duration-200
```

With drag-over highlight state:
```
border-blue-500 dark:border-blue-400
ring-4 ring-blue-500/50 dark:ring-blue-400/50
shadow-blue-200 dark:shadow-blue-800 shadow-xl
```

Default (no drag):
```
border-gray-200/50 dark:border-gray-700/50
```

### Right Panel

```
bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
border border-gray-200/50 dark:border-gray-700/50
rounded-2xl shadow-glass
h-full flex flex-col overflow-hidden select-none
```

### Sidebar Panel (Notion/Deeproot)

```
fixed left-6 top-32 bottom-6 w-[320px] z-30
overflow-hidden rounded-2xl
border border-gray-200/50 dark:border-gray-700/50
bg-white/80 dark:bg-gray-800/80
shadow-lg backdrop-blur-xl
```

---

## 15. TopBar

```
h-16 bg-white border-t border-gray-200
flex items-center justify-between px-6 shadow-sm
```

The TopBar is module-aware with responsive breakpoints and overflow menus.

### TopBar Element Sizing

- Height: `h-16` (64px)
- Padding: `px-6`
- Border: `border-b border-gray-200`

---

## 16. BottomBar

```
h-16 bg-white border-t border-gray-200
flex items-center justify-between px-6 shadow-sm
```

### Toolbar Button Pattern

```
p-2 hover:bg-gray-100 rounded-lg transition-colors
```

Active toggle state:
```
p-2 bg-blue-100 text-blue-600 rounded-lg
```

---

## 17. Tabs

### Tab List

```
bg-muted text-muted-foreground
inline-flex h-9 w-fit items-center justify-center
rounded-xl p-[3px]
```

### Tab Trigger

```
inline-flex h-[calc(100%-1px)] flex-1
items-center justify-center gap-1.5
rounded-xl border border-transparent
px-2 py-1 text-sm font-medium whitespace-nowrap
transition-[color,box-shadow]

/* Active state */
data-[state=active]:bg-card
dark:data-[state=active]:border-input
dark:data-[state=active]:bg-input/30
```

### Tab Content

```
flex-1 outline-none
```

---

## 18. Accordions

### Accordion Item

```
border-b last:border-b-0
```

### Accordion Trigger

```
flex flex-1 items-start justify-between gap-4
rounded-md py-4 text-left text-sm font-medium
transition-all outline-none hover:underline

/* Chevron rotation */
[&[data-state=open]>svg]:rotate-180
```

### Chevron Icon

```
text-muted-foreground pointer-events-none size-4 shrink-0
translate-y-0.5 transition-transform duration-200
```

### Accordion Content

```
overflow-hidden text-sm
data-[state=closed]:animate-accordion-up
data-[state=open]:animate-accordion-down
```

---

## 19. Tooltips

### Tooltip Content

```
bg-primary text-primary-foreground
z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance

/* Arrow */
bg-primary fill-primary z-50 size-2.5
translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]
```

### Entry Animations

```
animate-in fade-in-0 zoom-in-95
data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2
```

---

## 20. Dropdowns & Context Menus

### Dropdown Content

```
bg-popover text-popover-foreground
z-50 min-w-[8rem] overflow-x-hidden overflow-y-auto
rounded-md border p-1 shadow-md
```

### Dropdown Item

```
relative flex cursor-default items-center
gap-2 rounded-sm px-2 py-1.5 text-sm
outline-hidden select-none
focus:bg-accent focus:text-accent-foreground
data-[disabled]:pointer-events-none data-[disabled]:opacity-50
```

### CMDK (Command Palette)

```css
[cmdk-group-heading] {
  text-xs font-semibold text-gray-500 dark:text-gray-400
  px-3 py-2 uppercase tracking-wider
}

[cmdk-item] {
  outline-none
}

[cmdk-empty] {
  py-6 text-center text-sm text-gray-500 dark:text-gray-400
}

[cmdk-separator] {
  h-px bg-gray-200 dark:bg-gray-700 -mx-2 my-2
}
```

---

## 21. Skeleton Loaders

### Base Skeleton

```
animate-pulse rounded-md bg-accent
```

### Custom Skeleton (gradient shimmer)

```
animate-pulse
bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
bg-[length:200%_100%]
rounded
```

### Glass Skeleton Container (project cards)

```
bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
rounded-2xl p-6
border border-gray-200/50 dark:border-gray-700/50
```

### LazyLoad Fallback (loading spinner)

```html
<div class="flex h-full w-full items-center justify-center p-8
  bg-gray-50 dark:bg-gray-900">

  <!-- Outer glow -->
  <div class="absolute h-12 w-12 rounded-full
    bg-blue-500/20 blur-xl animate-pulse" />

  <!-- Glass container -->
  <div class="relative flex h-12 w-12 items-center justify-center
    rounded-xl bg-white/80 dark:bg-gray-800/80
    backdrop-blur-md
    border border-gray-200/50 dark:border-gray-700/50
    shadow-lg">

    <!-- Spinner -->
    <div class="h-6 w-6 animate-spin rounded-full
      border-2 border-gray-200 dark:border-gray-600
      border-t-blue-500 dark:border-t-blue-400" />
  </div>
</div>
```

---

## 22. Status Colors

Used for workflow node states, badges, and progress indicators.

### Node Box Colors

| Status | Background | Border | Text |
|--------|-----------|--------|------|
| Not started | `bg-gray-100` | `border-gray-300` | `text-gray-600` |
| Active | `bg-blue-50` | `border-blue-400` | `text-blue-900` |
| Waiting | `bg-amber-50` | `border-amber-400` | `text-amber-900` |
| Done | `bg-emerald-50` | `border-emerald-400` | `text-emerald-900` |
| Failed | `bg-rose-50` | `border-rose-400` | `text-rose-900` |

### Status Badge Colors

| Status | Background | Text |
|--------|-----------|------|
| Not started | `bg-gray-500` | `text-white` |
| Active | `bg-blue-500` | `text-white` |
| Waiting | `bg-amber-500` | `text-white` |
| Done | `bg-emerald-500` | `text-white` |
| Failed | `bg-rose-500` | `text-white` |

### SVG Fill/Stroke Colors (for canvas nodes)

| Status | Fill | Stroke | Text |
|--------|------|--------|------|
| Not started | `#f3f4f6` | `#d1d5db` | `#4b5563` |
| Active | `#eff6ff` | `#60a5fa` | `#1e3a8a` |
| Waiting | `#fffbeb` | `#fbbf24` | `#78350f` |
| Done | `#f0fdf4` | `#34d399` | `#065f46` |
| Failed | `#fef2f2` | `#f87171` | `#7f1d1d` |

### Color Scheme Palette (10 schemes)

Available for node categorization: `gray`, `blue`, `purple`, `amber`, `emerald`, `rose`, `indigo`, `teal`, `orange`, `pink`.

Each follows the same pattern:
```
boxColors:     bg-{color}-50 border-{color}-400 text-{color}-900
badgeColors:   bg-{color}-500 text-white
svgColors:     { fill, stroke, text } hex values
tooltipColors: { bg, border, text, progressBg, progressBar }
```

---

## 23. Node Shapes (Workflow Canvas)

Workflow nodes on the React Flow canvas use these visual patterns:

### Standard Node

```
p-4 rounded-xl border-2
border-{status-color} bg-{status-bg}
w-64
```

### Selected Edge

```css
.react-flow__edge.selected path {
  stroke: #3b82f6 !important;        /* blue-500 */
  stroke-width: 2 !important;
  filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.6));
}
```

### Blocking Edge

```css
.react-flow__edge path[stroke="#ef4444"] {
  filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.4));
}
```

### Edge Hover

```css
.react-flow__edge:hover path {
  opacity: 0.8;
  filter: drop-shadow(0 0 2px rgba(148, 163, 184, 0.5));
  transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out;
}
```

---

## 24. Icon System

Using **Lucide React** exclusively. Common icon sizes:

| Token | Class | Pixel Size | Usage |
|-------|-------|-----------|-------|
| Small | `w-4 h-4` | 16px | List items, inline icons, button icons |
| Medium | `w-5 h-5` | 20px | Section headers, buttons, nav items |
| Large | `w-6 h-6` | 24px | Dialog headers, emphasis |
| X-Large | `w-8 h-8` | 32px | Profile badges, large indicators |

### Icon Container Pattern (gradient)

```
w-9 h-9 rounded-xl
bg-blue-100 dark:bg-blue-900/30
flex items-center justify-center

/* Icon inside */
w-4.5 h-4.5 text-blue-600 dark:text-blue-400
```

Larger variant for dashboards:
```
w-12 h-12 rounded-xl
bg-gradient-to-br from-blue-500 to-indigo-600
flex items-center justify-center
```

### SVG Icon Defaults (in buttons)

```
[&_svg]:pointer-events-none
[&_svg:not([class*='size-'])]:size-4
[&_svg]:shrink-0
```

---

## 25. Z-Index Layers

| Token | Value | Usage |
|-------|-------|-------|
| Floating panels | `z-30` | Left/right panels |
| TopBar | `z-40` | Top navigation bar |
| Sidebar nav | `z-50` | Navigation menu, dropdowns |
| Dropdown menus | `z-[100]` | Select, context, dropdown menus |
| Modals/Dialogs | `z-[1000]` | Settings, browse, edit dialogs |
| Command Palette | `z-[10000]` | Global command palette (Cmd+K) |
| Mission Dialog | `z-[9999]` | SelectMission, overlays |
| Toasts | `z-[20000]` | Sonner toast notifications |

---

## 26. Responsive Breakpoints

```ts
const BREAKPOINTS = {
  mobile: 640,       // < 640px
  tablet: 768,       // 768–1023px
  desktop: 1024,     // 1024–1279px
  wide: 1280,        // 1280–1439px
  extraWide: 1440,   // >= 1440px
};
```

### TopBar Responsive Behavior

| Tier | Width | Behavior |
|------|-------|----------|
| Extra Wide | >= 1440px | All elements visible |
| Wide | 1280–1439px | Progress moves to overflow |
| Desktop | 1024–1279px | Progress + Collaboration + Filters + AI in overflow |
| Tablet | 768–1023px | All context elements in overflow menu |
| Mobile | < 768px | Project selector also in overflow |

### Visibility Constants

```
ALWAYS_VISIBLE   → Never goes to overflow
HIDE_ON_TABLET   → Overflow on tablet and below
HIDE_ON_DESKTOP  → Overflow on desktop and below
HIDE_ON_WIDE     → Overflow on wide and below
HIDE_ON_MOBILE   → Overflow only on mobile
```

---

## 27. Dark Mode

### Activation

Dark mode is toggled via a `.dark` class on a parent element. Tailwind v4 uses:

```css
@custom-variant dark (&:is(.dark *));
```

### Common Dark Mode Patterns

| Light | Dark |
|-------|------|
| `bg-white` | `dark:bg-gray-800` |
| `bg-white/80` | `dark:bg-gray-800/80` |
| `bg-white/95` | `dark:bg-gray-800/95` |
| `bg-gray-50` | `dark:bg-gray-900` |
| `bg-gray-100` | `dark:bg-gray-800` |
| `text-gray-900` | `dark:text-white` |
| `text-gray-600` | `dark:text-gray-300` |
| `text-gray-500` | `dark:text-gray-400` |
| `border-gray-200` | `dark:border-gray-700` |
| `border-gray-200/50` | `dark:border-gray-700/50` |
| `hover:bg-gray-100` | `dark:hover:bg-gray-700/50` |

### Dark Glass Surface

```
dark:bg-gray-800/80 backdrop-blur-xl
dark:border-gray-700/50
```

---

## 28. Login & Auth Screens

Auth screens use a **stone** color palette instead of gray for warmth.

### Login Container

```
min-h-screen flex items-center justify-center
bg-gradient-to-br from-stone-100 to-stone-200
```

### Login Card

```
bg-white/95 backdrop-blur-xl
border border-stone-200/50
rounded-3xl shadow-2xl overflow-hidden
```

### Login Background Pattern

```css
.login-bg-pattern {
  background-image: url("data:image/svg+xml,..."); /* Plus-sign grid */
}
```

### Button Hierarchy (auth)

1. **Primary** — Gradient button with hover to Apple blue
2. **Secondary** — `border-2 border-stone-200 rounded-xl hover:border-stone-300 hover:bg-stone-50`
3. **Tertiary** — `text-stone-700 hover:text-[#007AFF]`
4. **Register** — `border border-stone-300 text-stone-700 rounded-xl hover:border-stone-400 hover:bg-white`

### Footer Section

```
bg-stone-100 px-8 py-6
```

### Text Style (auth)

```
text-stone-900   → Headings
text-stone-600   → Subtitles
text-stone-500   → Helper text
text-stone-300   → Muted labels (on dark bg)
```

---

## 29. Accessibility

### WCAG 2.1 AA Compliance

| Requirement | Target |
|------------|--------|
| Normal text contrast | 4.5:1 minimum |
| Large text contrast | 3:1 minimum |
| UI component contrast | 3:1 minimum |

### Required Patterns

```html
<!-- Screen reader text -->
<span class="sr-only">Close dialog</span>

<!-- ARIA labels on icon buttons -->
<button aria-label="Close dialog">
  <X class="w-4 h-4" aria-hidden="true" />
</button>

<!-- Live regions for dynamic content -->
<div role="status" aria-live="polite">
  {statusMessage}
</div>

<!-- Dialog semantics -->
<div role="dialog" aria-modal="true" aria-label="Select Mission">

<!-- Loading states -->
<div role="status" aria-label="Loading content" aria-live="polite">
```

### Focus Ring Pattern

```
outline-none
focus-visible:border-ring
focus-visible:ring-ring/50
focus-visible:ring-[3px]
```

Custom focus for specific elements:
```
focus:ring-2 focus:ring-blue-500/50 focus:outline-none
```

### Keyboard Navigation

- `Escape` closes dialogs/modals
- `Enter` / `Space` activates buttons
- Focus trap inside open modals
- Tab order follows visual layout

---

## 30. CSS Custom Properties Reference

### Complete Light Theme Variables

```css
:root {
  /* Core */
  --font-size: 16px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --radius: 0.625rem;

  /* Surfaces */
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);

  /* Interactive */
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;

  /* Neutral */
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;

  /* Borders & Inputs */
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --switch-background: #cbced4;
  --ring: oklch(0.708 0 0);

  /* Typography */
  --font-weight-medium: 500;
  --font-weight-normal: 400;

  /* Charts */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);

  /* Sidebar */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: #030213;
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}
```

### Theme Transition Curve

```css
:root {
  transition:
    background-color var(--theme-transition-duration, 0ms) cubic-bezier(0.4, 0, 0.2, 1),
    color var(--theme-transition-duration, 0ms) cubic-bezier(0.4, 0, 0.2, 1),
    border-color var(--theme-transition-duration, 0ms) cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Quick Start: Building a Look-Alike

To replicate the Redbeech OS visual language in a standalone project:

1. **Install dependencies:**
   ```
   tailwindcss v4, @radix-ui/react-*, lucide-react, motion, clsx, tailwind-merge, class-variance-authority
   ```

2. **Import the font:**
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700&display=swap');
   ```

3. **Copy the CSS custom properties** from Section 30 into your root CSS.

4. **Apply the glass pattern** to all floating containers:
   ```
   bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg
   ```

5. **Use the `cn()` utility** for all class composition.

6. **Use the Apple easing curve** `[0.16, 1, 0.3, 1]` for all Motion animations.

7. **Follow the z-index layer system** strictly for proper stacking.

8. **Test both light and dark modes** — every element needs explicit dark variants.

---

**Last Updated:** March 2026
**Version:** 1.0
**Source System:** Redbeech OS v23.3
