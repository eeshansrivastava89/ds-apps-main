# Monorepo Rearchitecture Plan

> **Goal**: Isolate projects into workspaces. GitHub = single source of truth. No mock data.

## Working Principles
- Fix root causes (physical isolation) not symptoms (folders)
- Brutalize scope (each project ships only its deps)
- Enterprise mindset (pnpm workspaces)
- Tools over custom code (Astro monorepo support)

## Current Problems
- **Tight Coupling**: AB Sim embedded in portfolio, shared configs mixed, can't isolate deps
- **Mock Data**: Fallback JSON, hardcoded "upcoming" projects, silent exit on missing token
- **No Boundaries**: Contributors need full repo access, no per-project trackers, deploy coupling

## Target Architecture

```
soma-portfolio/
├── packages/
│   ├── ab-simulator/          # Standalone Astro app
│   │   ├── package.json
│   │   ├── src/pages/index.astro
│   │   ├── public/js/*.js
│   │   └── README.md
│   ├── basketball-analyzer/   # Future project
│   └── shared/                # Shared utilities
│       ├── posthog.ts
│       ├── supabase.ts
│       └── analytics.ts
├── src/                       # Main portfolio site
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   └── projects/
│   │       └── index.astro    # Build With Me hub
│   └── components/
├── scripts/
│   └── fetch-build-with-me-data.mjs
├── pnpm-workspace.yaml
└── package.json
```

**URL Structure**:
- `eeshans.com/` → Portfolio homepage
- `eeshans.com/projects/` → Build With Me hub
- `eeshans.com/ab-simulator/` → AB Sim app (from packages/ab-simulator)
- `eeshans.com/basketball/` → Basketball app (from packages/basketball-analyzer)

**GitHub Labels**:
- `project:ab-simulator`
- `project:basketball`
- `project:portfolio`

**Fetch script**: Filters issues by label, discovers projects dynamically

---

## Phase 1: Remove Mock Data ✅ **COMPLETE**

**Goal**: GitHub = source of truth, fail loudly on missing data

### - [x] 1.1: Fetch script fails without GITHUB_TOKEN
- `scripts/fetch-build-with-me-data.mjs` L21-24: Change `console.warn` + `exit(0)` → `console.error` + `exit(1)`

### - [x] 1.2: Remove hardcoded "upcoming" projects
- `scripts/fetch-build-with-me-data.mjs` L200-203: Delete `upcoming` array from payload
- `src/pages/projects/index.astro` L56-61: Remove `Upcoming` interface
- `src/pages/projects/index.astro` L66: Remove `upcoming` from destructuring
- `src/pages/projects/index.astro` L350-374: Delete Upcoming sidebar section

### - [x] 1.3: Add validation layer
- **New**: `src/lib/validate-build-with-me.ts` - Function checks arrays (cycles/tasks/hats/leaderboard), validates task fields (id/title/githubUrl/category), returns null on error
- `src/pages/projects/index.astro` L64: Import validator, call before destructuring, throw if null

### - [x] 1.4: Add pre-build hook
- `package.json`: Add `"prebuild": "node scripts/fetch-build-with-me-data.mjs"`

### - [x] 1.5: Update .env.example
- Add section for `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`

### - [x] 1.6: Discover projects dynamically
- `scripts/fetch-build-with-me-data.mjs` L189: After building tasks, iterate to extract unique `projectSlug` values
- Build cycles by mapping slugs → filter tasks by slug → count open/claimed/merged
- Use `PROJECT_METADATA[slug]?.name ?? slug` for display names (prep for Phase 2)
- Remove any hardcoded project references (Basketball, Metal Lyrics)

### - [x] 1.7: Test Phase 1
```bash
npm run fetch:build-with-me  # Should output: Projects: ab-sim, Tasks: 1
cat src/data/build-with-me-data.json  # Verify no fake data
npm run build  # Should fail if data invalid
```

**Success Criteria**:
- ✅ Fetch fails without token
- ✅ No "upcoming" in JSON
- ✅ Build errors on bad data
- ✅ Only real GH issues shown
- ✅ Projects auto-discovered

---

## Phase 2: Monorepo Structure ✅ **COMPLETE**

**Trigger**: When 2+ distinct `project:*` labels exist on GitHub
**Goal**: Physical workspace separation

### - [x] 2.1: Install pnpm workspaces
```bash
npm i -g pnpm
echo 'packages:\n  - "packages/*"' > pnpm-workspace.yaml
rm -rf node_modules package-lock.json && pnpm install
```

### - [x] 2.2: Create shared package
- Created `packages/shared/` with placeholder utils for posthog, supabase, analytics

### - [x] 2.3: Create AB Simulator package
- Moved AB sim files to `packages/ab-simulator/src/pages/index.astro`
- Copied public assets (`public/js/ab-sim`, `puzzle-config.js`, `utils.js`)
- Created standalone BaseLayout.astro for AB sim
- Configured `base: '/ab-simulator'`, `outDir: '../../dist/ab-simulator'`
- Added `@soma/shared: workspace:*` dependency

### - [x] 2.4: Update root package.json
- Added `dev:ab-sim`, `build:packages`, updated `build` script

### - [x] 2.5: Update Dockerfile
- Installed pnpm globally, copied workspace files, used `pnpm install --frozen-lockfile`

### - [x] 2.6: Update nginx.conf
- Added `/ab-simulator/` location block with proper fallback

### - [x] 2.7: Centralize project metadata
- Added `PROJECT_METADATA` to both `.ts` and `.js` config files
- Exported `getProjectName()` and `getProjectPath()` helpers

### - [x] 2.8: Update fetch script
- Using `getProjectName(slug)` for dynamic project names

### - [x] 2.9: Test monorepo
- ✅ Build passes: `pnpm run build` successful
- ✅ `dist/ab-simulator/index.html` exists with all assets
- ✅ Root Astro config set to `emptyOutDir: false` to preserve package builds

### - [x] 2.10: Fix script loading and static assets
- ✅ Replaced dynamic script loading with static `<script src="">` tags (removed complexity)
- ✅ Removed `mode: 'cors'` from fetch calls (was breaking, not needed)
- ✅ Added `./public/**/*.js` to Tailwind content array (fixes purged classes)
- ✅ Centralized shared assets: `public/shared-assets/{fonts,favicon}`
- ✅ Created symlinks in package: `public/fonts` → `../../../public/shared-assets/fonts`
- ✅ Build completes with no errors, all assets copied correctly

**Success Criteria**:
- ✅ pnpm workspace functional with 3 packages (root, shared, ab-simulator)
- ✅ `dist/ab-simulator/index.html` exists with all JS, fonts, favicons
- ✅ Each package has isolated deps
- ✅ Metadata centralized with fallback for unknown projects
- ✅ JavaScript loads correctly (no dynamic loading complexity)
- ✅ Fonts/favicons shared via symlinks (zero duplication in git)
- ✅ Tailwind classes not purged from dynamically-generated HTML

---

## Phase 3: Component Extraction 📦 **OPTIONAL** (2-3hr)

**Trigger**: When 541-line file becomes painful
**Goal**: Break page into composable components

### - [ ] 3.1: Create component structure
```bash
mkdir -p src/components/build-with-me
```
- Create: `types.ts`, `Hero.astro`, `CycleCard.astro`, `TaskCard.astro`, `FilterBar.astro`, `HatsBadge.astro`, `Leaderboard.astro`, `HowToShip.astro`

### - [ ] 3.2: Extract TypeScript interfaces
- `src/components/build-with-me/types.ts`: Move Task/Cycle/Hat/LeaderboardEntry interfaces

### - [ ] 3.3: Extract components
- Each component: Import types/styles, define Props, render section
- `TaskCard.astro`: Lines 203-276 from main page → component with `task` prop

### - [ ] 3.4: Update main page
- `src/pages/projects/index.astro`: Import components, replace sections with `<TaskCard task={task} />`, etc.
- Target: Reduce from 541 lines → ~150 lines

**Success Criteria**:
- ✅ Main page < 200 lines
- ✅ Components reusable
- ✅ No visual regressions (filters/animations work)

---

## Success Metrics

- **Phase 1**: GitHub-only data, fail-fast validation, dynamic discovery
- **Phase 2**: Isolated packages, monorepo builds, shared utils, subpath routing
- **Phase 3**: Modular components, reduced duplication, maintainability

## Rollback

- **Phase 1 breaks**: `git revert HEAD && npm run build && fly deploy`
- **Phase 2 too complex**: Keep Phase 1, stay subdirectory, revisit at 3rd project

## Future (Post-Monorepo)

- Per-project CI/CD (rebuild only changed packages)
- Separate Fly apps (`ab-sim.eeshans.com`)
- Independent deployments (AB Sim without portfolio rebuild)
- Contributor PRs scoped to single package

## What's Next?

**✅ Phases 1 & 2 Complete - Deployment Checklist**

### Pre-Deploy Verification
```bash
# 1. Clean build
rm -rf dist/ && pnpm run build

# 2. Test both routes locally
pnpm preview
# Open: http://localhost:4321/ (portfolio)
# Open: http://localhost:4321/ab-simulator/ (ab-sim)

# 3. Verify assets load (no 404s in console)

# 4. Test AB simulator functionality
# - Variant assigned correctly
# - Game starts and runs
# - Leaderboard loads
# - Dashboard shows data
```

### Deploy to Production
```bash
fly deploy
```

**Access URLs after deployment:**
- `eeshans.com/` → Portfolio homepage
- `eeshans.com/projects/` → Build With Me hub
- `eeshans.com/ab-simulator/` → AB Simulator (from packages/ab-simulator)

**⏸️ Phase 3 - Skip for Now**
- Component extraction adds no value (no pain point, no merge conflicts)
- Following working principles: Don't add work that doesn't earn its weight
- Revisit only if 466-line file becomes actual maintenance burden

---

## Lessons Learned

### What Worked ✅
1. **Fix root causes, not symptoms** - Tailwind purging (1 line) fixed animations, not CSS hacks
2. **Simplify, don't add** - Static script tags beat dynamic loading every time
3. **Question complexity** - `mode: 'cors'` broke things, removing it fixed everything
4. **Shared assets via symlinks** - Zero duplication, one source of truth

### What Didn't Work ❌
1. **Dynamic script loading** - Added timing issues, removed for static tags
2. **Explicit CORS mode** - Broke fetch, default behavior works fine
3. **Asset duplication** - 512KB wasted per package before symlinks
4. **PostHog callback band-aids** - Fixed script loading instead, problem disappeared

### Architecture Wins 🎯
- **50% asset reduction** - 640KB → 320KB via symlinks
- **Zero tech debt** - No workarounds, hacks, or timing dependencies
- **Simple paths** - Always `/fonts/` and `/favicon/`, no BASE_URL logic
- **Future-proof** - Next package: add symlinks, works immediately

## Notes

- **Phase 1 mandatory** (fix root causes) ✅ **DONE**
- **Phase 2 monorepo** (physical isolation) ✅ **DONE**
- **Phase 3 optional** (skipped - no pain point)
- **All phases preserve URLs** (no user-facing breaks)
- **Ready for production deployment**

### Static Asset Strategy ✅ **IMPLEMENTED**

**Problem:** Fonts/favicons needed by all packages → Duplication (512KB per package)

**Solution:**
```
public/shared-assets/
├── fonts/           # Satoshi Variable (256KB)
└── favicon/         # All favicon files (64KB)

packages/*/public/
├── fonts -> ../../../public/shared-assets/fonts      # Symlink
├── favicon -> ../../../public/shared-assets/favicon  # Symlink
└── js/              # Package-specific JS
```

**How it works:**
1. One copy of assets in `public/shared-assets/`
2. Each package has symlinks in `public/fonts/` and `public/favicon/`
3. Build process dereferences symlinks → copies real files to `dist/`
4. CSS always references `/fonts/` and `/favicon/` (works for all packages)
5. Git commits symlinks (tiny), not duplicated assets

**Benefits:**
- ✅ Zero duplication in source (320KB total, not 640KB)
- ✅ Update fonts once, affects all packages
- ✅ Works in dev, prod, and cloned repos (macOS/Linux)
- ✅ Simple paths, no BASE_URL logic needed

### Environment Variables Strategy

**Problem:** Monorepo packages built independently don't inherit parent's `.env` file

**Solution (Implemented):**
- Created symlink: `packages/ab-simulator/.env` → `../../.env`
- Astro automatically loads `.env` from package root during build
- All `PUBLIC_*` vars now accessible via `import.meta.env`
- Works locally and in CI/CD (symlinks preserved in git)

**Files:**
- Root `.env` contains all `PUBLIC_*` environment variables
- Each package has symlinked `.env` pointing to root
- Dockerfile receives build args and bakes them into static HTML

**Important:** `.env` symlinks should be committed to git for CI/CD to work
