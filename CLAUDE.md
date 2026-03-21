# CLAUDE.md — Eduspline Frontend

## What is this project?

Eduspline is an educational platform for learner risk prediction and engagement tracking. It has admin/educator dashboards for monitoring cohorts and student progress, and a student dashboard for learners.

## Tech Stack

- **Framework**: React 19 with Vite 7
- **Routing**: React Router DOM v7 (`BrowserRouter` + `Routes`)
- **Styling**: Vanilla CSS (scoped per component, no CSS-in-JS or preprocessors)
- **Icons**: Lucide React
- **State**: React Context API (AuthContext) + local component state (no Redux/Zustand)
- **HTTP**: Native `fetch()` with Bearer token auth (no axios)
- **Linting**: ESLint 9 flat config with React Hooks + React Refresh plugins

## Folder Structure

```
src/
├── assets/              # Static images and icons
├── components/          # Reusable UI components (Button, Navbar, Footer, Hero, etc.)
├── context/             # AuthContext for auth state management
├── pages/               # Page-level components
│   ├── Home/            # Landing page
│   ├── Login/ Signup/   # Auth pages
│   ├── AdminDashboard/  # Admin views with nested components/
│   ├── StudentDashboard/# Learner views with nested components/
│   ├── Onboarding/      # Role selection after signup
│   └── GoogleCallback/  # OAuth handler
├── routes/
│   └── AppRoutes.jsx    # Central route definitions
├── App.jsx              # Root wrapper
└── main.jsx             # Entry point
```

## Key Conventions

- **Components**: Functional components with hooks, named exports, PascalCase filenames
- **CSS classes**: kebab-case (`.navbar-menu`, `.btn-primary`), BEM-like where applicable
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE (e.g., `BASE_URL`)
- **Each component** gets its own folder with `.jsx` + `.css` files

## API Integration

- Backend base URL: `https://eduspline-backend-0y8n.onrender.com/api`
- Env var `VITE_BACKEND_URL` exists in `.env` but components currently hardcode the URL
- Auth token stored in `localStorage` (keys: `token`, `user`)
- All API calls use `fetch()` with `Authorization: Bearer ${token}` header

## Key API Endpoints

```
POST /auth/signup, /auth/login     — Authentication
GET  /auth/google                  — Google OAuth
GET  /predictions/dashboard        — Dashboard metrics
GET  /predictions/insights         — Student insights
POST /api/upload/student-data      — CSV upload
```

## Roles

Three user roles: **Admin**, **Educator**, **Learner** — determined at login, with role-based redirects.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Notes

- No route guards implemented yet — all routes are technically public
- No test framework is set up
- Google OAuth callback handled at `/auth/callback` and `/auth/google/callback`
