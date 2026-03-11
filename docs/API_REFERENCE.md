# API Reference

This document describes the available backend endpoints and includes example requests/responses.

Base URL (local): `http://localhost:3000`

## Conventions

- JSON requests/responses
- Error format:

```json
{ "error": "Message here" }
```

---

## Health

### `GET /health`

Check service health.

**Response 200**

```json
{ "status": "ok" }
```

---

## Auth

### `POST /api/auth/login`

Fake login using an existing user email.

**Request body**

```json
{ "email": "alice@acme.com" }
```

**Success 200**

```json
{
  "message": "Login successful",
  "user": {
    "id": "1",
    "email": "alice@acme.com",
    "name": "Alice Chen",
    "role": "admin",
    "status": "active",
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-15T08:00:00Z"
  }
}
```

**Error 400** (invalid email format)

```json
{ "error": "Invalid email format" }
```

**Error 401** (email not found)

```json
{ "error": "Invalid credentials" }
```

### `POST /api/auth/logout`

Fake logout endpoint.

**Response 200**

```json
{ "message": "Logout successful" }
```

---

## Users

### `GET /api/users`

List all users.

**Response 200**

```json
[
  {
    "id": "1",
    "email": "alice@acme.com",
    "name": "Alice Chen",
    "role": "admin",
    "status": "active",
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-15T08:00:00Z"
  }
]
```

### `GET /api/users/:id`

Get a single user.

**Response 200**

```json
{
  "id": "1",
  "email": "alice@acme.com",
  "name": "Alice Chen",
  "role": "admin"
}
```

**Error 404**

```json
{ "error": "User not found" }
```

### `GET /api/users/:id/profile`

Get condensed profile info.

**Response 200**

```json
{
  "displayName": "Alice Chen",
  "email": "alice@acme.com",
  "initials": "AC"
}
```

### `POST /api/users`

Create a user.

**Request body**

```json
{
  "email": "new.user@acme.com",
  "name": "New User",
  "role": "developer"
}
```

**Success 201**

Returns created user with generated `id`, `status`, and timestamps.

**Error 400**

```json
{ "error": "Missing required field: email" }
```

or

```json
{ "error": "Invalid email format" }
```

**Error 409**

```json
{ "error": "Email already exists" }
```

### `PATCH /api/users/:id`

Update one or more user fields (`email`, `name`, `role`, `status`).

**Request body**

```json
{ "status": "inactive" }
```

**Response 200**

Returns updated user.

### `DELETE /api/users/:id`

Soft-deletes a user by setting `status` to `inactive`.

**Response 200**

```json
{
  "message": "User deactivated",
  "user": {
    "id": "1",
    "email": "alice@acme.com",
    "name": "Alice Chen",
    "role": "admin",
    "status": "inactive",
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-03-15T16:00:00Z"
  }
}
```

---

## Teams

### `GET /api/teams`

List all teams.

**Response 200**

```json
[
  {
    "id": "1",
    "name": "Engineering",
    "members": ["1", "2", "3", "5"],
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-02-05T13:00:00Z"
  }
]
```

### `GET /api/teams/:id`

Get one team by ID.

**Response 200**

```json
{
  "id": "1",
  "name": "Engineering",
  "members": ["1", "2", "3", "5"],
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-02-05T13:00:00Z"
}
```

**Error 404**

```json
{ "error": "Team not found" }
```

### `GET /api/teams/:id/members`

Get team members.

**Response 200**

```json
[
  {
    "id": "1",
    "email": "alice@acme.com",
    "name": "Alice Chen",
    "role": "admin",
    "status": "active",
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-15T08:00:00Z"
  }
]
```

### `POST /api/teams`

Create a team.

**Request body**

```json
{ "name": "QA" }
```

**Error 400**

```json
{ "error": "Missing required field: name" }
```

### `POST /api/teams/:id/members`

Add a user to a team.

**Request body**

```json
{ "userId": "3" }
```

**Error 404**

```json
{ "error": "Team or user not found" }
```

### `DELETE /api/teams/:id/members/:userId`

Remove a user from a team.

**Error 404**

```json
{ "error": "Team not found" }
```

---

## Quick cURL examples

```bash
# Health
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@acme.com"}'

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"new.user@acme.com","name":"New User"}'

# Create team
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{"name":"QA"}'
```
