# acme-api

Internal API service for Acme Corp with a React admin dashboard frontend.

## Overview

This repository is a small full-stack demo app made up of:

- an **Express API** in `src/`
- a **React + Vite admin dashboard** in `frontend/`
- an in-memory fake database in `src/db.js`
- route tests built with Node's built-in test runner

It is intended to look like a realistic internal tool while remaining lightweight and easy to run locally.

## Repository structure

```text
.
├── frontend/          # React admin dashboard
├── src/               # Express API, middleware, routes, fake db
├── PRD.md             # Demo/product requirements and intentional constraints
├── README.md          # Project and developer documentation
└── .env.example       # Local environment variable template
```

## Requirements

- Node.js 20+
- npm

## Setup

```bash
cp .env.example .env
npm install
```

## Environment variables

The app reads configuration from `src/config.js`.

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Port used by the Express server |
| `SENTRY_DSN` | No | - | Optional Sentry DSN for error reporting |
| `NODE_ENV` | No | `development` | Runtime environment |

## Development

### API only

```bash
npm run dev
```

Starts the Express API on `http://localhost:3000`.

### Frontend only

```bash
npm run dev:frontend
```

Starts the Vite dev server on `http://localhost:5173` and proxies API requests to port `3000`.

### Full stack

```bash
npm run dev:all
```

Runs both the API watcher and the Vite frontend dev server.

## Production build

```bash
npm run build:frontend
npm start
```

This builds the React frontend into `public/` and serves it from the Express server at `http://localhost:3000`.

## Frontend

The frontend is a React SPA located in `frontend/`. After login, it provides:

- **Login page** — authenticate with any existing user email from the fake database, such as `alice@acme.com`
- **Dashboard** — overview stats for users, teams, and API health
- **Users page** — list, create, edit, and deactivate users with status filtering
- **Teams page** — browse teams, create teams, and add or remove members

### Frontend stack

- React 19
- React Router
- Vite
- plain CSS

## API summary

### Health

- `GET /health` — health check endpoint returning `{ "status": "ok" }`

### Users

- `GET /api/users` — list all users
- `GET /api/users/:id` — get a user by ID
- `GET /api/users/:id/profile` — get a compact user profile
- `POST /api/users` — create a user
- `PATCH /api/users/:id` — update a user
- `DELETE /api/users/:id` — deactivate a user

### Teams

- `GET /api/teams` — list all teams
- `GET /api/teams/:id` — get a team by ID
- `GET /api/teams/:id/members` — list team members
- `POST /api/teams` — create a team
- `POST /api/teams/:id/members` — add a member to a team
- `DELETE /api/teams/:id/members/:userId` — remove a member from a team

### Auth

- `POST /api/auth/login` — fake login by email
- `POST /api/auth/logout` — fake logout

## Fake data model

Data is stored in memory inside `src/db.js`, so changes reset when the process restarts.

### Users

Users include fields such as:

- `id`
- `email`
- `name`
- `role`
- `status` (`active`, `inactive`, `pending`)
- `createdAt`
- `updatedAt`

### Teams

Teams include fields such as:

- `id`
- `name`
- `members` (array of user IDs)
- `createdAt`
- `updatedAt`

## Testing

```bash
npm test
```

This runs the route tests under `src/routes/*.test.js` using Node's built-in test runner.

## Important demo note

`PRD.md` is the source of truth for demo constraints. In particular, it describes an **intentional demo bug** that contributors should not “fix” accidentally when working in this repository.

## Troubleshooting

- If `npm run dev:frontend` cannot reach the API, make sure the backend is running on port `3000`.
- If the frontend build is missing, the Express app will still serve API routes, but SPA fallback behavior only works after building `public/index.html`.
- Since the database is in memory, restarting the server resets all created users and teams.
- `npm run dev:all` uses `npm run dev & npm run dev:frontend`, which works best in Unix-like shells; on Windows, run the backend and frontend commands in separate terminals if needed.
