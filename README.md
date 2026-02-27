# acme-api

> Internal API service and React admin dashboard for Acme Corp.

Built with **Express.js** and **React 19** · In-memory data store · Sentry error tracking

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)

## Overview

**acme-api** is an internal tool for managing users and teams at Acme Corp. It includes:

- A RESTful API powered by Express.js with full CRUD operations for users and teams
- A React single-page application (SPA) providing an admin dashboard with login, user management, and team management views
- Simple email-based authentication
- Sentry integration for error tracking
- An in-memory database seeded with sample data (no external database required)

## Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** (comes with Node.js)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd acme-api
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` to set your Sentry DSN and other options (see [Environment Variables](#environment-variables)).

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

   The API will be available at [http://localhost:3000](http://localhost:3000).

5. **Verify it's running**

   ```bash
   curl http://localhost:3000/health
   # → {"status":"ok"}
   ```

## Development

### API only

```bash
npm run dev
```

Starts the Express server on [http://localhost:3000](http://localhost:3000) with automatic restart on file changes (using Node.js `--watch`).

### Frontend only (with hot reload)

```bash
npm run dev:frontend
```

Starts the Vite dev server on [http://localhost:5173](http://localhost:5173). API requests are automatically proxied to port 3000, so make sure the API server is also running.

### Full stack (API + Frontend)

```bash
npm run dev:all
```

Runs both the API server and Vite dev server concurrently.

### Production build

```bash
npm run build:frontend
npm start
```

Builds the React frontend into the `public/` directory and serves everything — API and static frontend — from the Express server at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
acme-api/
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
├── vite.config.js          # Vite config for the React frontend
├── README.md
│
├── src/                    # Backend (Express API)
│   ├── index.js            # App entry point — mounts routes, middleware, error handlers
│   ├── config.js           # Centralised configuration (port, env, Sentry DSN)
│   ├── instrument.js       # Sentry instrumentation (imported before all other modules)
│   ├── db.js               # In-memory database with seed data (users & teams)
│   ├── middleware/
│   │   ├── logger.js       # Request logging (method, path, timestamp)
│   │   └── validate.js     # Email & required-field validation middleware
│   ├── routes/
│   │   ├── auth.js         # Authentication routes (login/logout)
│   │   ├── auth.test.js    # Auth route tests
│   │   ├── teams.js        # Team CRUD & membership routes
│   │   ├── teams.test.js   # Team route tests
│   │   ├── users.js        # User CRUD routes
│   │   └── users.test.js   # User route tests
│   └── utils/
│       └── errors.js       # Custom error classes (NotFoundError, ValidationError)
│
└── frontend/               # Frontend (React SPA)
    ├── index.html          # HTML entry point
    └── src/
        ├── main.jsx        # React entry point
        ├── App.jsx         # Root component with routing
        ├── api.js          # API client helper functions
        ├── index.css       # Global styles
        ├── components/
        │   ├── Layout.jsx  # Shared page layout (sidebar, header)
        │   └── Modal.jsx   # Reusable modal component
        └── pages/
            ├── LoginPage.jsx   # Email-based login
            ├── Dashboard.jsx   # Overview stats (users, teams, health)
            ├── UsersPage.jsx   # User list with create, edit, and deactivate
            └── TeamsPage.jsx   # Team cards with member management
```

## Frontend

The frontend is a React SPA built with Vite, located in the `frontend/` directory. It provides:

| Page | Description |
|------|-------------|
| **Login** | Authenticate with any existing user's email (e.g. `alice@acme.com`) |
| **Dashboard** | Overview stats for users, teams, and API health status |
| **Users** | List, create, edit, and deactivate users with status filtering |
| **Teams** | View teams as cards, create new teams, add/remove members |

The frontend uses pure CSS with no UI framework — it has a clean, modern admin dashboard design. In development, the Vite dev server proxies `/api` and `/health` requests to the Express backend.

## API Reference

All endpoints return JSON. Errors follow the format `{ "error": "<message>" }`.

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check — returns `{ "status": "ok" }` |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login with email — returns the matching user object |
| `POST` | `/api/auth/logout` | Logout — returns success confirmation |

**Login request body:**
```json
{ "email": "alice@acme.com" }
```

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/:id` | Get a user by ID |
| `GET` | `/api/users/:id/profile` | Get a user's profile (includes team info) |
| `POST` | `/api/users` | Create a new user (validates email format) |
| `PATCH` | `/api/users/:id` | Update a user's fields |
| `DELETE` | `/api/users/:id` | Soft-delete a user (sets status to `inactive`) |

**Create user request body:**
```json
{ "email": "newuser@acme.com", "name": "New User", "role": "developer" }
```

**Update user request body** (all fields optional):
```json
{ "name": "Updated Name", "role": "admin", "status": "active" }
```

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/teams` | List all teams |
| `GET` | `/api/teams/:id` | Get a team by ID |
| `GET` | `/api/teams/:id/members` | Get all members of a team |
| `POST` | `/api/teams` | Create a new team |
| `POST` | `/api/teams/:id/members` | Add a member to a team |
| `DELETE` | `/api/teams/:id/members/:userId` | Remove a member from a team |

**Create team request body:**
```json
{ "name": "New Team" }
```

**Add member request body:**
```json
{ "userId": "3" }
```

### Sample Data

The in-memory database is pre-seeded with **8 users** and **4 teams**:

**Users:** Alice Chen, Bob Smith, Carol Jones, David Park, Eve Martinez, Frank Wilson, Grace Lee, Henry Taylor

**Teams:** Engineering, Product, Design, Infrastructure

## Testing

Tests use Node.js's built-in test runner — no additional test framework required.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

The test suite includes **23 tests** across 3 suites covering auth, user, and team routes.

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the Express server listens on |
| `SENTRY_DSN` | — | Sentry DSN for error tracking (optional) |
| `NODE_ENV` | `development` | Environment — `development` or `production` |

## Tech Stack

### Backend
- **[Express.js](https://expressjs.com/)** — Web framework
- **[Sentry](https://sentry.io/)** (`@sentry/node`) — Error tracking
- **[express-async-errors](https://github.com/davidbanham/express-async-errors)** — Async error handling for Express

### Frontend
- **[React 19](https://react.dev/)** — UI library
- **[React Router](https://reactrouter.com/)** v7 — Client-side routing
- **[Vite](https://vitejs.dev/)** v7 — Build tool and dev server
