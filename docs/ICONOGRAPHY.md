# ShinGiTai Iconography

Status: Batch 7.1 Identity System
Owner: ArticSakuraTech / ShinGiTai Holding Groupe
Last updated: 2026-07-03

## Purpose

This document defines basic icon usage rules for ShinGiTai Language and future ShinGiTai ecosystem products.

## Core Rule

Icons support the interface. They do not replace the official logo.

The official ShinGiTai and ShinGiTai Language logos must come from approved brand assets.

## Current Icon Library

The app currently uses `lucide-react`.

This is acceptable for product UI icons because it is clean, lightweight and consistent.

## Icon Style

Preferred style:

- outline icons,
- consistent stroke width,
- minimal detail,
- readable at small sizes,
- consistent color usage.

Avoid:

- mixing many icon packs,
- using product UI icons as final logos,
- inconsistent stroke widths,
- decorative icons that reduce clarity.

## Sizes

```text
xs: 12px
sm: 16px
md: 20px
lg: 24px
xl: 32px
hero: 48px+
```

Default interface icon size:

```text
20px
```

## Navigation Examples

Suggested mapping:

- Dashboard: layout icon
- Lessons: book icon
- Tutor: message icon
- Flashcards: layers icon
- Grammar: text icon
- Achievements: trophy icon
- Settings: gear icon

## Logo Rules

The following are not final logos:

- generic UI icons,
- framework default icons,
- random generated marks,
- unapproved symbols.

Approved logo assets must be stored in:

```text
public/brand/
```

Planned files:

```text
public/brand/shingitai-holding-logo.svg
public/brand/articsakura-logo.svg
public/brand/shingitai-language-logo.svg
public/brand/shingitai-language-icon.svg
```

## Favicon Rules

The favicon must be derived from the approved ShinGiTai Language icon.

Do not use temporary generic icons in production.

## Future Work

Create shared brand components later:

```text
src/components/brand/AppIcon.tsx
src/components/brand/ProductLogo.tsx
```

This will keep icon sizing, labels and logo rendering consistent across the ecosystem.
