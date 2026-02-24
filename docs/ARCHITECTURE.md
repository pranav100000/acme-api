# Architecture

This document describes the high-level architecture of the acme-api project — an Express.js backend with a React admin dashboard frontend.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Backend](#backend)
- [Frontend](#frontend)
- [Data Flow](#data-flow)
- [Development vs Production](#development-vs-production)
- [Error Tracking](#error-tracking)

---

## Overview

The project is a full-stack JavaScript application consisting of:

1. **Backend** — An Express.js REST API serving JSON data from an in-memory database
2. **Frontend** — A React 19 SPA (single-page application) built with Vite, providing an admin dashboard UI

Both parts live in the same repository and can be developed and deployed together.

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  ┌───────────────────────────────────────────┐   │
│  │         React Admin Dashboard             │   │
│  │  (Login, Dashboard, Users, Teams pages)   │   │
│  └──────────────────┬────────────────────────┘   │
└─────────────────────┼────────────────────────────┘
                      │ HTTP (fetch)
┌─────────────────────┼────────────────────────────┐
│              Express.js Server                    │
│  ┌──────────────────┴────────────────────────┐   │
│  │            Route Handlers                  │   │
│  │   /api/users  /api/teams  /api/auth       │   │
│  └──────────────────┬────────────────────────┘   │
│  ┌──────────────────┴────────────────────────┐   │
│  │         In-Memory Database (db.js)         │   │
│  │   users[]            teams[]               │   │
│  └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## Project Structure

```
acme-api/
├── .env.example              # Environment variable template
├── .gitignore
├── CONTRIBUTING.md           # Development workflow and coding standards
├── package.json              # Dependencies and npm scripts
├── vite.config.js            # Vite configuration for frontend build
├── PRD.md                    # Product requirements document
├── README.md                 # Quick-start guide
├── docs/
│   ├── API.md                # Full API reference
│   └── ARCHITECTURE.md       # This file
├── frontend/                 # React SPA source
│   ├── index.html            # HTML entry point
│   └── src/
│       ├── main.jsx          # React DOM mount + router setup
│       ├── App.jsx           # Root component, auth context, routing
│       ├── api.js            # API client (fetch wrappers)
│       ├── index.css         # Global styles
│       ├── components/
│       │   ├── Layout.jsx    # Sidebar + main content layout shell
│       │   └── Modal.jsx     # Reusable modal dialog component
│       └── pages/
│           ├── Dashboard.jsx # Overview stats page
│           ├── LoginPage.jsx # Email-based login form
│           ├── UsersPage.jsx # User list, create, edit, deactivate
│           └── TeamsPage.jsx # Team cards, member management
└── src/                      # Express backend source
    ├── index.js              # App entry point, middleware, route mounting
    ├── instrument.js         # Sentry SDK initialization
    ├── config.js             # Environment configuration
    ├── db.js                 # In-memory database with seed data
    ├── middleware/
    │   ├── logger.js         # Request logging (method, path, timestamp)
    │   └── validate.js       # Email validation + required fields middleware
    ├── routes/
    │   ├── auth.js           # Authentication endpoints
    │   ├── auth.test.js      # Auth route tests
    │   ├── teams.js          # Team CRUD + member management endpoints
    │   ├── teams.test.js     # Team route tests
    │   ├── users.js          # User CRUD endpoints
    │   └── users.test.js     # User route tests
    └── utils/
        └── errors.js         # Custom error classes (NotFoundError, ValidationError)
```

---

## Backend

### Entry Point (`src/index.js`)

The Express app is configured in the following order:

1. **Sentry initialization** — `instrument.js` is imported first to set up error tracking before any other code runs
2. **Body parsing** — `express.json()` middleware for JSON request bodies
3. **Request logging** — Custom logger middleware
4. **Static files** — Serves the built frontend from `public/`
5. **Route mounting** — API routes under `/api/*` and `/health`
6. **SPA fallback** — Non-API routes serve `index.html` (only when a production build exists)
7. **Sentry error handler** — Captures unhandled errors
8. **Fallthrough error handler** — Returns JSON error responses

### Database (`src/db.js`)

The application uses a simple in-memory database — a JavaScript module with arrays of objects. All database operations are async functions with a simulated 10ms delay to mimic real I/O.

Key characteristics:
- **No persistence** — Data resets when the server restarts
- **Seed data** — Ships with 8 users and 4 teams pre-loaded
- **`_reset()` method** — Restores seed data, used by tests to ensure clean state
- **Soft deletes** — `deleteUser()` sets `status: "inactive"` rather than removing records

### Routes

Routes are organized by resource in `src/routes/`:

| File        | Prefix         | Description                           |
|-------------|----------------|---------------------------------------|
| `auth.js`   | `/api/auth`    | Login/logout (email-based, no sessions) |
| `users.js`  | `/api/users`   | User CRUD + profile endpoint          |
| `teams.js`  | `/api/teams`   | Team CRUD + member management         |

Each route file exports an Express Router instance that is mounted in `index.js`.

### Middleware

| File          | Type      | Description                                             |
|---------------|-----------|---------------------------------------------------------|
| `logger.js`   | Global    | Logs `METHOD /path - timestamp` for every request       |
| `validate.js` | Per-route | `validateEmail` checks email format; `validateRequired(fields)` is a factory that checks for required body fields |

### Error Handling

The project uses two error handling strategies:

1. **`express-async-errors`** — Automatically catches rejected promises in async route handlers and forwards them to Express error middleware (no need for try/catch or `asyncHandler` wrappers in route code)
2. **Custom error classes** (`src/utils/errors.js`) — `NotFoundError` (404) and `ValidationError` (400) classes with `statusCode` properties, consumed by the fallthrough error handler

### Configuration (`src/config.js`)

A simple module that reads environment variables with defaults:

| Variable     | Default         | Description                    |
|--------------|-----------------|--------------------------------|
| `PORT`       | `3000`          | Server listen port             |
| `SENTRY_DSN` | (none)          | Sentry error tracking DSN      |
| `NODE_ENV`   | `"development"` | Runtime environment            |

---

## Frontend

### Tech Stack

- **React 19** with functional components and hooks
- **React Router v7** for client-side routing
- **Vite 7** for development server and production builds
- **Pure CSS** — No UI framework; custom styles in `index.css`

### Component Hierarchy

```
BrowserRouter
  └── App (AuthContext.Provider)
        ├── LoginPage          (when not authenticated)
        └── Layout             (when authenticated)
              └── Routes
                    ├── Dashboard    (path: /)
                    ├── UsersPage    (path: /users)
                    └── TeamsPage    (path: /teams)
```

### Authentication

The frontend uses a simple client-side authentication flow:

1. User enters an email on the `LoginPage`
2. `POST /api/auth/login` validates the email against the database
3. On success, the user object is stored in `localStorage` and React state via `AuthContext`
4. On logout, `localStorage` is cleared and state is reset

There are no server-side sessions, tokens, or cookies — this is a simplified demo flow.

### API Client (`frontend/src/api.js`)

A thin wrapper around `fetch()` that:
- Prepends `/api` to all paths
- Sets `Content-Type: application/json` headers
- Parses JSON responses
- Throws errors with the server's error message for non-2xx responses

### Pages

| Page            | Description                                                      |
|-----------------|------------------------------------------------------------------|
| `LoginPage`     | Email input form with demo account suggestions                   |
| `Dashboard`     | Stats cards (total users, teams, roles, API health) + recent users and teams tables |
| `UsersPage`     | Full user table with status filtering, create/edit modals, deactivation |
| `TeamsPage`     | Team cards showing members, create team modal, add/remove member modals |

### Reusable Components

| Component | Description                                                  |
|-----------|--------------------------------------------------------------|
| `Layout`  | Sidebar navigation (Dashboard, Users, Teams) + main content area with user info and logout |
| `Modal`   | Generic modal dialog with overlay, title, close button, and children slot |

---

## Data Flow

### Typical Request Flow

```
Browser → fetch('/api/users')
  → Vite proxy (dev) or Express static (prod)
    → Express middleware chain
      → logger (logs request)
      → express.json() (parses body)
      → validate middleware (if applicable)
      → route handler
        → db.js async function
          → returns data
        → res.json(data)
```

### Error Flow

```
Route handler throws/rejects
  → express-async-errors catches it
    → Sentry error handler (captures for tracking)
      → Fallthrough error handler
        → res.status(err.statusCode || 500).json({ error: err.message })
```

---

## Development vs Production

### Development Mode

In development, two servers run simultaneously:

| Server          | Port  | Purpose                                   |
|-----------------|-------|-------------------------------------------|
| Express backend | 3000  | Serves the API                            |
| Vite dev server | 5173  | Serves the frontend with hot module reload |

Vite is configured to proxy `/api/*` and `/health` requests to `localhost:3000`, so the frontend can make API calls seamlessly.

Start both with:
```bash
npm run dev:all
```

### Production Mode

In production, the frontend is pre-built into the `public/` directory, and the Express server serves everything:

```bash
npm run build:frontend   # Builds React app → public/
npm start                # Express serves API + static files
```

The Express server includes an SPA fallback: any non-API route serves `public/index.html`, allowing React Router to handle client-side navigation.

---

## Error Tracking

The project integrates with [Sentry](https://sentry.io) for error tracking:

- **`src/instrument.js`** — Initializes the Sentry Node SDK before any other imports
- **`Sentry.setupExpressErrorHandler(app)`** — Captures unhandled Express errors
- **`GET /debug-sentry`** — A test route that throws an error for verifying Sentry integration

To configure Sentry, set the `SENTRY_DSN` environment variable in your `.env` file.

---

## Testing

Tests use **Node.js built-in test runner** (`node --test`) with the `node:test` and `node:assert` modules.

### Test Strategy

- Each route file has a co-located test file (e.g., `users.js` → `users.test.js`)
- Tests spin up an isolated Express app on a random port (`:0`)
- The database is reset before and after each test suite using `db._reset()`
- Tests use the native `fetch()` API to make real HTTP requests

### Running Tests

```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
```

The test suite currently contains **23 tests** across 3 test suites:
- Auth routes: 4 tests
- Team routes: 7 tests
- User routes: 12 tests
