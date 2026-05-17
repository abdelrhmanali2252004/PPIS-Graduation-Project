# Codebase Index

Last indexed: 2026-05-17

**Naveta Company** (`naveta-company`) — Arabic RTL startup feasibility platform. Users walk through market research → project wizard → feasibility output → branding → executive dashboard.

## Project Stack

| Layer | Tech |
|-------|------|
| UI | React 19, TypeScript |
| Build | Vite 8 |
| Routing | `react-router-dom` v7 |
| State | Redux Toolkit + `react-redux` |
| HTTP | Axios (`src/api/client.ts`) |
| Styling | Tailwind CSS 3, `src/index.css`, Cairo font, RTL (`dir="rtl"`) |
| Icons | `lucide-react` |

**Scripts:** `npm run dev` · `npm run build` · `npm run lint` · `npm run preview`

**API base:** `VITE_API_BASE_URL` env var, default `http://localhost:8090/api`

## Entry Points

- `index.html` → `src/main.tsx`
- `src/main.tsx` — `Provider` (Redux) + `BrowserRouter` + `App`
- `src/App.tsx` — top-level route table

## User Flow (5 steps)

```
Landing → Login/Register → Step1 Market Research → Step2 Project Wizard
  → Step3 Feasibility → Step4 Branding → Step5 Executive Dashboard
```

`AppShell` (`src/layouts/AppShell.tsx`) wraps steps 1–4 with shared step nav, progress bar, and AI tip bubble.

## Route Index

### Public (`src/App.tsx`)

| Path | Page |
|------|------|
| `/` | `LandingPage` |
| `/login` | `LoginPage` |
| `/register` | `RegisterPage` |

### App wizard (authenticated flow)

| Path | Page | Purpose |
|------|------|---------|
| `/app/step1` | `MarketResearchHub` | Upload PDF or request market research |
| `/app/step2` | `ProjectWizard` | 12-question project intake |
| `/app/step3` | `FeasibilityOutput` | AI feasibility study display |
| `/app/step4` | `BrandingWizard` | Logo / brand identity |
| `/app/step5` | `Navigate` → `/dashboard/user/projects` | Step 5 alias |

### User dashboard (`ExecutiveDashboard` nested routes)

| Path | View |
|------|------|
| `/dashboard/user` | redirect → `projects` |
| `/dashboard/user/projects` | Project list |
| `/dashboard/user/profile` | Profile settings |
| `/dashboard/user/content` | Empty content hub |
| `/dashboard/user/content/:projectId` | Single-project content |

### Admin

| Path | Page |
|------|------|
| `/dashboard/admin` | `AdminDashboard` (tabs: users, requests, analyses — UI only, no API in components) |

## Redux Store (`src/store`)

| Slice | File | Role |
|-------|------|------|
| `auth` | `authSlice.ts` | Login, register, token/user in localStorage |
| `projectSteps` | `projectStepsSlice.ts` | Create step-1 project, upload market-research PDF, step status |
| `projectWizard` | `projectWizardSlice.ts` | Submit step-2 answers |
| `feasibility` | `feasibilitySlice.ts` | POST step-3, load feasibility study |
| `branding` | `brandingSlice.ts` | Generate logo (step 4), save logo, persist draft |
| `userProjects` | `userProjectsSlice.ts` | List user's projects |
| `projectDetails` | `projectDetailsSlice.ts` | Fetch single project for dashboard content |
| `serviceRequest` | `serviceRequestSlice.ts` | Create service requests (market research, logo, consultation) |

Typed hooks: `useAppDispatch`, `useAppSelector` in `src/store/hooks.ts`.

## API Endpoints (via `apiClient`)

| Method | Path | Used by |
|--------|------|---------|
| POST | `/user/login` | `authSlice` |
| POST | `/user/register` | `authSlice` |
| GET | `project/step1` | `projectStepsSlice` — create/get project ID |
| POST | `project/market-research` | `projectStepsSlice` — multipart PDF upload |
| POST | `/project/step2` | `projectWizardSlice` |
| POST | `/project/step3` | `feasibilitySlice` |
| POST | `project/step4` | `brandingSlice` — generate logo |
| POST | `project/save-logo` | `brandingSlice` |
| GET | `project/get-my-projects` | `userProjectsSlice` |
| GET | `project/get-project/:id` | `projectDetailsSlice` |
| POST | `request/create-request` | `serviceRequestSlice` |

Auth: Bearer token from `ideaTechAccessToken` on every request; 401 clears token + user.

## Local Storage Keys

| Key | Constant / source |
|-----|-------------------|
| `ideaTechAccessToken` | `TOKEN_STORAGE_KEY` (`api/client.ts`) |
| `ideaTechUserData` | `USER_STORAGE_KEY` |
| `ideaTechProjectId` | `PROJECT_ID_STORAGE_KEY` (`projectStepsSlice`) |
| `ideaTechBrandingData` | `BRANDING_STORAGE_KEY` (`brandingSlice`) |
| `nextventure.aiBubbleDismissed` | `AIFloatingBubble` |
| `ideaTechSession` | `HeroSection` (legacy check) |

## Source Tree

### Pages (`src/pages`)

- `LandingPage.tsx` — marketing sections
- `LoginPage.tsx` / `RegisterPage.tsx`
- `MarketResearchHub.tsx` — step 1 shell
- `ProjectWizard.tsx` — step 2 shell
- `FeasibilityOutput.tsx` — step 3 shell
- `BrandingWizard.tsx` — step 4 shell
- `ExecutiveDashboard.tsx` — step 5 / user dashboard + nested routes
- `AdminDashboard.tsx`

### Layouts (`src/layouts`)

- `AppShell.tsx` — wizard chrome (steps 1–4)
- `AIFloatingBubble.tsx`
- `BottomStatusBar.tsx` (commented out in AppShell)

### Components (`src/components`)

**landing/** — `HeroSection`, `AboutSection`, `ServicesSection`, `ReadyToStartSection`, `LandingHeader`, `ContactFooter`

**market-research/** — `MarketResearchContent`, `UploadFileComponent`, `RequestMarketComponent`

**project-wizard/** — `ProjectWizardContent`; **questions/** — `index.ts` (question config), `types.ts`, `Question01Idea` … `Question12Risks`

**feasibility/** — `FeasibilityContent`, `FeasibilityLoading`

**branding/** — `BrandingWizardContent`, `LogoGeneratorStep`

**dashboard/** — `ExecutiveDashboardContent` (+ `AlertsPanel`)

**admin/** — `AdminSidebar`, `AdminTopBar`, `AdminHeader`, `AdminUsersSection`, `AdminRequestsSection`, `AdminAnalysesSection`

### API & types

- `src/api/client.ts` — Axios instance + interceptors
- `src/api/branding.ts` — logo URL helpers, audience mapping, download helper (re-exports `brandingStep4` types)
- `src/types/brandingStep4.ts` — logo style, palette, audience enums

### Utils

- `src/utils/readStoredProjectId.ts`

### Assets

- `src/assets/logo.png`
- `public/icons.svg`, `public/about-mission.svg`

## Project Wizard Questions

Configured in `src/components/project-wizard/questions/index.ts` as `QUESTION_ITEMS` (Arabic labels). Keys include: `idea_name`, `idea`, `sector`, `legalStatus`, `audience`, `geoScope`, budget, timeline, experience, team size, differentiation, pricing, sales target, risks. See also `PROJECT_WIZARD_QUESTIONS.txt`.

## Config & Tooling

- `package.json`, `package-lock.json`
- `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`
- `postman/` — API workspace globals
- `LOGO_GENERATION.md` — branding/logo notes

## How To Refresh This Index

1. Update routes from `src/App.tsx` and nested routes in `ExecutiveDashboard.tsx`.
2. Grep `apiClient.` in `src/store` for API changes.
3. Sync file lists under `src/pages`, `src/components`, `src/store/slices`.
4. Bump **Last indexed** date.
