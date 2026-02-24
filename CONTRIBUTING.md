# Contributing

Thank you for contributing to acme-api! This guide covers the development workflow, coding conventions, and testing practices used in this project.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Adding a New API Endpoint](#adding-a-new-api-endpoint)
- [Adding a Frontend Page](#adding-a-frontend-page)
- [Testing](#testing)
- [Project Conventions](#project-conventions)

---

## Getting Started

### Prerequisites

- **Node.js 20+** is required (see `engines` in `package.json`)
- No database setup needed — the app uses an in-memory store

### Initial Setup

```bash
# Clone the repo
git clone <repo-url>
cd acme-api

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Verify everything works
npm test
```

---

## Development Workflow

### Running the Full Stack

```bash
npm run dev:all
```

This starts:
- **Backend** on `http://localhost:3000` (with file watching)
- **Frontend** on `http://localhost:5173` (with hot module reload)

The Vite dev server automatically proxies API requests to the backend.

### Running Backend Only

```bash
npm run dev
```

Useful when working only on API changes. The server restarts automatically when files change.

### Running Frontend Only

```bash
npm run dev:frontend
```

Starts the Vite dev server. Make sure the backend is running separately for API calls to work.

### Available Scripts

| Script              | Description                                     |
|---------------------|-------------------------------------------------|
| `npm start`         | Start the production server                     |
| `npm run dev`       | Start backend with file watching                |
| `npm run dev:frontend` | Start Vite dev server for frontend           |
| `npm run dev:all`   | Start both backend and frontend                 |
| `npm run build:frontend` | Build frontend for production (`public/`)  |
| `npm test`          | Run test suite                                  |
| `npm run test:watch`| Run tests in watch mode                         |

---

## Coding Standards

### General

- **Semicolons** — Always use semicolons
- **Indentation** — 2 spaces
- **Quotes** — Single quotes for strings
- **Async/await** — Use async/await everywhere (no raw Promises or callbacks)
- **Early returns** — Return early for error cases to reduce nesting
- **Small functions** — Keep functions focused on a single responsibility

### Backend (Express)

```javascript
// ✅ Good — early return, async/await, descriptive names
router.get('/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// ❌ Bad — deeply nested, unclear variable names
router.get('/:id', async (req, res) => {
  const u = await db.findUser(req.params.id);
  if (u) {
    res.json(u);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});
```

### Frontend (React)

- **Functional components** with hooks (no class components)
- **Named exports** for utility functions; **default exports** for page/component files
- **State management** via `useState` and `useContext` (no external state libraries)
- **Error handling** in async operations with try/catch and user-facing error messages

### JSDoc

Add brief JSDoc comments on exported functions and middleware:

```javascript
/**
 * Validates email format in request body
 */
const validateEmail = (req, res, next) => { ... };
```

---

## Adding a New API Endpoint

### 1. Add the Route

Create or update a route file in `src/routes/`:

```javascript
// src/routes/example.js
const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await db.getAllItems();
  res.json(items);
});

module.exports = router;
```

### 2. Mount the Route

Register the route in `src/index.js`:

```javascript
const exampleRoutes = require('./routes/example');
app.use('/api/example', exampleRoutes);
```

### 3. Add Database Methods (if needed)

Add async methods to `src/db.js`. Follow the existing pattern:

```javascript
async getAllItems() {
  await new Promise(resolve => setTimeout(resolve, 10));
  return items;
},
```

### 4. Add Validation (if needed)

Use the existing middleware from `src/middleware/validate.js`:

```javascript
const { validateRequired } = require('../middleware/validate');

router.post('/', validateRequired(['name', 'type']), async (req, res) => { ... });
```

### 5. Write Tests

Create a co-located test file (e.g., `src/routes/example.test.js`). See [Testing](#testing) below.

### 6. Update Documentation

- Add the endpoint to `docs/API.md`
- Update the endpoint list in `README.md`

---

## Adding a Frontend Page

### 1. Create the Page Component

Add a new file in `frontend/src/pages/`:

```jsx
import React, { useState, useEffect } from 'react';
import * as api from '../api';

export default function ExamplePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await api.getItems();
        setData(result);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return <div>{/* your UI here */}</div>;
}
```

### 2. Add the API Client Function

Add the fetch wrapper to `frontend/src/api.js`:

```javascript
export const getItems = () => request('/items');
```

### 3. Add the Route

Register the route in `frontend/src/App.jsx`:

```jsx
import ExamplePage from './pages/ExamplePage';

// Inside the Routes component:
<Route path="/example" element={<ExamplePage />} />
```

### 4. Add Navigation

Add a link in `frontend/src/components/Layout.jsx`:

```jsx
<NavLink to="/example">
  <span className="nav-icon">📋</span>
  Example
</NavLink>
```

---

## Testing

### Running Tests

```bash
npm test              # Run once
npm run test:watch    # Watch mode (re-runs on file changes)
```

### Writing Tests

Tests use Node.js built-in test runner with `node:test` and `node:assert`.

Each test file should:
1. Create an isolated Express app with the relevant routes
2. Start a server on a random port
3. Reset the database before and after the suite
4. Make real HTTP requests using `fetch()`

```javascript
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const db = require('../db');
const myRoutes = require('./myroute');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/myroute', myRoutes);
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });
  return app;
}

describe('My Route', () => {
  let server;
  let baseUrl;

  before(async () => {
    db._reset();
    const app = createApp();
    server = app.listen(0);
    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
  });

  after(async () => {
    server.close();
    db._reset();
  });

  test('GET /api/myroute returns data', async () => {
    const res = await fetch(`${baseUrl}/api/myroute`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });
});
```

### Test Conventions

- **Test file location** — Co-located with the source file: `example.js` → `example.test.js`
- **Test isolation** — Each suite gets its own server; DB is reset in `before`/`after` hooks
- **Assertions** — Use `assert.strictEqual` for exact matches, `assert.ok` for truthy checks, `assert.deepStrictEqual` for object/array comparison
- **Coverage** — Test both success and error paths (200s, 400s, 404s)

---

## Project Conventions

### File Organization

| Directory              | Purpose                          |
|------------------------|----------------------------------|
| `src/`                 | Backend source code              |
| `src/routes/`          | Express route handlers + tests   |
| `src/middleware/`      | Express middleware               |
| `src/utils/`           | Shared utilities and helpers     |
| `frontend/src/`        | React frontend source            |
| `frontend/src/pages/`  | Page-level components            |
| `frontend/src/components/` | Reusable UI components       |
| `docs/`                | Project documentation            |

### Naming Conventions

- **Files** — `kebab-case.js` for utilities, `PascalCase.jsx` for React components
- **Variables/functions** — `camelCase`
- **Constants** — `UPPER_SNAKE_CASE` for true constants
- **Routes** — RESTful naming (`/api/users`, `/api/teams/:id/members`)

### Error Responses

All API errors should return a consistent JSON format:

```json
{
  "error": "Human-readable error message"
}
```

Use appropriate HTTP status codes (400 for validation, 404 for not found, 409 for conflicts, 500 for server errors).

### Database

- The in-memory database (`src/db.js`) uses simulated async delays
- All DB methods return `null` when a record isn't found (not an error)
- Route handlers are responsible for converting `null` returns into 404 responses
- Deletes are soft deletes (status change), not hard deletes
