# SOMA Portfolio: Project History

**Status:** 🟢 LIVE | **Domain:** https://eeshans.com | **Stack:** Astro + PostHog + Supabase

---

## Overview

This document captures the complete history of the SOMA Portfolio project — from a Hugo blog to a production-ready monorepo with the Build With Me open-source education platform.

**Total Development Time:** ~40+ hours across 9 phases

---

## Document Index

| # | Document | Status | Description |
|---|----------|--------|-------------|
| 0 | `0_HISTORY_project-log.md` | 📋 Reference | This file — project history & doc index |
| 1 | `1_ARCHIVE_hugo-to-astro-migration-plan.md` | ✅ Complete | Detailed 6-phase migration plan from Hugo to Astro |
| 2 | `2_ARCHIVE_hugo-to-astro-migration-summary.md` | ✅ Complete | Migration summary, timeline, critical fixes |
| 3 | `3_ARCHIVE_posthog-integration-verification.md` | ✅ Complete | PostHog & Streamlit integration checklist |
| 4 | `4_ARCHIVE_architecture-visual-guide.md` | ✅ Complete | Visual architecture diagrams (pre-monorepo, 3-repo setup) |
| 5 | `5_ARCHIVE_ab-simulator-blueprint.md` | ✅ Complete | A/B Simulator technical spec & data pipeline |
| 6 | `6_ARCHIVE_build-with-me-page-plan.md` | ✅ Complete | Original Build With Me page implementation plan |
| 7 | `7_ACTIVE_build-with-me-vision.md` | 🟢 Active | Vision, manifesto, strategy for Build With Me |
| 8 | `8_ACTIVE_monorepo-architecture.md` | 🟢 Active | Current monorepo structure, phases 1-4 complete |
| 9 | `9_ACTIVE_build-with-me-enhancements.md` | 🟢 Active | Enhancement backlog for Build With Me platform |

---

## Phase Timeline

### Phase 0: Hugo Blog Foundation (Sept 2025)
**State:** Hugo (Go templates) + Custom CSS (130 lines) + Vanilla JS (489 lines)  
**Problem:** Everything custom-built, hard to iterate, stats scattered  
**Docs:** None (predates documentation)

---

### Phase 1: PostHog + Supabase Integration (Oct 2025) — 11 hours
**Goal:** Replace custom analytics with enterprise tools  
**Result:** PostHog → Supabase → Streamlit pipeline working  
**Docs:** `3_ARCHIVE_posthog-integration-verification.md`

Key work:
- PostHog SDK integration + event tracking
- PostHog webhook → Supabase pipeline
- Streamlit dashboard for visualization
- End-to-end testing

---

### Phase 2: Hugo → Astro Migration (Nov 1-8, 2025) — 14.75 hours
**Goal:** Modern framework with React islands  
**Result:** 11 pages live, 49% JS reduction, 100% CSS reduction (Tailwind)  
**Docs:** `1_ARCHIVE_hugo-to-astro-migration-plan.md`, `2_ARCHIVE_hugo-to-astro-migration-summary.md`

Key work:
- Astro setup with theme base
- React Timeline component (7 company logos)
- Docker multi-stage build + Fly.io deployment
- Custom domain (eeshans.com) + SSL

---

### Phase 3: Backend Migration — FastAPI → PostgREST
**Goal:** Eliminate redundant Python backend  
**Result:** 8x faster queries, direct Supabase access  
**Docs:** `4_ARCHIVE_architecture-visual-guide.md`

Key work:
- Created SQL Views (`v_variant_overview`, `v_conversion_funnel`)
- Created RPCs (`leaderboard`)
- Removed FastAPI entirely
- Frontend calls PostgREST directly

---

### Phase 4: Frontend Modularization (Nov 2025)
**Goal:** Clean up monolithic JS  
**Result:** Modular ES6 structure in `public/js/ab-sim/`  
**Docs:** `5_ARCHIVE_ab-simulator-blueprint.md`

Module structure:
- `core.js` — Game state machine
- `supabase-api.js` — Data layer
- `dashboard.js` — Plotly charts
- `analytics.js` — PostHog tracking
- `leaderboard-ui.js` — DOM rendering

---

### Phase 5: A/B Simulator Polish (Nov 9+, 2025)
**Goal:** Gamification & UX improvements  
**Result:** Global leaderboard, memory game variants  
**Docs:** `5_ARCHIVE_ab-simulator-blueprint.md`

Key work:
- `unique-names-generator` for anonymous usernames
- Control (3 pineapples) vs Treatment (4 pineapples)
- Visual countdown, error feedback

---

### Phase 6: Build With Me Vision (Nov 2025)
**Goal:** Define the educational platform concept  
**Result:** Complete vision doc, manifesto, compliance strategy  
**Docs:** `7_ACTIVE_build-with-me-vision.md`, `6_ARCHIVE_build-with-me-page-plan.md`

Key concepts:
- "Learn DS by building real products"
- Monthly build cycles
- Multi-hat learning (PM, Eng, DS, Marketing)
- Non-commercial, H-1B compliant

---

### Phase 7: Monorepo — GitHub as Source of Truth (Nov 24, 2025)
**Goal:** Remove mock data, dynamic project discovery  
**Result:** Fetch script pulls from GitHub Issues  
**Docs:** `8_ACTIVE_monorepo-architecture.md` (Phase 1)

Key work:
- `fetch-data.mjs` pulls GitHub Issues/PRs
- Auto-discovers projects from labels
- Validation layer for data integrity
- Pre-build hook integration

---

### Phase 8: Monorepo — Package Isolation (Nov 24, 2025)
**Goal:** pnpm workspaces, isolated packages  
**Result:** 3 packages (root, shared, ab-simulator)  
**Docs:** `8_ACTIVE_monorepo-architecture.md` (Phase 2)

Structure:
```
packages/
├── ab-simulator/    # /ab-simulator
├── build-with-me/   # /projects
└── shared/          # Common layouts, utils
```

Key work:
- pnpm workspaces setup
- Shared assets via symlinks
- Centralized project metadata
- Docker/nginx updates

---

### Phase 9: Build With Me Platform Overhaul (Nov 24-25, 2025)
**Goal:** Professional dashboard with DataTables  
**Result:** 7 React components, search, filters, leaderboard  
**Docs:** `8_ACTIVE_monorepo-architecture.md` (Phases 3-4)

Components:
- `TasksView.tsx` — Orchestrator
- `TasksTable.tsx` — @tanstack/react-table
- `LeaderboardTable.tsx` — Avatars, medals, animations
- `SearchBar.tsx` — fuse.js fuzzy search
- `FilterPanel.tsx` — Multi-select dropdowns
- `DataFreshness.tsx` — Sync status indicator

Key work:
- Migrated to `packages/build-with-me/`
- Fixed Tailwind content array for shared package
- Mobile responsive (cards on mobile, table on desktop)

---

## Current State (Nov 25, 2025)

**Production URLs:**
- `eeshans.com/` → Portfolio homepage
- `eeshans.com/projects/` → Build With Me platform
- `eeshans.com/ab-simulator/` → A/B Simulator game

**Architecture:**
- Monorepo with pnpm workspaces
- 3 packages: root, shared, ab-simulator, build-with-me
- GitHub Issues as source of truth
- Fly.io deployment via GitHub Actions

**Next:** Enhancement backlog in `9_ACTIVE_build-with-me-enhancements.md`

---

## Working Principles

These principles guide all development decisions:

1. **Fix root causes, not symptoms** — Research deeply before claiming to understand
2. **Chunk-based delivery** — Complete small, verifiable pieces
3. **Brutalize scope** — Remove what doesn't earn its weight
4. **Enterprise mindset** — Defensible in a real company context
5. **Tools over custom code** — PostHog, Supabase, Tailwind over rolling custom
6. **Test before shipping** — Build locally, verify production-like behavior
7. **Commit small, clear changes** — Easy to review and rollback

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Astro 4.x + React islands |
| Styling | Tailwind CSS |
| Analytics | PostHog (events + feature flags) |
| Database | Supabase (PostgreSQL + PostgREST) |
| Hosting | Fly.io (Docker + nginx) |
| CI/CD | GitHub Actions |
| Package Manager | pnpm workspaces |
