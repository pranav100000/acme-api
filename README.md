# acme-api

Internal API service for Acme Corp.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Web Dashboard

The app includes a built-in web dashboard at `http://localhost:3000` with:

- **Dashboard** — Overview with user/team stats and recent activity
- **Users** — List, search, filter, create, edit, and deactivate users
- **Teams** — View teams with members, create teams, add/remove members
- **Auth** — Test login/logout functionality

## Endpoints

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

## Testing

```bash
npm test
```

## Environment Variables

See `.env.example` for all available configuration options.

- `PORT` - Server port (default: 3000)
- `SENTRY_DSN` - Sentry DSN for error tracking
- `NODE_ENV` - Environment (default: development)
