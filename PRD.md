# acme-api Demo Repository PRD

## Purpose

This is a demo repository for showcasing Aether, an autonomous bug-fixing agent. The repo needs to look like a realistic internal API service while containing a specific bug that Aether will fix during the demo.

## Requirements

### The Bug (DO NOT FIX)

There is an intentional bug in `src/routes/users.js`. The `GET /api/users/:id` and `GET /api/users/:id/profile` endpoints do not check if the user exists before accessing properties. This causes a TypeError when requesting a non-existent user ID.

**DO NOT FIX THIS BUG.** It is intentional for the demo.

### Tech Stack

- Node.js 20+
- Express.js
- Sentry for error tracking (already configured in index.js)
- Node's built-in test runner (`node --test`)
- No database - use the in-memory fake db in `src/db.js`

### Current Structure

```
acme-api/
├── README.md
├── package.json
└── src/
    ├── index.js          # Express app entry point
    ├── db.js             # Fake in-memory database
    └── routes/
        ├── users.js      # User routes (HAS THE BUG)
        ├── users.test.js # User route tests
        └── teams.js      # Team routes (clean)
```

### What to Add

#### 1. More Realistic Database Records

Expand `src/db.js` to have:
- 8-10 users with realistic names and emails
- 3-4 teams with realistic names (Engineering, Product, Design, etc.)
- Add `createdAt` and `updatedAt` timestamps to records
- Add a `status` field to users (active, inactive, pending)

#### 2. Additional Routes

Add these endpoints to make the API look more complete:

**Users (`src/routes/users.js`):**
- `POST /api/users` - Create user (validate email format)
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete (set status to inactive)

**Teams (`src/routes/teams.js`):**
- `POST /api/teams` - Create team
- `POST /api/teams/:id/members` - Add member to team
- `DELETE /api/teams/:id/members/:userId` - Remove member from team

**New: Auth routes (`src/routes/auth.js`):**
- `POST /api/auth/login` - Fake login (just validate email exists, return user)
- `POST /api/auth/logout` - Fake logout (return success)

#### 3. Middleware

Create `src/middleware/` folder with:

**`validate.js`:**
- `validateEmail(req, res, next)` - Check if email field is valid format
- `validateRequired(fields)` - Factory function that returns middleware to check required fields

**`logger.js`:**
- Simple request logger that logs method, path, and timestamp

#### 4. Tests

Expand test coverage. Create test files alongside route files:

**`src/routes/users.test.js`** (expand existing):
- Test all user endpoints
- Test validation errors
- Test 404 responses for missing users (this test should document the bug exists)

**`src/routes/teams.test.js`:**
- Test all team endpoints
- Test adding/removing members

**`src/routes/auth.test.js`:**
- Test login with valid user
- Test login with invalid user

Target: 15-20 tests total, all should pass.

#### 5. Config

Create `src/config.js`:
```javascript
module.exports = {
  port: process.env.PORT || 3000,
  sentryDsn: process.env.SENTRY_DSN,
  env: process.env.NODE_ENV || 'development'
};
```

Update `src/index.js` to use config.

#### 6. Error Handling

Create `src/utils/errors.js`:
- `NotFoundError` class
- `ValidationError` class
- Export helper function `asyncHandler(fn)` that wraps async route handlers

#### 7. Update package.json

Add scripts:
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "test": "node --test src/**/*.test.js",
    "test:watch": "node --test --watch src/**/*.test.js"
  }
}
```

#### 8. Add .gitignore

```
node_modules/
.env
.DS_Store
*.log
```

#### 9. Add .env.example

```
PORT=3000
SENTRY_DSN=your-sentry-dsn-here
NODE_ENV=development
```

### Final Structure

```
acme-api/
├── .gitignore
├── .env.example
├── README.md
├── package.json
└── src/
    ├── index.js
    ├── config.js
    ├── db.js
    ├── middleware/
    │   ├── logger.js
    │   └── validate.js
    ├── routes/
    │   ├── auth.js
    │   ├── auth.test.js
    │   ├── teams.js
    │   ├── teams.test.js
    │   ├── users.js        # KEEP THE BUG
    │   └── users.test.js
    └── utils/
        └── errors.js
```

### Code Style

- Use async/await everywhere
- Use early returns for error cases
- Keep functions small and focused
- Use descriptive variable names
- Add brief JSDoc comments on exported functions
- No semicolons (match existing style... wait, existing has semicolons, keep semicolons)
- 2-space indentation

### What NOT to Do

1. **DO NOT fix the null check bug in users.js** - This is intentional
2. Do not add authentication middleware - keep it simple
3. Do not add a real database - the fake db is fine
4. Do not add TypeScript - keep it plain JavaScript
5. Do not add excessive dependencies - keep package.json minimal
6. Do not add Docker - not needed for demo

### Verification

When complete:
1. `npm install` should work
2. `npm test` should pass all tests (15-20 tests)
3. `npm run dev` should start the server
4. `curl http://localhost:3000/health` should return `{"status":"ok"}`
5. `curl http://localhost:3000/api/users/1` should return a user
6. `curl http://localhost:3000/api/users/999` should CRASH (this is the bug)

### Timeline

This should take about 30-45 minutes to implement. Keep it simple and realistic - this is a demo repo, not a production system.