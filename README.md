# acme-api

Internal API service for Acme Corp with a React admin dashboard frontend.

## What this project includes

- **Express API** for users, teams, auth, and health checks
- **React admin dashboard** for managing users and teams
- **In-memory fake database** (`src/db.js`) for demo-friendly local development
- **Node test suite** for API routes

---

## Quickstart

```bash
cp .env.example .env
npm install
```

### Run API only

```bash
npm run dev
```

API URL: http://localhost:3000

### Run frontend only (Vite with API proxy)

```bash
npm run dev:frontend
```

Frontend URL: http://localhost:5173

### Run both API + frontend

```bash
npm run dev:all
```

### Production-style run

```bash
npm run build:frontend
npm start
```

This builds the frontend into `public/` and serves the app from the Express server.

---

## Project structure

```text
acme-api/
├── frontend/               # React SPA (Vite)
│   └── src/
├── src/                    # Express backend
│   ├── middleware/         # logger + request validation
│   ├── routes/             # auth, users, teams endpoints
│   ├── utils/              # shared error utilities
│   ├── config.js           # runtime config
│   ├── db.js               # in-memory fake data layer
│   └── index.js            # app entry point
├── README.md
└── PRD.md
```

---

## Frontend overview

The frontend is a React SPA in `frontend/` with these key pages:

- **Login**: authenticate by entering an existing user email (e.g. `alice@acme.com`)
- **Dashboard**: quick metrics for users, teams, and API health
- **Users**: list/create/edit/deactivate users
- **Teams**: create teams and manage team membership

Main frontend API wrapper: `frontend/src/api.js`

---

## API overview

Base paths:

- Health: `/health`
- Users: `/api/users`
- Teams: `/api/teams`
- Auth: `/api/auth`

For request/response examples, see **[`docs/API_REFERENCE.md`](docs/API_REFERENCE.md)**.

---

## Testing

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

---

## Environment variables

See `.env.example`.

- `PORT` - API server port (default `3000`)
- `SENTRY_DSN` - Sentry DSN for error tracking
- `NODE_ENV` - Runtime environment (default `development`)

---

## Scripts

- `npm start` - Run API server
- `npm run dev` - Run API in watch mode
- `npm run dev:frontend` - Run Vite frontend dev server
- `npm run dev:all` - Run API and frontend together
- `npm run build:frontend` - Build frontend into `public/`
- `npm test` - Run route tests
- `npm run test:watch` - Run tests in watch mode
