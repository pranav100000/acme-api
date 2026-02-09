# acme-api

Internal API service for Acme Corp.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

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
