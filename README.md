# CodeDNA

**AI-Powered Developer Growth Platform**

CodeDNA analyzes any public GitHub profile and turns it into a full engineering growth report: repository quality, language distribution, a composite Developer Score, rule-based skill detection, and AI-generated career insights — strengths, gaps, engineering level, a suggested role, interview readiness, and a personalized learning roadmap.

---

## Overview

Paste a GitHub username in and CodeDNA:

1. Pulls the user's profile and repositories from the GitHub REST API.
2. Runs them through an **Analysis Engine** — language distribution, total stars/forks, top repository, and a 0–100 **Developer Score**.
3. Runs a keyword/heuristic **Rule Engine** over repo names, descriptions, and topics to detect technologies and practices (React, Node, Docker, Testing, CI/CD, JWT, and more).
4. Sends that structured analysis to a pluggable **AI Service** that generates strengths, weaknesses, engineering level, a suggested role, a resume summary, interview readiness notes, and a staged learning roadmap.

The AI service ships with a deterministic mock provider today, and is architected so OpenAI, Gemini, or Claude can be dropped in without touching a single controller.

## Features

- 🔍 **GitHub profile analysis** — avatar, bio, location, followers, repo count
- 📊 **Repository analytics** — stars, forks, language distribution (pie chart), top repository
- 🧬 **Developer Score** — composite 0–100 score across repositories, stars, forks, modern-stack usage, and consistency
- 🧠 **AI Insights** — strengths, weaknesses, engineering level, suggested role, resume summary, interview readiness
- 🗺️ **Career Roadmap** — staged technologies, project ideas, certifications, and estimated score improvement
- ⚡ **Rule-based skill detection** — React, Node, Express, MongoDB, Docker, AWS, Python, Java, C++, TypeScript, GraphQL, Redis, JWT, Auth, Testing, CI/CD
- 🎨 **Modern SaaS UI** — dark theme, glassmorphism, gradient accents, Framer Motion transitions, fully responsive
- 🛡️ **Robust error handling** — 404 (user not found), rate limiting, timeouts, empty states, loading states

## Architecture

```
┌─────────────┐      GET /api/github/:username/analyze      ┌──────────────┐      ┌─────────────┐
│   Client    │ ───────────────────────────────────────────▶│   Server     │─────▶│  GitHub API  │
│ React + Vite│                                              │Express + TS  │      └─────────────┘
│             │◀─────────────────────────────────────────── │              │
└─────────────┘        AnalysisResult + AIInsights           │  ┌────────┐  │
                                                               │  │Analysis │  │
                                                               │  │ Engine  │  │
                                                               │  └───┬────┘  │
                                                               │      ▼       │
                                                               │  ┌────────┐  │
                                                               │  │  Rule   │  │
                                                               │  │ Engine  │  │
                                                               │  └───┬────┘  │
                                                               │      ▼       │
                                                               │  ┌────────┐  │
                                                               │  │   AI    │  │
                                                               │  │ Service │  │  (mock today, pluggable)
                                                               │  └────────┘  │
                                                               └──────────────┘
```

**Design principles applied:**
- Controllers never call `axios`, format AI logic, or catch/format errors directly — that all lives in dedicated services and middleware (single responsibility).
- The AI service is an interface (`AIProvider`) with a `MockAIProvider` implementation today; `OpenAIProvider` / `GeminiProvider` / `ClaudeProvider` are stubbed with the exact shape a real integration needs (open/closed).
- The client's `useGithubAnalysis` hook owns the fetch lifecycle so pages only render `idle | loading | success | error` states — no duplicated fetch logic across pages.
- Types are mirrored (not shared via a monorepo package, by design) between `server/src/types` and `client/src/types` so the contract is explicit and each app can be deployed independently.

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios, Recharts, Framer Motion, Lucide React

**Backend:** Node.js, Express, TypeScript, Axios, GitHub REST API

**Future-ready:** MongoDB (schema-ready), JWT authentication (architecture prepared), AI service abstraction (OpenAI / Gemini / Claude)

## Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
git clone <this-repo>
cd codedna

# install both apps
npm run install:all

# configure the server
cp server/.env.example server/.env
# optionally add a GITHUB_TOKEN to raise the GitHub API rate limit from 60/hr to 5000/hr
```

### Run in development

```bash
# terminal 1
npm run dev:server   # http://localhost:5000

# terminal 2
npm run dev:client   # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`, so the client works out of the box with no extra config.

### Build for production

```bash
npm run build:server   # compiles server/src -> server/dist
npm run build:client   # builds client/src -> client/dist (static, deployable anywhere)
```

## API Reference

| Method | Endpoint                          | Description                                              |
|--------|------------------------------------|------------------------------------------------------------|
| GET    | `/api/github/:username/profile`    | Raw GitHub profile data                                   |
| GET    | `/api/github/:username/repos`      | Raw GitHub repository list                                 |
| GET    | `/api/github/:username/analyze`    | Full analysis: stats, Developer Score, skills, AI insights |
| GET    | `/health`                          | Service health check                                       |

## Screenshots

> _Add screenshots here once the app is running locally:_
>
> - `docs/screenshots/landing.png` — Landing page hero
> - `docs/screenshots/dashboard.png` — Developer dashboard
> - `docs/screenshots/ai-insights.png` — AI Insights section
> - `docs/screenshots/roadmap.png` — Career roadmap timeline

## Folder Structure

```
codedna/
├── client/
│   ├── src/
│   │   ├── components/     # Navbar, Hero, StatCard, LanguagePieChart, AIInsightCard, ...
│   │   ├── pages/           # LandingPage, DashboardPage, NotFoundPage
│   │   ├── layouts/         # MainLayout (Navbar + Footer shell)
│   │   ├── services/        # api.ts — typed axios layer
│   │   ├── hooks/           # useGithubAnalysis — fetch lifecycle
│   │   ├── types/           # Shared TS interfaces (mirrors server/src/types)
│   │   ├── utils/           # format.ts — number/date/color helpers
│   │   └── assets/
│   └── ...vite/tailwind config
└── server/
    ├── src/
    │   ├── routes/          # github.routes.ts
    │   ├── controllers/     # github.controller.ts
    │   ├── services/        # github.service.ts, analysis.service.ts, ai.service.ts
    │   ├── middleware/      # errorHandler.ts
    │   ├── utils/            # ruleEngine.ts
    │   ├── prompts/          # aiPrompts.ts
    │   ├── config/           # env.ts
    │   └── types/
    └── ...tsconfig
```

## Future Roadmap

- 🔐 Wire up JWT authentication (architecture already prepared in `env.ts` / middleware layout) for saved profiles and comparison history
- 🗄️ Persist analyses to MongoDB for historical score tracking and profile comparisons over time
- 🤖 Implement `OpenAIProvider` / `GeminiProvider` / `ClaudeProvider` behind the existing `AIProvider` interface
- 📈 Org/team dashboards — aggregate Developer Scores across a GitHub organization
- 🧪 Add Jest/Vitest test suites for the Analysis Engine and Rule Engine (pure functions, high test value)
- 🌐 Public shareable report links

---

Built as a portfolio-grade, interview-ready reference implementation of a modern full-stack SaaS product.
