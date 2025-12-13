# Contribute Page Overhaul

**Goal:** Transform the contribute page from a static markdown dump into an appealing, dynamic contributor onboarding experience that showcases active contributors and provides clear paths for contribution.

---

## Principles

| # | Principle | Implication |
|---|-----------|-------------|
| 1 | **Dynamic over static** | Pull contributor data from GitHub API at build time |
| 2 | **Two clear paths** | Option 1: Fix/enhance existing. Option 2: Build new app |
| 3 | **Self-service onboarding** | Templates, schemas, and guides enable async contribution |
| 4 | **Social proof first** | Active contributors at top creates credibility |

---

## Page Structure

```
/contribute

┌─────────────────────────────────────────────────────────┐
│  HERO                                                   │
│  "Build With Me" + value prop                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ACTIVE CONTRIBUTORS (last 30 days)                    │
│  [Avatar] [Avatar] [Avatar] + "Be the first!"          │
│  Pulled from GitHub Issues/PRs API                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  CURRENT PROJECTS                                      │
│  Dynamic from packages/ + projects.yaml                │
│  "Each /package is an independent web app"             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  HOW TO CONTRIBUTE                                     │
│                                                         │
│  Path 1: Issues/PRs (quick wins)                       │
│  - Browse → Claim → Branch → PR                        │
│                                                         │
│  Path 2: New Web App (full ownership)                  │
│  - Proposal → Approval → Build → Analysis              │
│  - Expandable detailed guide                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  FULL STACK DS ADVICE                                  │
│  - Use AI comprehensively                              │
│  - Follow the workflow (link to post)                  │
│  - Test locally before PR                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  FOLLOW THE BUILD                                      │
│  Substack / Twitter / RSS                              │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: GitHub Integration ✅

**Issue:** [#96](https://github.com/eeshansrivastava89/ds-apps-main/issues/96) ✅

| ✓ | Task | Notes |
|---|------|-------|
| ✅ | Create `src/lib/github.ts` | Fetch recent contributors from GitHub API |
| ✅ | Create `Contributors.astro` | Avatar row with links, empty state |

---

## Phase 2: Page Redesign ✅

**Issue:** [#97](https://github.com/eeshansrivastava89/ds-apps-main/issues/97) ✅

| ✓ | Task | Notes |
|---|------|-------|
| ✅ | Hero section | Clean, minimal |
| ✅ | Contributors component | Social proof at top |
| ✅ | Projects section | Dynamic from projects.yaml |
| ✅ | Contribution paths | Two options (plain text, not collapsible) |
| ✅ | Advice section | Link to workflow post |
| ✅ | Follow section | Substack, Twitter, RSS |

---

## Phase 3: New Web App Onboarding ✅

**Issue:** [#98](https://github.com/eeshansrivastava89/ds-apps-main/issues/98) ✅

### Project Proposal Workflow

**Approach:** GitHub Discussions with "New Data Science Web App Proposals" category

1. Contributor opens Discussion with structured template
2. Owner reviews, provides feedback
3. If approved: Convert to Issue, create `/packages/{id}` folder

### Infrastructure Sharing

| Component | Approach |
|-----------|----------|
| **Database** | Contributors create own Supabase (free tier) with shared schema template |
| **Analytics** | Single PostHog project, events namespaced by `project` property |
| **Notebooks** | Add to projects.yaml → GitHub Actions auto-runs → Analysis page auto-creates |
| **Heavy ML** | Case-by-case discussion (Modal requires secrets/coordination) |

| ✓ | Task | Notes |
|---|------|-------|
| ✅ | Create Discussion template | `.github/DISCUSSION_TEMPLATE/new-data-science-web-app-proposals.yml` |
| ✅ | Create `internal/supabase-schema-template.sql` | Generic schema for contributors |
| ✅ | Document infrastructure in page | "You get:" line in Option 2 |

---

## Phase 4: Local Development Guide ✅

**Issue:** [#99](https://github.com/eeshansrivastava89/ds-apps-main/issues/99) ✅

| ✓ | Task | Notes |
|---|------|-------|
| ✅ | Update `.env.example` | Document all required vars |
| ✅ | Create PR template | `.github/PULL_REQUEST_TEMPLATE.md` |
| ✅ | Document local testing | In PR template checklist |

---

## Phase 5: Advice Section ✅

**Issue:** [#100](https://github.com/eeshansrivastava89/ds-apps-main/issues/100) ✅

Three key points:
1. Use AI comprehensively (explain codebase, review approach)
2. Follow the workflow (link to how-i-ai post)
3. Test before PR (local + Cloudflare preview)

| ✓ | Task | Notes |
|---|------|-------|
| ✅ | Write advice section | Included in Phase 2 page redesign |

---

## Files Created/Modified ✅

| File | Status |
|------|--------|
| `src/lib/github.ts` | ✅ Created |
| `src/components/Contributors.astro` | ✅ Created |
| `src/pages/contribute/index.astro` | ✅ Rewritten |
| `.github/DISCUSSION_TEMPLATE/new-data-science-web-app-proposals.yml` | ✅ Created |
| `.github/PULL_REQUEST_TEMPLATE.md` | ✅ Created |
| `internal/supabase-schema-template.sql` | ✅ Created |
| `.env.example` | ✅ Updated |
