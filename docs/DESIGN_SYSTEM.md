# ShinGiTai Design System

Status: Batch 7.1 Identity System
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Purpose

This document defines the first shared design system foundation for ShinGiTai Language and future ShinGiTai ecosystem products.

It is intentionally product-agnostic where possible so it can later become part of ShinGiTai Core.

## Design Principles

### 1. Premium clarity

Every screen should make the next action obvious.

No visual clutter. No noise. No random decorative elements.

### 2. AI-first, human-controlled

AI features should feel powerful but understandable.

The user should always know what the AI is doing and what they can do next.

### 3. Modular ecosystem

Components should be reusable across:

- Language,
- Forge,
- OpenAI,
- Hub,
- future apps.

### 4. Dark by default

The primary visual identity uses a dark interface.

Light mode may come later, but dark mode is the canonical first-class experience.

### 5. Calm motion

Animations should support orientation and feedback.

They should never slow the user down.

## Color Tokens

### Core

```text
--sgt-background: #09090B
--sgt-surface:    #111113
--sgt-card:       #18181B
--sgt-border:     #27272A
--sgt-text:       #FAFAFA
--sgt-muted:      #A1A1AA
```

### Accent

```text
--sgt-blue:       #3B82F6
--sgt-cyan:       #06B6D4
--sgt-violet:     #6D28D9
--sgt-white:      #FFFFFF
```

### Semantic

```text
--sgt-success:    #22C55E
--sgt-warning:    #F59E0B
--sgt-danger:     #EF4444
--sgt-info:       #38BDF8
```

### Gradients

Primary brand gradient:

```text
linear-gradient(135deg, #3B82F6 0%, #06B6D4 45%, #6D28D9 100%)
```

Subtle surface gradient:

```text
linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))
```

## Radius

```text
xs:  6px
sm:  8px
md:  12px
lg:  16px
xl:  24px
2xl: 32px
full: 9999px
```

Preferred product surfaces:

- cards: 24px,
- buttons: 12px to 16px,
- panels: 24px to 32px,
- app windows: 28px to 32px.

## Spacing

Use a 4px base scale.

```text
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
```

## Typography

Until a final font decision is made, use a modern system stack.

Recommended:

```text
font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
font-mono: JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace
```

Type scale:

```text
caption:  12px / 16px
body-sm:  14px / 20px
body:     16px / 24px
body-lg:  18px / 28px
h4:       20px / 28px
h3:       24px / 32px
h2:       32px / 40px
h1:       48px / 56px
hero:     64px / 72px
```

## Shadows

Use shadows sparingly.

```text
soft:   0 12px 40px rgba(0, 0, 0, 0.28)
glow:   0 0 40px rgba(59, 130, 246, 0.26)
panel:  0 24px 80px rgba(0, 0, 0, 0.36)
```

## Borders

Use subtle borders to define surfaces in dark mode.

```text
border-default: rgba(255, 255, 255, 0.10)
border-strong:  rgba(255, 255, 255, 0.18)
border-glow:    rgba(59, 130, 246, 0.32)
```

## Components

### Button

Primary:

- brand gradient,
- strong contrast,
- subtle glow on hover,
- no noisy animation.

Secondary:

- dark surface,
- subtle border,
- hover lift or border highlight.

Danger:

- semantic red,
- no gradient unless part of a destructive confirmation flow.

### Card

Cards should feel like premium panels:

- rounded corners,
- soft border,
- dark surface,
- optional subtle gradient,
- no heavy drop shadow unless elevated.

### Badge

Use for state and metadata.

Examples:

- A1,
- N5,
- Active,
- Premium,
- Beta,
- AI.

### Sidebar

Future shared navigation pattern:

- product logo area,
- primary navigation,
- secondary tools,
- account area,
- Hub entry point.

## Motion Tokens

```text
fast:     120ms
standard: 180ms
slow:     260ms
premium:  420ms
```

Easing:

```text
ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1)
ease-out:      cubic-bezier(0.16, 1, 0.3, 1)
```

## Accessibility

Minimum expectations:

- text contrast must be readable,
- focus states must be visible,
- icon-only buttons need labels,
- important state cannot be color-only,
- keyboard navigation should not be broken.

## Future Extraction To ShinGiTai Core

Candidate future shared modules:

```text
packages/shingitai-core/design-tokens
packages/shingitai-core/ui
packages/shingitai-core/icons
packages/shingitai-core/theme
```

This document should become the starting point for that extraction.
