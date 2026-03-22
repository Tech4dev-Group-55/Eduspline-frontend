# CLAUDE.md — Eduspline Frontend

## What is this project?

Eduspline is an educational platform for learner risk prediction and engagement tracking. It has admin/educator dashboards for monitoring cohorts and student progress, and a student dashboard for learners.

## Tech Stack

- **Framework**: React 19.2 with Vite 7.3
- **Routing**: React Router DOM v7.13 (`BrowserRouter` + `Routes`)
- **Styling**: Vanilla CSS (scoped per component, no CSS-in-JS, modules, or preprocessors)
- **Icons**: Lucide React 0.577
- **State**: React Context API (AuthContext) + local component state (no Redux/Zustand)
- **HTTP**: Native `fetch()` with Bearer token auth (no axios)
- **Linting**: ESLint 9 flat config with React Hooks + React Refresh plugins
- **Language**: JavaScript (no TypeScript)

## Folder Structure

```
src/
├── assets/              # Static images and icons
├── components/          # Reusable UI components
│   ├── About/
│   ├── Button/
│   ├── Contactus/
│   ├── Footer/
│   ├── Hero/
│   ├── Navbar/
│   ├── OurSolutions/
│   ├── Pricing/
│   ├── Stat/
│   ├── Testimonial/
│   └── WhyChooseUs/
├── context/
│   └── AuthContext.jsx  # Auth state management
├── pages/
│   ├── AcceptInvite/    # Team invitation acceptance (set password)
│   ├── AdminDashboard/  # Admin views with nested components/
│   │   ├── AdminDashboard.jsx   # File upload page
│   │   ├── DashboardData.jsx    # Main dashboard (WIP)
│   │   ├── Insights.jsx         # Data insights (WIP)
│   │   ├── LoadingScreen.jsx    # Loading state
│   │   ├── Settings.jsx         # Institution settings + team roles
│   │   └── components/          # CohortTable, EngagementChart, FileUpload,
│   │                            # RiskDonutChart, RoleManagementTable, Sidebar,
│   │                            # StatsCard, StudentDataTable, StudentIndex,
│   │                            # StudyHoursChart, TopBar
│   ├── GoogleCallback/  # OAuth handler
│   ├── Home/            # Landing page
│   ├── Login/
│   ├── Onboarding/      # 3-step admin onboarding (institution → team → data)
│   ├── Signup/
│   ├── StudentDashboard/# Learner views
│   │   ├── StudentDashboard.jsx  # Main learner dashboard
│   │   ├── LearnerInsights.jsx   # Personalized insights/recommendations
│   │   └── components/           # AttendanceModal, StudentSidebar
│   ├── Verification/
│   └── VerifyEmail/
├── routes/
│   └── AppRoutes.jsx    # Central route definitions
├── App.jsx              # Root wrapper
└── main.jsx             # Entry point
```

## Routes

### Public Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page |
| `/signup` | Signup | Registration form |
| `/login` | Login | Email/password + Google OAuth |
| `/verify-email` | VerifyEmail | Email verification |
| `/verification` | Verification | Additional verification |
| `/auth/callback` | GoogleCallback | Google OAuth callback |
| `/auth/google/callback` | GoogleCallback | Google OAuth callback (alt) |
| `/accept-invite` | AcceptInvite | Team invitation password setup |

### Authenticated Routes (no route guards yet)
| Path | Component | Description |
|------|-----------|-------------|
| `/onboarding` | Onboarding | 3-step admin onboarding |
| `/admin-dashboard` | DashboardData | Admin main dashboard |
| `/admin-dashboard/upload` | AdminDashboard | File upload page |
| `/admin-dashboard/loading` | LoadingScreen | Loading screen |
| `/admin-dashboard/settings` | Settings | Institution settings |
| `/admin-dashboard/insights` | Insights | Data insights |
| `/student-dashboard` | StudentDashboard | Student main dashboard |
| `/student-dashboard/insights` | LearnerInsights | Student insights |
| `/learner/dashboard` | StudentDashboard | Alias for student dashboard |

## Landing Page Sections

Home page composes these components in order: Navbar → Hero → Stat → About → OurSolutions → WhyChooseUs → Pricing → Testimonials → ContactUs → Footer

## Key Conventions

- **Components**: Functional components with hooks, named exports, PascalCase filenames
- **CSS classes**: kebab-case (`.navbar-menu`, `.btn-primary`), BEM-like where applicable (`.form-group--error`, `.progress-step--active`)
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
POST /auth/signup                — User registration
POST /auth/login                 — User login
GET  /auth/google                — Google OAuth entry point
POST /auth/institution           — Register institution (onboarding step 1)
POST /team/invite                — Invite single team member
POST /team/invite/csv            — Bulk invite via CSV
POST /team/accept-invite         — Accept invitation (set password)
PUT  /auth/settings              — Update institution settings
GET  /auth/me                    — Get current user
GET  /predictions/student        — Get student predictions
GET  /predictions/dashboard      — Dashboard metrics
GET  /predictions/insights       — Insights data
POST /predictions/upload         — Upload student data CSV
```

## Roles

Four role values: **super_admin**, **admin**, **educator**, **student** (aka learner)

- `isAdmin` = `super_admin` or `admin`
- `isEducator` = `educator`
- `isLearner` = `student` or default authenticated user

**Login redirects:**
- Admin/SuperAdmin → `/onboarding` (if not completed) → `/admin-dashboard`
- Educator → `/educator/dashboard` (route not yet created)
- Student/Learner → `/learner/dashboard`

## AuthContext API

```javascript
// State: user, token, loading, error, isLoggedIn, isAdmin, isEducator, isLearner
// Methods: signup(), login(), logout(), loginWithGoogle(), handleGoogleCallback(), clearError()
```

## localStorage Keys

- `token` — JWT access token
- `user` — Stringified user object
- `onboardingComplete` — Boolean flag for onboarding status
- `studentData` — Demo student data (used in LearnerInsights)

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
- No TypeScript
- Educator dashboard route (`/educator/dashboard`) referenced in redirects but not yet created
- Some dashboard pages (DashboardData, Insights) are WIP/placeholder
- Signup has detailed password strength validation (length, uppercase, lowercase, number, special char)
- Onboarding is a 3-step flow: register institution → add team members → upload student data
