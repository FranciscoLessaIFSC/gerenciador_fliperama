# Arcade App Style Guide

This document defines the visual system for the whole project.

- Client App: game-facing interface for players.
- Admin App: operational interface for staff and managers.

Use these standards to keep both products visually consistent while preserving role-specific identity.

## 1. Design Principles

1. Fast readability in low-light environments.
2. High contrast for kiosk and desktop displays.
3. Clear hierarchy for game data, balance, and controls.
4. Minimal cognitive load for admin workflows.
5. Reusable design tokens before custom one-off values.

## 2. Theme Strategy

The app has one shared token system and two visual profiles.

- Shared Foundation: neutrals, spacing, typography scale, radius, shadows, state colors.
- Client Profile: vibrant, playful, arcade-forward accents.
- Admin Profile: cleaner, calmer accents optimized for data management.

## 3. Color Tokens

## 3.1 Core Palette (Shared)

| Token | Value | Usage |
|---|---|---|
| `--color-bg-root` | `#0B1020` | Base app background |
| `--color-bg-surface` | `#141B34` | Cards, panels |
| `--color-bg-elevated` | `#1A2342` | Modals, sticky bars |
| `--color-border` | `#2B3762` | Default borders/dividers |
| `--color-text-primary` | `#F3F6FF` | Main text |
| `--color-text-secondary` | `#B4BFDF` | Secondary text |
| `--color-text-muted` | `#7F8BB0` | Tertiary/support text |

## 3.2 Semantic Colors (Shared)

| Token | Value | Usage |
|---|---|---|
| `--color-success` | `#22C55E` | Success status, confirmations |
| `--color-warning` | `#F59E0B` | Warning notices |
| `--color-danger` | `#EF4444` | Errors, destructive actions |
| `--color-info` | `#38BDF8` | Informational banners |

### Semantic Surface Tints

| Token | Value |
|---|---|
| `--color-success-soft` | `#0E2B1B` |
| `--color-warning-soft` | `#332406` |
| `--color-danger-soft` | `#3A1418` |
| `--color-info-soft` | `#0C2634` |

## 3.3 Client Profile Colors

| Token | Value | Usage |
|---|---|---|
| `--client-primary` | `#00E5FF` | Main call-to-action, highlights |
| `--client-secondary` | `#FF3D9A` | Secondary actions, chips |
| `--client-accent` | `#A3FF12` | Counters, scores, badges |
| `--client-glow` | `#00B8D4` | Neon borders and focus glows |

### Client Gradient

`--client-gradient-main: linear-gradient(135deg, #00E5FF 0%, #FF3D9A 55%, #A3FF12 100%);`

## 3.4 Admin Profile Colors

| Token | Value | Usage |
|---|---|---|
| `--admin-primary` | `#4F7CFF` | Primary actions and links |
| `--admin-secondary` | `#14B8A6` | Secondary actions |
| `--admin-accent` | `#F97316` | Alerts and KPI highlights |
| `--admin-focus` | `#7AA2FF` | Keyboard focus ring |

### Admin Gradient

`--admin-gradient-main: linear-gradient(135deg, #4F7CFF 0%, #14B8A6 100%);`

## 3.5 Accessibility Rules for Color

1. Normal text contrast ratio must be at least 4.5:1.
2. Large text (18px+ regular or 14px+ bold) must be at least 3:1.
3. Status colors should always include icon and/or text label, not color alone.
4. Focus indication must be visible and at least 2px thickness.

## 4. Typography

## 4.1 Font Families

- Client headings: `"Bungee", "Segoe UI", sans-serif`
- Client body: `"Space Grotesk", "Segoe UI", sans-serif`
- Admin headings/body: `"Plus Jakarta Sans", "Segoe UI", sans-serif`
- Mono data: `"JetBrains Mono", Consolas, monospace`

## 4.2 Type Scale

| Token | Size / Line Height | Usage |
|---|---|---|
| `--text-xs` | `12px / 16px` | Labels, metadata |
| `--text-sm` | `14px / 20px` | Secondary body text |
| `--text-md` | `16px / 24px` | Default body |
| `--text-lg` | `18px / 28px` | Emphasized body |
| `--text-xl` | `24px / 32px` | Section headings |
| `--text-2xl` | `32px / 40px` | Page headings |

## 4.3 Font Weights

- `--weight-regular: 400`
- `--weight-medium: 500`
- `--weight-semibold: 600`
- `--weight-bold: 700`

## 5. Spacing, Layout, and Sizing

## 5.1 Spacing Scale

| Token | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |

## 5.2 Radius

- `--radius-sm: 8px`
- `--radius-md: 12px`
- `--radius-lg: 16px`
- `--radius-xl: 24px`
- `--radius-pill: 999px`

## 5.3 Shadows

- `--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25)`
- `--shadow-md: 0 8px 24px rgba(0, 0, 0, 0.32)`
- `--shadow-lg: 0 16px 36px rgba(0, 0, 0, 0.4)`
- `--shadow-neon-client: 0 0 0 1px rgba(0, 229, 255, 0.45), 0 0 20px rgba(0, 229, 255, 0.35)`

## 5.4 Container Widths

- Mobile: `100%` with `16px` horizontal padding.
- Tablet: max-width `768px`.
- Desktop: max-width `1200px`.
- Admin data pages: max-width `1360px`.

## 6. Component Style Rules

## 6.1 Buttons

### Shared

- Height: `40px` default, `48px` large.
- Horizontal padding: `16px` default.
- Border radius: `12px`.
- Transition: `160ms ease`.

### Variants

- Primary Client: fill with `--client-gradient-main`, dark text `#04101A`.
- Primary Admin: solid `--admin-primary`, text `#FFFFFF`.
- Secondary: transparent with 1px border in profile secondary color.
- Danger: fill `--color-danger`, text `#FFFFFF`.

### Interaction States

- Hover: brightness +6%.
- Active: scale to `0.98` and reduce brightness by 6%.
- Disabled: opacity `0.45`, no shadow, cursor `not-allowed`.

## 6.2 Inputs and Selects

- Background: `--color-bg-elevated`
- Border: `1px solid --color-border`
- Text: `--color-text-primary`
- Placeholder: `--color-text-muted`
- Focus ring:
  - Client pages: `0 0 0 3px rgba(0, 229, 255, 0.35)`
  - Admin pages: `0 0 0 3px rgba(122, 162, 255, 0.35)`

## 6.3 Cards

- Background: `--color-bg-surface`
- Border: `1px solid --color-border`
- Radius: `--radius-lg`
- Padding: `--space-6`
- Elevation: `--shadow-md`

## 6.4 Tables (Admin)

- Header background: `#121A33`
- Row hover background: `#1D274A`
- Divider color: `--color-border`
- Numeric columns: right-aligned with `JetBrains Mono`

## 6.5 Status Chips

- Success: bg `--color-success-soft`, text `--color-success`
- Warning: bg `--color-warning-soft`, text `--color-warning`
- Error: bg `--color-danger-soft`, text `--color-danger`
- Info: bg `--color-info-soft`, text `--color-info`

## 7. Iconography and Imagery

1. Use rounded stroke icons (2px stroke) for consistency.
2. Keep icon sizes at 16px, 20px, or 24px.
3. Client art can use glow and gradient overlays.
4. Admin visuals should prioritize clean charts and simple pictograms.

## 8. Motion Guidelines

- Base transition duration: `160ms`.
- Enter animation duration: `260ms` with ease-out.
- Modal enter: slight scale from `0.98` to `1` with fade.
- Avoid infinite decorative animations in admin screens.
- Respect reduced motion via `@media (prefers-reduced-motion: reduce)`.

## 9. CSS Token Starter

Use this starter in shared stylesheets.

```css
:root {
  --color-bg-root: #0B1020;
  --color-bg-surface: #141B34;
  --color-bg-elevated: #1A2342;
  --color-border: #2B3762;
  --color-text-primary: #F3F6FF;
  --color-text-secondary: #B4BFDF;
  --color-text-muted: #7F8BB0;

  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #38BDF8;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.32);
  --shadow-lg: 0 16px 36px rgba(0, 0, 0, 0.4);
}

[data-theme="client"] {
  --theme-primary: #00E5FF;
  --theme-secondary: #FF3D9A;
  --theme-accent: #A3FF12;
  --theme-focus: rgba(0, 229, 255, 0.35);
  --theme-gradient: linear-gradient(135deg, #00E5FF 0%, #FF3D9A 55%, #A3FF12 100%);
}

[data-theme="admin"] {
  --theme-primary: #4F7CFF;
  --theme-secondary: #14B8A6;
  --theme-accent: #F97316;
  --theme-focus: rgba(122, 162, 255, 0.35);
  --theme-gradient: linear-gradient(135deg, #4F7CFF 0%, #14B8A6 100%);
}
```

## 10. Naming and Governance

1. Never hardcode color hex values inside components when a token exists.
2. New tokens must be added here before implementation.
3. Prefer semantic token names (`--color-danger`) over context names (`--red-500`).
4. Any visual change PR should include:
   - Updated token usage reference.
   - Before/after screenshot for client and admin when relevant.

## 11. Future Documentation

Next recommended docs after this file:

1. UI component inventory (buttons, forms, tables, modals) with screenshots.
2. Responsive behavior matrix for key pages.
3. Accessibility checklist and keyboard navigation map.
