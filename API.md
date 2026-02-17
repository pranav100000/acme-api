# Acme Corp API Reference

> Base URL: `http://localhost:3000`

All endpoints return JSON. Request bodies must be sent as `Content-Type: application/json`.

---

## Health

### `GET /health`

Returns the current API status.

**Response** `200 OK`

```json
{
  "status": "ok"
}
```

---

## Authentication

Simplified email-only authentication — no passwords. The client is responsible for
persisting the returned user object (e.g. in `localStorage`).

### `POST /api/auth/login`

Authenticate by providing a registered email address.

**Request body**

| Field   | Type   | Required | Description              |
|---------|--------|----------|--------------------------|
| `email` | string | ✓        | Email of an existing user |

**Example request**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@acme.com"}'
```

**Response** `200 OK`

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

**Errors**

| Status | Body                              | Condition                  |
|--------|-----------------------------------|----------------------------|
| 400    | `{"error": "Missing required field: email"}` | `email` not provided |
| 400    | `{"error": "Invalid email format"}` | Malformed email address  |
| 401    | `{"error": "Invalid credentials"}` | No user with that email  |

---

### `POST /api/auth/logout`

Stateless logout — always succeeds. The client should clear its own session data.

**Example request**

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

**Response** `200 OK`

```json
{
  "message": "Logout successful"
}
```

---

## Users

### `GET /api/users`

List all users.

**Example request**

```bash
curl http://localhost:3000/api/users
```

**Response** `200 OK`

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
  },
  ...
]
```

---

### `GET /api/users/:id`

Get a single user by ID. Returns a subset of fields (no `status`, `createdAt`, or `updatedAt`).

**Example request**

```bash
curl http://localhost:3000/api/users/1
```

**Response** `200 OK`

```json
{
  "id": "1",
  "email": "alice@acme.com",
  "name": "Alice Chen",
  "role": "admin"
}
```

**Errors**

| Status | Body                            | Condition          |
|--------|---------------------------------|--------------------|
| 404    | `{"error": "User not found"}`   | No user with that ID |

---

### `GET /api/users/:id/profile`

Get a display-friendly profile for a user, including computed initials.

**Example request**

```bash
curl http://localhost:3000/api/users/1/profile
```

**Response** `200 OK`

```json
{
  "displayName": "Alice Chen",
  "email": "alice@acme.com",
  "initials": "AC"
}
```

**Errors**

| Status | Body                            | Condition          |
|--------|---------------------------------|--------------------|
| 404    | `{"error": "User not found"}`   | No user with that ID |

---

### `POST /api/users`

Create a new user. The `email` must be unique and validly formatted.

**Request body**

| Field  | Type   | Required | Description                                      |
|--------|--------|----------|--------------------------------------------------|
| `email`| string | ✓        | Must be a valid, unique email address             |
| `name` | string | ✓        | Full name                                         |
| `role` | string |          | One of `admin`, `developer`, `designer`, `product_manager`. Defaults to `developer` |

**Example request**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@acme.com", "name": "Jane Doe", "role": "designer"}'
```

**Response** `201 Created`

```json
{
  "id": "9",
  "email": "jane@acme.com",
  "name": "Jane Doe",
  "role": "designer",
  "status": "active",
  "createdAt": "2024-04-01T12:00:00Z",
  "updatedAt": "2024-04-01T12:00:00Z"
}
```

**Errors**

| Status | Body                                              | Condition                   |
|--------|---------------------------------------------------|-----------------------------|
| 400    | `{"error": "Missing required field: email"}`      | `email` not provided        |
| 400    | `{"error": "Missing required field: name"}`       | `name` not provided         |
| 400    | `{"error": "Invalid email format"}`               | Malformed email address     |
| 409    | `{"error": "Email already exists"}`               | Duplicate email             |

---

### `PATCH /api/users/:id`

Partially update a user. Only the following fields can be changed: `email`, `name`, `role`, `status`.

**Request body** — include only the fields you want to update.

| Field    | Type   | Description                               |
|----------|--------|-------------------------------------------|
| `email`  | string | New email address                         |
| `name`   | string | New full name                             |
| `role`   | string | New role                                  |
| `status` | string | One of `active`, `inactive`, `pending`    |

**Example request**

```bash
curl -X PATCH http://localhost:3000/api/users/2 \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

**Response** `200 OK`

```json
{
  "id": "2",
  "email": "bob@acme.com",
  "name": "Bob Smith",
  "role": "admin",
  "status": "active",
  "createdAt": "2024-01-16T09:30:00Z",
  "updatedAt": "2024-04-01T12:00:00Z"
}
```

**Errors**

| Status | Body                            | Condition          |
|--------|---------------------------------|--------------------|
| 404    | `{"error": "User not found"}`   | No user with that ID |

---

### `DELETE /api/users/:id`

Soft-delete a user by setting their status to `inactive`. The user record is **not** removed.

**Example request**

```bash
curl -X DELETE http://localhost:3000/api/users/3
```

**Response** `200 OK`

```json
{
  "message": "User deactivated",
  "user": {
    "id": "3",
    "email": "carol@acme.com",
    "name": "Carol Jones",
    "role": "developer",
    "status": "inactive",
    "createdAt": "2024-01-20T11:00:00Z",
    "updatedAt": "2024-04-01T12:00:00Z"
  }
}
```

**Errors**

| Status | Body                            | Condition          |
|--------|---------------------------------|--------------------|
| 404    | `{"error": "User not found"}`   | No user with that ID |

---

## Teams

### `GET /api/teams`

List all teams.

**Example request**

```bash
curl http://localhost:3000/api/teams
```

**Response** `200 OK`

```json
[
  {
    "id": "1",
    "name": "Engineering",
    "members": ["1", "2", "3", "5"],
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-02-05T13:00:00Z"
  },
  ...
]
```

---

### `GET /api/teams/:id`

Get a single team by ID.

**Example request**

```bash
curl http://localhost:3000/api/teams/1
```

**Response** `200 OK`

```json
{
  "id": "1",
  "name": "Engineering",
  "members": ["1", "2", "3", "5"],
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-02-05T13:00:00Z"
}
```

**Errors**

| Status | Body                            | Condition          |
|--------|---------------------------------|--------------------|
| 404    | `{"error": "Team not found"}`   | No team with that ID |

---

### `GET /api/teams/:id/members`

Get the resolved member list for a team. Returns full user objects (not just IDs).

**Example request**

```bash
curl http://localhost:3000/api/teams/1/members
```

**Response** `200 OK`

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
  },
  ...
]
```

**Errors**

| Status | Body                            | Condition          |
|--------|---------------------------------|--------------------|
| 404    | `{"error": "Team not found"}`   | No team with that ID |

---

### `POST /api/teams`

Create a new team with an empty member list.

**Request body**

| Field  | Type   | Required | Description   |
|--------|--------|----------|---------------|
| `name` | string | ✓        | Team name     |

**Example request**

```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{"name": "Marketing"}'
```

**Response** `201 Created`

```json
{
  "id": "5",
  "name": "Marketing",
  "members": [],
  "createdAt": "2024-04-01T12:00:00Z",
  "updatedAt": "2024-04-01T12:00:00Z"
}
```

**Errors**

| Status | Body                                          | Condition            |
|--------|-----------------------------------------------|----------------------|
| 400    | `{"error": "Missing required field: name"}`   | `name` not provided  |

---

### `POST /api/teams/:id/members`

Add a user to a team. If the user is already a member, the request succeeds silently (no duplicate added).

**Request body**

| Field    | Type   | Required | Description              |
|----------|--------|----------|--------------------------|
| `userId` | string | ✓        | ID of the user to add    |

**Example request**

```bash
curl -X POST http://localhost:3000/api/teams/2/members \
  -H "Content-Type: application/json" \
  -d '{"userId": "4"}'
```

**Response** `200 OK`

```json
{
  "id": "2",
  "name": "Product",
  "members": ["6", "4"],
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-04-01T12:00:00Z"
}
```

**Errors**

| Status | Body                                              | Condition                       |
|--------|---------------------------------------------------|---------------------------------|
| 400    | `{"error": "Missing required field: userId"}`     | `userId` not provided           |
| 404    | `{"error": "Team or user not found"}`             | Invalid team ID or user ID      |

---

### `DELETE /api/teams/:id/members/:userId`

Remove a user from a team.

**Example request**

```bash
curl -X DELETE http://localhost:3000/api/teams/1/members/3
```

**Response** `200 OK`

```json
{
  "id": "1",
  "name": "Engineering",
  "members": ["1", "2", "5"],
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-04-01T12:00:00Z"
}
```

**Errors**

| Status | Body                            | Condition          |
|--------|---------------------------------|--------------------|
| 404    | `{"error": "Team not found"}`   | No team with that ID |

---

## Data Models

### User

| Field       | Type   | Description                                          |
|-------------|--------|------------------------------------------------------|
| `id`        | string | Auto-incremented unique identifier                   |
| `email`     | string | Unique email address                                 |
| `name`      | string | Full name                                            |
| `role`      | string | `admin`, `developer`, `designer`, or `product_manager` |
| `status`    | string | `active`, `inactive`, or `pending`                   |
| `createdAt` | string | ISO 8601 timestamp                                   |
| `updatedAt` | string | ISO 8601 timestamp (updated on any change)           |

### Team

| Field       | Type     | Description                                |
|-------------|----------|--------------------------------------------|
| `id`        | string   | Auto-incremented unique identifier         |
| `name`      | string   | Team name                                  |
| `members`   | string[] | Array of user IDs belonging to the team    |
| `createdAt` | string   | ISO 8601 timestamp                         |
| `updatedAt` | string   | ISO 8601 timestamp (updated on any change) |

---

## Seed Data

The API ships with pre-loaded demo data (in-memory, resets on server restart).

### Users

| ID | Name           | Email              | Role             | Status   |
|----|----------------|--------------------|------------------|----------|
| 1  | Alice Chen     | alice@acme.com     | admin            | active   |
| 2  | Bob Smith      | bob@acme.com       | developer        | active   |
| 3  | Carol Jones    | carol@acme.com     | developer        | active   |
| 4  | David Park     | david@acme.com     | designer         | active   |
| 5  | Eve Martinez   | eve@acme.com       | developer        | active   |
| 6  | Frank Wilson   | frank@acme.com     | product_manager  | active   |
| 7  | Grace Lee      | grace@acme.com     | developer        | inactive |
| 8  | Henry Taylor   | henry@acme.com     | developer        | pending  |

### Teams

| ID | Name           | Members                 |
|----|----------------|-------------------------|
| 1  | Engineering    | Alice, Bob, Carol, Eve  |
| 2  | Product        | Frank                   |
| 3  | Design         | David                   |
| 4  | Infrastructure | Alice, Bob              |

---

## Error Format

All errors return a JSON object with a single `error` field:

```json
{
  "error": "Description of what went wrong"
}
```

Common HTTP status codes used:

| Status | Meaning               |
|--------|-----------------------|
| 200    | Success               |
| 201    | Created               |
| 400    | Bad request / validation error |
| 401    | Unauthorized          |
| 404    | Resource not found    |
| 409    | Conflict (e.g. duplicate email) |
| 500    | Internal server error |
