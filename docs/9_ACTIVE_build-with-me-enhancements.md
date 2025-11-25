# Build With Me Enhancements

**Goal**: Transform the platform for extreme usability, engagement, and marketability as the main landing page.

---

## Prioritized Enhancement List

| Rank | Enhancement | Why It Matters | Effort | Status |
|------|-------------|----------------|--------|--------|
| **1** | **Activity Feed** — Recent claims/merges/opens with avatars | Creates momentum, social proof, shows the platform is alive. First thing visitors need to see. | Medium | ✅ Done |
| **2** | **Hero Rewrite** — Stats bar (X contributors, Y merged), sharper manifesto copy, "Watch How It Works" video CTA | First impression. Current hero is functional but doesn't sell the vision or create urgency. | Low | ✅ Done |
| **3** | **Task Enrichment** — "You'll Learn" tags, estimated hours, "Good First Issue" badge, difficulty stars | Makes tasks *interesting* not just *available*. Answers "why should I pick this?" | Medium | ✅ Done |
| **4** | **Recently Merged / Shoutouts Section** — Celebrate completions with contributor name, avatar, PR link, date | Public credit = motivation. Shows real people shipping real work. | Low | ✅ Done (merged into ContributorCards) |
| **5** | **Leaderboard Upgrades** — Weekly/all-time toggle, streak indicators (🔥), position change arrows (↑2) | Gamification drives return visits. Current leaderboard is static, no reason to check back. | Medium | ✅ Done (consolidated into ContributorCards) |
| **6** | **Filter Pills** — Quick filters for "Good First Issue", "1-2 hours", "Open only" | Reduces friction for newcomers. One-click filtering. | Low | ✅ Done |
| **7** | **Start Here Guide** — Collapsible onboarding for new contributors | Answers "how do I get started?" immediately. | Low | ✅ Done |
| **8** | **Video Modal** — Watch How It Works video thumbnail with overlay player | Visual learners, reduces "I don't know where to start" anxiety. | Medium | ✅ Done |
| **9** | **Quick Nav Bar** — Pill buttons linking to page sections (Open Work, Contributors, How to Ship, FAQ) | Improves navigation and scanability. | Low | ✅ Done |
| **10** | **Mobile Polish** — Responsive fixes across all components | Critical for social sharing where most traffic is mobile. | Medium | ✅ Done |
| **11** | **PostHog Event Tracking** — Track CTA clicks, task views, GitHub link clicks, scroll depth | Data to optimize the page over time. Do this *after* the page is worth optimizing. | Low | ⬜ Not started |
| **12** | **Achievement Badges** — First PR, 10 Points Club, Hat Collector, etc. | Fun gamification, but not critical until you have active contributors. | Medium | ⬜ Not started |

---

## Progress Log

### Major Redesign: Design Consolidation ✅
**Completed:** 2025-11-25

**Summary:** Consolidated 3 separate sections (Hats & PRs, Leaderboard, Shoutouts) into unified `ContributorCards` component. Removed competitive elements (points, medals). Simplified UX for main landing page promotion.

**Key changes:**
- **ContributorCards.tsx**: New unified contributor display with avatar, name, streak badge, "X PRs merged", progress bar (merged/total issues), latest ship section
- **index.astro**: Complete hero redesign with video thumbnail, quick nav pills, removed redundant cycle status box and DataFreshness
- **StartHereGuide.tsx**: Simplified to always-visible expand/collapse (no dismiss/persist state)
- **VideoModal.tsx**: New video modal with placeholder nature video, opens overlay on click
- **validate-build-with-me.ts**: Renamed `LeaderboardEntry` → `Contributor`, removed `points` field
- **fetch-data.mjs**: Renamed `buildLeaderboard` → `buildContributors`, sort by mergedPRs only
- **Deleted**: `LeaderboardTable.tsx`, `Shoutouts.tsx`, `DataFreshness.tsx` (unused)
- **React 19 upgrade**: Updated build-with-me to React 19.2.0, added `lucide-react.d.ts` type declarations to fix JSX component errors

**Design decisions:**
- No competition: Removed points/medals system per user request
- Progress bar = merged PRs / total issues (not points-based)
- Sort contributors by total merged PRs only
- Video prominent in hero (takes space where cycle box was)
- Quick nav pills for fast section jumping

---

### Enhancement #1: Activity Feed ✅
**Completed:** 2025-11-25

**Changes made:**
- `packages/build-with-me/scripts/fetch-data.mjs`: Added `avatarUrl` to assignees, `closedAt`, `updatedAt`, `closedBy` fields, new `buildRecentActivity()` function
- `packages/build-with-me/src/lib/validate-build-with-me.ts`: Added `ActivityItem` interface, `recentActivity` array to data schema
- `packages/build-with-me/src/components/ActivityFeed.tsx`: New component with pulsing indicator, avatars, relative timestamps, GitHub links
- `packages/build-with-me/src/pages/index.astro`: Integrated ActivityFeed below hero
- `packages/shared/src/layouts/SiteLayout.astro`: Fixed favicon paths to `/shared-assets/favicon/`

**Technical notes:**
- Used `useState`/`useEffect` for `TimeAgo` component to avoid hydration mismatch (server vs client time)
- Activity feed shows merged/claimed/PR-opened events sorted by recency
- Lucide icons show type errors due to React 18/19 mismatch in monorepo (runtime works fine)
