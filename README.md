# KeyPillar Hub

Business Operations Hub for an AI company. Combines SOP tracking, project management, employee onboarding, daily updates, blocker tracking, and decision/issue/change logging.

## Features

- **Dashboard** — Command center for founders and project managers
- **Projects** — Project-based SOP workspaces
- **Project SOP** — 15 sections per project (overview, features, roadmap, issues, decisions, changelog, etc.)
- **Employees & Daily Work** — Per-project employee work board with daily updates
- **Tasks** — Task tracking with priority, status, blockers
- **Blockers** — Escalation log with priority levels
- **Feature Register** — Track all project features
- **Roadmap** — Missing features and future plans
- **Issue Log** — Bug tracking with root cause, fix, prevention
- **Decision Log** — Record why decisions were made
- **Change Log** — Track what changed, when, why, by whom
- **Onboarding** — Day 1/3/7/30 checklists for new employees
- **Handover** — Knowledge transfer when someone leaves
- **SOP Health** — Score out of 100 for documentation quality
- **Reports** — Summary reports for managers
- **Settings** — Customizable app name, company name, theme, notifications

## User Roles

| Role | Permissions |
|------|------------|
| Admin | Full access - users, projects, SOPs, tasks, logs, settings |
| Founder | Read-only all dashboards, progress, blockers |
| Project Manager | Create projects, assign tasks, review updates, approve work |
| Project Owner | Manage assigned project - features, roadmap, issues |
| Documentation Owner | Review SOP quality, maintain health score |
| Team Member | Daily updates, tasks, blockers, SOP sections |
| New Employee | View SOP, complete onboarding, submit questions |

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
cd keypillar-hub
npm install
cp .env.example .env
```

### Database Setup
```bash
npm run db:push    # Initialize database schema
npm run seed       # Create demo data
```

### Development
```bash
npm run dev
```
Open http://localhost:3000

### Build & Start
```bash
npm run build
npm start
```

## Demo Accounts

All demo accounts use password: `password123`

| Email | Role |
|-------|------|
| admin@keypillarhub.com | Admin |
| founder@keypillarhub.com | Founder |
| manager@keypillarhub.com | Project Manager |
| owner@keypillarhub.com | Project Owner |
| docowner@keypillarhub.com | Documentation Owner |
| employee@keypillarhub.com | Team Member |
| newhire@keypillarhub.com | New Employee |

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS 3** + custom UI components
- **Prisma ORM** — SQLite (local) / PostgreSQL (production)
- **NextAuth** — Authentication
- **bcryptjs** — Password hashing
- **Zod** — Validation
- **React Hook Form** — Forms

## Project Structure

```
keypillar-hub/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Demo data
├── src/
│   ├── app/
│   │   ├── auth/login/      # Login page
│   │   ├── dashboard/       # All dashboard pages
│   │   ├── api/auth/[...nextauth]/  # Auth API
│   │   ├── globals.css      # Tailwind styles
│   │   └── layout.tsx       # Root layout
│   ├── lib/
│   │   ├── auth.ts          # NextAuth config
│   │   ├── prisma.ts        # Prisma client
│   │   ├── rbac.ts          # Role-based access
│   │   └── components/ui/   # Reusable components
│   └── middleware.ts        # Route protection
├── .env                     # Environment variables
├── .env.example             # Environment template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Security Notes

- Passwords are hashed with bcryptjs
- All secrets via environment variables (.env)
- Route protection via Next.js middleware
- Role-based access control on pages
- Admin routes protected
- No stack traces shown to users
- Input validation via Zod schemas
- Audit logging for important actions

## Validation Rules

1. Active member → daily update every working day
2. Blocked update → blockers + help needed required
3. Blocked task → responsible person required
4. Task Completed → related SOP/Change Log updated when applicable
5. PM reviews blocked items daily
6. No-update employees → dashboard alert
7. Issue close → root cause + fix + prevention required
8. Decision save → reason + alternatives required
9. Onboarding complete → manager review required
10. Handover approve → pending + risks + replacement owner required
11. All important actions → audit log
12. Admin pages → protected by RBAC

## License

Internal use only.
