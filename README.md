# acme-api

Internal API service for Acme Corp — with a React admin dashboard frontend.

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev:all
```

This starts the API on [http://localhost:3000](http://localhost:3000) and the frontend on [http://localhost:5173](http://localhost:5173).

## Development

### API only
```bash
npm run dev
```
The API runs on http://localhost:3000 with automatic restart on file changes.

### Frontend only (with hot reload)
```bash
npm run dev:frontend
```
The Vite dev server runs on http://localhost:5173 and proxies API requests to port 3000.

### Full stack (API + Frontend)
```bash
npm run dev:all
```

### Production build
```bash
npm run build:frontend
npm start
```
This builds the React frontend into `public/` and serves it from the Express server at http://localhost:3000.

## Project Structure

```
acme-api/
├── src/                      # Express backend
│   ├── index.js              # App entry point
│   ├── config.js             # Environment config
│   ├── db.js                 # In-memory database
│   ├── middleware/            # Logger, validation
│   ├── routes/               # API route handlers + tests
│   └── utils/                # Error classes, helpers
├── frontend/                 # React SPA
│   └── src/
│       ├── App.jsx           # Root component + auth
│       ├── api.js            # API client
│       ├── components/       # Layout, Modal
│       └── pages/            # Dashboard, Users, Teams, Login
└── docs/                     # Documentation
    ├── API.md                # Full API reference
    └── ARCHITECTURE.md       # Architecture guide
```

## Frontend

The frontend is a React SPA (built with Vite) located in the `frontend/` directory. It provides:

- **Login page** — authenticate with any existing user email (e.g. `alice@acme.com`)
- **Dashboard** — overview stats for users, teams, and API health
- **Users page** — list, create, edit, and deactivate users with status filtering
- **Teams page** — view teams as cards, create teams, add/remove members

### Tech Stack
- React 19 + React Router
- Vite for bundling
- Pure CSS (no UI framework) — clean, modern admin dashboard design

## API Endpoints

### Health
- `GET /health` - Health check

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/profile` - Get user profile
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team by ID
- `GET /api/teams/:id/members` - Get team members
- `POST /api/teams` - Create team
- `POST /api/teams/:id/members` - Add member to team
- `DELETE /api/teams/:id/members/:userId` - Remove member from team

### Auth
- `POST /api/auth/login` - Login with email
- `POST /api/auth/logout` - Logout

For detailed request/response examples, see [docs/API.md](docs/API.md).

## Testing

```bash
npm test              # Run all 23 tests
npm run test:watch    # Run in watch mode
```

Tests use Node.js built-in test runner (`node --test`) with co-located test files alongside route handlers.

## Environment Variables

See `.env.example` for all available configuration options.

| Variable    | Default       | Description                          |
|-------------|---------------|--------------------------------------|
| `PORT`      | `3000`        | Server port                          |
| `SENTRY_DSN`| —            | Sentry DSN for error tracking        |
| `NODE_ENV`  | `development` | Environment (`development`, `production`) |

## Documentation

- **[API Reference](docs/API.md)** — Complete endpoint documentation with request/response examples
- **[Architecture Guide](docs/ARCHITECTURE.md)** — Project structure, design decisions, and data flow
- **[Contributing Guide](CONTRIBUTING.md)** — Development workflow, coding standards, and testing practices
