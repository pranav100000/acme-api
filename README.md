# acme-api

Internal API service for Acme Corp with a React admin dashboard frontend.

## Overview

This repository contains a small full-stack demo application made of:

- an **Express API** in `src/`
- a **React + Vite admin dashboard** in `frontend/`
- an **in-memory data layer** in `src/db.js` for users and teams

The app is designed to feel like an internal admin tool. It includes fake auth, user management, team management, request logging, validation middleware, and route-level tests.

### Tech stack

- Node.js + Express for the backend
- React 19 + React Router for the admin UI
- Vite for frontend development and production builds
- Node's built-in test runner for backend route tests


## What the app does

### Backend

The API exposes endpoints for:

- service health checks
- fake email-based login/logout
- listing, creating, updating, and deactivating users
- listing teams, creating teams, and managing team membership

### Frontend

The dashboard provides:

- **Login page** — sign in with any existing user email
- **Dashboard** — summary stats for users, teams, roles, and API health
- **Users page** — browse users, filter by status, create users, edit users, and deactivate users
- **Teams page** — view teams, create teams, add members, and remove members

## Repository structure

```text
.
├── frontend/              # React + Vite frontend
│   └── src/
├── src/                   # Express app source
│   ├── middleware/        # Logging and validation middleware
│   ├── routes/            # Auth, users, and teams routes with tests
│   ├── utils/             # Shared error helpers
│   ├── config.js          # Runtime config
│   ├── db.js              # In-memory fake database
│   └── index.js           # Express server entrypoint
├── PRD.md                 # Product/demo requirements
├── README.md              # Main project documentation
└── package.json           # Root scripts and dependencies
```

## Requirements

- Node.js **20+**
- npm

## Installation

```bash
npm install
```

If you want to provide local environment values, create a `.env` file from the example:

```bash
cp .env.example .env
```

## Environment variables

See `.env.example` for the full list.

- `PORT` - Express server port. Defaults to `3000`.
- `SENTRY_DSN` - Optional Sentry DSN used by the backend.
- `NODE_ENV` - Runtime environment. Defaults to `development`.

## Running the project

### API only

```bash
npm run dev
```

Starts the Express server with file watching on `http://localhost:3000`.

### Frontend only

```bash
npm run dev:frontend
```

Starts the Vite dev server on `http://localhost:5173`.

The Vite dev server proxies `/api` and `/health` requests to `http://localhost:3000`, so run `npm run dev` in another terminal when using the UI in local development.

### Full stack

```bash
npm run dev:all
```

Starts the backend watcher and the frontend dev server together.

### Production-style run

```bash
npm run build:frontend
npm start
```

This builds the frontend into `public/` and serves the compiled SPA from the Express server.

## Common development workflow

1. Install dependencies with `npm install`
2. Start the backend with `npm run dev`
3. Start the frontend with `npm run dev:frontend` or use `npm run dev:all` to run both servers together
4. Open `http://localhost:5173`
5. Log in with an existing demo account such as `alice@acme.com`

## Demo accounts

You can log in using any email that exists in the in-memory database. Common examples shown in the UI include:

- `alice@acme.com` — admin
- `bob@acme.com` — developer
- `frank@acme.com` — product manager

## API summary

### Health

- `GET /health` - returns `{ "status": "ok" }`

### Auth

- `POST /api/auth/login` - fake login by email
- `POST /api/auth/logout` - fake logout success response

Example login body:

```json
{
  "email": "alice@acme.com"
}
```

### Users

- `GET /api/users` - list all users
- `GET /api/users/:id` - get a single user
- `GET /api/users/:id/profile` - get a derived user profile view
- `POST /api/users` - create a user
- `PATCH /api/users/:id` - update a user
- `DELETE /api/users/:id` - deactivate a user

Example create body:

```json
{
  "name": "Jane Doe",
  "email": "jane@acme.com",
  "role": "developer"
}
```

### Teams

- `GET /api/teams` - list all teams
- `GET /api/teams/:id` - get a team
- `GET /api/teams/:id/members` - list resolved team members
- `POST /api/teams` - create a team
- `POST /api/teams/:id/members` - add a member to a team
- `DELETE /api/teams/:id/members/:userId` - remove a member from a team

Example add-member body:

```json
{
  "userId": "5"
}
```

## Frontend architecture notes

- `frontend/src/App.jsx` handles app-level auth state and route protection.
- `frontend/src/api.js` centralizes fetch calls and converts API errors into thrown `Error` objects.
- `frontend/src/pages/Dashboard.jsx` loads users, teams, and health data for high-level metrics.
- `frontend/src/pages/UsersPage.jsx` supports filtering, creation, editing, and deactivation flows.
- `frontend/src/pages/TeamsPage.jsx` loads teams and memberships and manages team member changes.
- `frontend/src/pages/LoginPage.jsx` performs email-based login against `/api/auth/login`.

## Backend architecture notes

- `src/index.js` wires middleware, API routes, static asset serving, SPA fallback, and error handling.
- `src/config.js` reads runtime config from environment variables.
- `src/db.js` is the only data source and keeps state in memory, so data resets when the process restarts.
- `src/middleware/logger.js` logs incoming requests.
- `src/middleware/validate.js` contains reusable validation middleware for required fields and email format checks.
- `src/routes/*.js` files keep route handlers grouped by domain.
- Route tests in `src/routes/*.test.js` cover auth, users, and teams behavior with Node's built-in test runner.

## Testing

Run the full test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The test suite exercises route behavior by mounting Express apps in-process and using `fetch` against ephemeral ports.

## Notes and limitations

- Data is stored only in memory; restarting the server resets users and teams.
- Authentication is intentionally simple and is not backed by sessions or tokens.
- The frontend uses the root package dependencies and scripts rather than a separate frontend package.
- The production SPA fallback only activates when a built `public/index.html` exists.

## Related docs

- `PRD.md` - original demo requirements for the repository
