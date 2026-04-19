# acme-api

Internal API service for Acme Corp — with a React admin dashboard frontend.

## Setup

```bash
cp .env.example .env
npm install
```

## Development

### API only
```bash
npm run dev
```
The API runs on http://localhost:3000.

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
npm run build
npm start
```
This builds the React frontend into `public/` and serves it from the Express server at http://localhost:3000.

## Quality checks

```bash
npm run lint
npm test
npm run build
```

GitHub Actions runs the same lint, test, and build checks on pull requests and pushes to `main`.

## Frontend

The frontend is a React SPA (built with Vite) located in the `frontend/` directory. It provides:

- **Login page** — authenticate with any existing user email (e.g. `alice@acme.com`)
- **Dashboard** — overview stats for users, teams, and API health
- **Users page** — list, create, edit, and deactivate users with status filtering
- **Teams page** — view teams as cards, create teams, add/remove members
- **Unified notifications** — sidebar bell with unread counts, quick actions, and mark-read controls

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

### Notifications
- `GET /api/notifications/users/:userId` - List notifications for a user
- `GET /api/notifications/users/:userId?unread=true` - List unread notifications
- `GET /api/notifications/users/:userId/unread-count` - Get unread notification count
- `POST /api/notifications/users/:userId` - Create a notification
- `PATCH /api/notifications/users/:userId/:notificationId/read` - Mark a notification read
- `PATCH /api/notifications/users/:userId/read-all` - Mark all user notifications read

## Testing

```bash
npm test
```

## Environment Variables

See `.env.example` for all available configuration options.

- `PORT` - Server port (default: 3000)
- `SENTRY_DSN` - Sentry DSN for error tracking
- `NODE_ENV` - Environment (default: development)
