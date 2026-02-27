# Contributing to acme-api

Thank you for your interest in contributing to the Acme Corp internal API! This guide will help you get set up, understand the codebase, and submit quality contributions.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Writing Tests](#writing-tests)
- [Pull Request Process](#pull-request-process)
- [Common Tasks](#common-tasks)

---

## Getting Started

### Prerequisites

- **Node.js 20+** — check with `node --version`
- **npm** — comes with Node.js

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd acme-api
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Verify everything works:
   ```bash
   npm test        # Run the test suite
   npm run dev     # Start the API server
   ```

### Environment Variables

| Variable     | Default       | Description                     |
|-------------|---------------|---------------------------------|
| `PORT`      | `3000`        | Port for the Express server     |
| `SENTRY_DSN`| —             | Sentry DSN for error tracking   |
| `NODE_ENV`  | `development` | Environment mode                |

---

## Project Structure

```
acme-api/
├── frontend/                # React SPA (Vite)
│   └── src/
│       ├── components/      # Reusable UI components (Layout, Modal)
│       ├── pages/           # Page components (Dashboard, Login, Users, Teams)
│       ├── api.js           # API client functions
│       ├── App.jsx          # Root component with auth context & routing
│       └── main.jsx         # Entry point
├── src/                     # Express API server
│   ├── index.js             # App entry point & Express setup
│   ├── config.js            # Environment configuration
│   ├── db.js                # In-memory fake database
│   ├── middleware/
│   │   ├── logger.js        # Request logging middleware
│   │   └── validate.js      # Email & required-field validation
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints (login/logout)
│   │   ├── auth.test.js     # Auth route tests
│   │   ├── teams.js         # Team CRUD endpoints
│   │   ├── teams.test.js    # Team route tests
│   │   ├── users.js         # User CRUD endpoints
│   │   └── users.test.js    # User route tests
│   └── utils/
│       └── errors.js        # Custom error classes (NotFoundError, ValidationError)
├── package.json
├── vite.config.js           # Vite config for the frontend
├── .env.example
└── README.md
```

### Key Concepts

- **No real database** — the API uses an in-memory store in `src/db.js`. Data resets on every server restart.
- **No authentication middleware** — auth routes exist but there's no session/token enforcement on other routes.
- **Frontend proxies API calls** — in development, the Vite dev server proxies `/api` and `/health` requests to the Express server on port 3000.

---

## Development Workflow

### Running the App

| Command                | Description                                       |
|-----------------------|---------------------------------------------------|
| `npm run dev`         | Start the API server with file watching (port 3000) |
| `npm run dev:frontend`| Start the Vite dev server with HMR (port 5173)    |
| `npm run dev:all`     | Start both API and frontend together               |
| `npm start`           | Start the API server (production)                  |
| `npm run build:frontend` | Build the React frontend into `public/`         |

### Running Tests

```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
```

Tests use **Node.js built-in test runner** (`node --test`). Test files are co-located with their source files using the `*.test.js` naming convention.

### Branching Strategy

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit often with clear messages.
3. Push your branch and open a pull request.

---

## Code Style

### General Rules

- **Semicolons** — always use semicolons
- **Indentation** — 2 spaces
- **Quotes** — single quotes for strings
- **Module system** — CommonJS (`require`/`module.exports`) for backend, ES Modules (`import`/`export`) for frontend
- **Async/await** — use `async/await` over raw Promises

### Patterns to Follow

**Use early returns for error cases:**
```javascript
router.get('/:id', async (req, res) => {
  const user = findUser(Number(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});
```

**Keep functions small and focused** — each route handler should do one thing.

**Use descriptive variable names:**
```javascript
// Good
const teamMembers = getTeamMembers(teamId);

// Avoid
const data = getTeamMembers(id);
```

**Add JSDoc comments on exported functions:**
```javascript
/**
 * Find a user by their ID.
 * @param {number} id - The user ID
 * @returns {object|undefined} The user object, or undefined if not found
 */
function findUser(id) {
  return users.find(u => u.id === id);
}
```

### Backend Conventions

- Routes go in `src/routes/<resource>.js` and export an Express `Router`
- Validation middleware lives in `src/middleware/validate.js`
- Custom error classes live in `src/utils/errors.js`
- Async errors in route handlers are caught automatically by [`express-async-errors`](https://www.npmjs.com/package/express-async-errors) — no need for manual try/catch in routes
- Configuration is centralized in `src/config.js`

### Frontend Conventions

- Pages go in `frontend/src/pages/`
- Reusable components go in `frontend/src/components/`
- All API calls go through the helpers in `frontend/src/api.js`
- Styles use plain CSS in `frontend/src/index.css` — no CSS framework

---

## Writing Tests

### Test Structure

Tests use Node's built-in test runner with `describe`, `test`, `before`, `beforeEach`, and `after` blocks. Each test file creates its own Express app instance to avoid shared state:

```javascript
const { describe, test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

function createApp() {
  // Set up a fresh Express app for testing
}

describe('Resource Routes', () => {
  let server;
  let baseUrl;

  before(async () => {
    const app = createApp();
    server = http.createServer(app);
    await new Promise(resolve => server.listen(0, resolve));
    baseUrl = `http://localhost:${server.address().port}`;
  });

  after(async () => {
    await new Promise(resolve => server.close(resolve));
  });

  beforeEach(() => {
    // Reset the in-memory database before each test
    const db = require('../db');
    db._reset();
  });

  test('GET /api/resource returns all items', async () => {
    const res = await fetch(`${baseUrl}/api/resource`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
  });
});
```

### Test Guidelines

- **Co-locate tests** — put `*.test.js` files next to the source they test
- **Reset state** — call `db._reset()` in `beforeEach` to get a clean database
- **Test happy paths and error cases** — verify both successful responses and proper error handling
- **Use `assert.strictEqual`** for status codes and exact values
- **Use `assert.ok`** for truthy checks
- **No external test frameworks** — stick with `node:test` and `node:assert`

### Running a Single Test File

```bash
node --test src/routes/users.test.js
```

---

## Pull Request Process

1. **Ensure tests pass** — run `npm test` before opening a PR
2. **Keep PRs focused** — one feature or fix per PR
3. **Write a clear description** — explain what changed and why
4. **Include test coverage** — new features should come with tests
5. **Update the README** — if you add new endpoints or change setup steps, update `README.md`

### PR Checklist

- [ ] All existing tests pass (`npm test`)
- [ ] New tests added for new functionality
- [ ] Code follows the project style conventions
- [ ] README updated (if applicable)
- [ ] No unnecessary dependencies added

---

## Common Tasks

### Adding a New API Endpoint

1. Open the relevant route file in `src/routes/` (or create a new one)
2. Add your route handler using `async/await`:
   ```javascript
   router.post('/', validateRequired(['name', 'email']), async (req, res) => {
     const item = createItem(req.body);
     res.status(201).json(item);
   });
   ```
3. If you created a new route file, register it in `src/index.js`:
   ```javascript
   const newRoutes = require('./routes/new-resource');
   app.use('/api/new-resource', newRoutes);
   ```
4. Add tests in a co-located `*.test.js` file
5. Update the API Endpoints section in `README.md`

### Adding a New Frontend Page

1. Create a new page component in `frontend/src/pages/`
2. Add API client functions in `frontend/src/api.js` if needed
3. Add a route in `frontend/src/App.jsx`
4. Add navigation in `frontend/src/components/Layout.jsx`

### Adding Database Records

Edit `src/db.js` to add new seed data. Records follow this general shape:

- **Users**: `{ id, name, email, role, status, createdAt, updatedAt }`
- **Teams**: `{ id, name, description, memberIds, createdAt, updatedAt }`

### Adding Middleware

1. Create or update files in `src/middleware/`
2. Export your middleware function
3. Apply it to routes either globally in `src/index.js` or per-route in the route file

---

## Questions?

If you're unsure about anything, check the existing code for patterns — the codebase is intentionally small and readable. When in doubt, keep it simple.
