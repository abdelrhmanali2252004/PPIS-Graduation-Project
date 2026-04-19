# Codebase Index

Last indexed: 2026-04-19

## Project Stack

- React + TypeScript + Vite
- Routing with `react-router-dom`
- Styling with Tailwind CSS and custom CSS

## Entry Points

- `src/main.tsx`: React app bootstrap, wraps app with `BrowserRouter`.
- `src/App.tsx`: Central route table.

## Route Index (`src/App.tsx`)

- `/` -> `src/pages/LandingPage.tsx`
- `/login` -> `src/pages/LoginPage.tsx`
- `/register` -> `src/pages/RegisterPage.tsx`
- `/app/step1` -> `src/pages/MarketResearchHub.tsx`
- `/app/step2` -> `src/pages/ProjectWizard.tsx`
- `/app/step3` -> `src/pages/FeasibilityOutput.tsx`
- `/app/step4` -> `src/pages/BrandingWizard.tsx`
- `/app/step5` -> `src/pages/ExecutiveDashboard.tsx`
- `/dashboard/user` -> `src/pages/ExecutiveDashboard.tsx`
- `/dashboard/admin` -> `src/pages/AdminDashboard.tsx`

## Source Modules

### Pages (`src/pages`)

- `AdminDashboard.tsx`
- `BrandingWizard.tsx`
- `ExecutiveDashboard.tsx`
- `FeasibilityOutput.tsx`
- `LandingPage.tsx`
- `LoginPage.tsx`
- `MarketResearchHub.tsx`
- `ProjectWizard.tsx`
- `RegisterPage.tsx`

### Layouts (`src/layouts`)

- `AIFloatingBubble.tsx`
- `AppShell.tsx`
- `BottomStatusBar.tsx`

### Components (`src/components`)

- `admin/`
  - `AdminAnalysesSection.tsx`
  - `AdminHeader.tsx`
  - `AdminRequestsSection.tsx`
  - `AdminSidebar.tsx`
  - `AdminTopBar.tsx`
  - `AdminUsersSection.tsx`
- `branding/`
  - `BrandingWizardContent.tsx`
- `dashboard/`
  - `ExecutiveDashboardContent.tsx`
- `feasibility/`
  - `FeasibilityContent.tsx`
  - `FeasibilityLoading.tsx`
- `landing/`
  - `AboutSection.tsx`
  - `ContactFooter.tsx`
  - `HeroSection.tsx`
  - `LandingHeader.tsx`
  - `ReadyToStartSection.tsx`
  - `ServicesSection.tsx`
- `market-research/`
  - `MarketResearchContent.tsx`
- `project-wizard/`
  - `ProjectWizardContent.tsx`
  - `questions/`
    - `index.ts`
    - `types.ts`
    - `Question01Idea.tsx`
    - `Question02Sector.tsx`
    - `Question03Audience.tsx`
    - `Question04Location.tsx`
    - `Question05Budget.tsx`
    - `Question06Timeline.tsx`
    - `Question07Experience.tsx`
    - `Question08TeamSize.tsx`
    - `Question09Differentiation.tsx`
    - `Question10PricingModel.tsx`
    - `Question11SalesTarget.tsx`
    - `Question12Risks.tsx`

## Styling

- `src/index.css`: global styles and utilities.
- `src/App.css`: app-level styles.
- `tailwind.config.js`: Tailwind theme and content config.
- `postcss.config.js`: PostCSS pipeline config.

## Config + Tooling

- `package.json`: scripts and dependencies.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript settings.
- `vite.config.ts`: Vite config.
- `eslint.config.js`: lint rules.

## How To Refresh This Index

When new files/routes are added:

1. Update the route mapping from `src/App.tsx`.
2. Add or remove files in the module lists above.
3. Update the `Last indexed` date.
