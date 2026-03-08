# acme-api

Internal API service for Acme Corp with a React admin dashboard frontend.

## Overview

This repository contains:

- an **Express API** in `src/`
- a **React + Vite admin dashboard** in `frontend/`
- an **in-memory data layer** in `src/db.js` for demo and testing scenarios
- route tests built with Node's built-in test runner

The app supports basic user, team, and auth flows for a small internal admin experience.

## Project Structure

```text
.
├── frontend/           # React admin dashboard
│   └── src/
├── src/                # Express API
│   ├── middleware/
│   ├── routes/
│   └── utils/
├── README.md
├── PRD.md
└── package.json
```

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm install
```

Optional environment variables:

- `PORT` - API server port, defaults to `3000`
- `SENTRY_DSN` - Sentry DSN used by the server instrumentation
- `NODE_ENV` - runtime environment, defaults to `development`

## Development

### API only

```bash
npm run dev
```

The Express API runs on `http://localhost:3000`.

### Frontend only

```bash
npm run dev:frontend
```

The Vite dev server runs on `http://localhost:5173` and serves the React app from `frontend/`.

The Vite config proxies `/api` and `/health` requests to `http://localhost:3000` during development.

> Note: if you run `npm run dev:frontend` without the backend, API-driven screens will fail because the frontend still depends on the Express server.

### Full stack

```bash
npm run dev:all
```

This starts both the API watcher and the frontend dev server.

## Production build

```bash
npm run build:frontend
npm start
```

This builds the React app into `public/` and serves the built frontend from the Express server at `http://localhost:3000`.

## Application Features

### Frontend

The admin dashboard includes:

- **Login page** using a known user email from the seeded in-memory dataset
- **Dashboard** with users, teams, and API health summary data
- **Users page** to list, create, edit, and deactivate users
- **Teams page** to create teams and manage team membership

Sample seeded login emails include:

- `alice@acme.com`
- `bob@acme.com`
- `carol@acme.com`

### Backend

The Express API exposes:

- health check routes
- user CRUD-style endpoints
- team management endpoints
- simple auth endpoints for login/logout demos
- logging, validation, and centralized error handling

## API Endpoints

### Health

- `GET /health` - health check response

### Users

- `GET /api/users` - list all users
- `GET /api/users/:id` - get a user by ID
- `GET /api/users/:id/profile` - get a lightweight user profile
- `POST /api/users` - create a user
- `PATCH /api/users/:id` - update a user
- `DELETE /api/users/:id` - mark a user inactive

### Teams

- `GET /api/teams` - list all teams
- `GET /api/teams/:id` - get a team by ID
- `GET /api/teams/:id/members` - list team members
- `POST /api/teams` - create a team
- `POST /api/teams/:id/members` - add a member to a team
- `DELETE /api/teams/:id/members/:userId` - remove a member from a team

### Auth

- `POST /api/auth/login` - login with an existing user email
- `POST /api/auth/logout` - return a logout success response

## Data Model Notes

Data is stored in memory in `src/db.js`.

- The seeded dataset includes users and teams with timestamps.
- User records include `status` values such as `active`, `inactive`, and `pending`.
- Changes made while the app is running are not persisted across restarts.
- Tests reset the in-memory state between runs.

## Testing

Run the route test suite with:

```bash
npm test
```

Watch mode is also available:

```bash
npm run test:watch
```

## Documentation Notes

- `README.md` describes how to run and use the current application.
- `PRD.md` documents the original demo-repository requirements and historical implementation context.
