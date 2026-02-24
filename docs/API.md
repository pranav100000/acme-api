# API Reference

Base URL: `http://localhost:3000`

All API endpoints return JSON responses. Request bodies should be sent as `Content-Type: application/json`.

---

## Table of Contents

- [Health](#health)
- [Authentication](#authentication)
- [Users](#users)
- [Teams](#teams)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

---

## Health

### `GET /health`

Returns the API health status.

**Response:**

```json
{
  "status": "ok"
}
```

---

## Authentication

### `POST /api/auth/login`

Authenticate with a user email address. Returns the matching user record on success.

**Request body:**

| Field   | Type   | Required | Description                  |
|---------|--------|----------|------------------------------|
| `email` | string | Yes      | A valid email address        |

**Example request:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@acme.com"}'
```

**Success response (200):**

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

**Error responses:**

| Status | Condition                  | Body                                    |
|--------|----------------------------|-----------------------------------------|
| 400    | Invalid email format       | `{"error": "Invalid email format"}`     |
| 400    | Missing email field        | `{"error": "Missing required field: email"}` |
| 401    | Email not found in system  | `{"error": "Invalid credentials"}`      |

---

### `POST /api/auth/logout`

Log out the current user. This is a no-op endpoint (no server-side sessions).

**Example request:**

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

**Success response (200):**

```json
{
  "message": "Logout successful"
}
```

---

## Users

### `GET /api/users`

List all users in the system.

**Example request:**

```bash
curl http://localhost:3000/api/users
```

**Success response (200):**

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
  {
    "id": "2",
    "email": "bob@acme.com",
    "name": "Bob Smith",
    "role": "developer",
    "status": "active",
    "createdAt": "2024-01-16T09:30:00Z",
    "updatedAt": "2024-02-01T14:00:00Z"
  }
]
```

---

### `GET /api/users/:id`

Get a single user by their ID. Returns a subset of user fields.

**URL parameters:**

| Parameter | Type   | Description      |
|-----------|--------|------------------|
| `id`      | string | The user's ID    |

**Example request:**

```bash
curl http://localhost:3000/api/users/1
```

**Success response (200):**

```json
{
  "id": "1",
  "email": "alice@acme.com",
  "name": "Alice Chen",
  "role": "admin"
}
```

**Error responses:**

| Status | Condition       | Body                              |
|--------|-----------------|-----------------------------------|
| 404    | User not found  | `{"error": "User not found"}`     |

---

### `GET /api/users/:id/profile`

Get a user's display profile, including computed initials.

**URL parameters:**

| Parameter | Type   | Description      |
|-----------|--------|------------------|
| `id`      | string | The user's ID    |

**Example request:**

```bash
curl http://localhost:3000/api/users/1/profile
```

**Success response (200):**

```json
{
  "displayName": "Alice Chen",
  "email": "alice@acme.com",
  "initials": "AC"
}
```

**Error responses:**

| Status | Condition       | Body                              |
|--------|-----------------|-----------------------------------|
| 404    | User not found  | `{"error": "User not found"}`     |

---

### `POST /api/users`

Create a new user. The user is assigned `status: "active"` by default.

**Request body:**

| Field  | Type   | Required | Description                                                |
|--------|--------|----------|------------------------------------------------------------|
| `email`| string | Yes      | A valid, unique email address                              |
| `name` | string | Yes      | The user's full name                                       |
| `role` | string | No       | User role (defaults to `"developer"`)                      |

**Example request:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@acme.com", "name": "Jane Doe", "role": "designer"}'
```

**Success response (201):**

```json
{
  "id": "9",
  "email": "jane@acme.com",
  "name": "Jane Doe",
  "role": "designer",
  "status": "active",
  "createdAt": "2024-04-01T12:00:00.000Z",
  "updatedAt": "2024-04-01T12:00:00.000Z"
}
```

**Error responses:**

| Status | Condition              | Body                                         |
|--------|------------------------|----------------------------------------------|
| 400    | Missing required field | `{"error": "Missing required field: email"}`  |
| 400    | Invalid email format   | `{"error": "Invalid email format"}`           |
| 409    | Email already exists   | `{"error": "Email already exists"}`           |

---

### `PATCH /api/users/:id`

Update an existing user. Only the provided fields are updated; omitted fields remain unchanged.

**URL parameters:**

| Parameter | Type   | Description      |
|-----------|--------|------------------|
| `id`      | string | The user's ID    |

**Request body (all fields optional):**

| Field    | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| `email`  | string | New email address                                |
| `name`   | string | New display name                                 |
| `role`   | string | New role (`admin`, `developer`, `designer`, `product_manager`) |
| `status` | string | New status (`active`, `inactive`, `pending`)     |

**Example request:**

```bash
curl -X PATCH http://localhost:3000/api/users/2 \
  -H "Content-Type: application/json" \
  -d '{"name": "Robert Smith", "role": "admin"}'
```

**Success response (200):**

```json
{
  "id": "2",
  "email": "bob@acme.com",
  "name": "Robert Smith",
  "role": "admin",
  "status": "active",
  "createdAt": "2024-01-16T09:30:00Z",
  "updatedAt": "2024-04-01T12:00:00.000Z"
}
```

**Error responses:**

| Status | Condition       | Body                              |
|--------|-----------------|-----------------------------------|
| 404    | User not found  | `{"error": "User not found"}`     |

---

### `DELETE /api/users/:id`

Soft-delete a user by setting their status to `"inactive"`. The user record is not removed from the database.

**URL parameters:**

| Parameter | Type   | Description      |
|-----------|--------|------------------|
| `id`      | string | The user's ID    |

**Example request:**

```bash
curl -X DELETE http://localhost:3000/api/users/3
```

**Success response (200):**

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
    "updatedAt": "2024-04-01T12:00:00.000Z"
  }
}
```

**Error responses:**

| Status | Condition       | Body                              |
|--------|-----------------|-----------------------------------|
| 404    | User not found  | `{"error": "User not found"}`     |

---

## Teams

### `GET /api/teams`

List all teams.

**Example request:**

```bash
curl http://localhost:3000/api/teams
```

**Success response (200):**

```json
[
  {
    "id": "1",
    "name": "Engineering",
    "members": ["1", "2", "3", "5"],
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-02-05T13:00:00Z"
  },
  {
    "id": "2",
    "name": "Product",
    "members": ["6"],
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-02-10T08:30:00Z"
  }
]
```

---

### `GET /api/teams/:id`

Get a single team by ID.

**URL parameters:**

| Parameter | Type   | Description      |
|-----------|--------|------------------|
| `id`      | string | The team's ID    |

**Example request:**

```bash
curl http://localhost:3000/api/teams/1
```

**Success response (200):**

```json
{
  "id": "1",
  "name": "Engineering",
  "members": ["1", "2", "3", "5"],
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-02-05T13:00:00Z"
}
```

**Error responses:**

| Status | Condition       | Body                              |
|--------|-----------------|-----------------------------------|
| 404    | Team not found  | `{"error": "Team not found"}`     |

---

### `GET /api/teams/:id/members`

Get the full user records for all members of a team.

**URL parameters:**

| Parameter | Type   | Description      |
|-----------|--------|------------------|
| `id`      | string | The team's ID    |

**Example request:**

```bash
curl http://localhost:3000/api/teams/1/members
```

**Success response (200):**

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
  {
    "id": "2",
    "email": "bob@acme.com",
    "name": "Bob Smith",
    "role": "developer",
    "status": "active",
    "createdAt": "2024-01-16T09:30:00Z",
    "updatedAt": "2024-02-01T14:00:00Z"
  }
]
```

**Error responses:**

| Status | Condition       | Body                              |
|--------|-----------------|-----------------------------------|
| 404    | Team not found  | `{"error": "Team not found"}`     |

---

### `POST /api/teams`

Create a new team. New teams start with an empty members list.

**Request body:**

| Field  | Type   | Required | Description       |
|--------|--------|----------|-------------------|
| `name` | string | Yes      | The team's name   |

**Example request:**

```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{"name": "Marketing"}'
```

**Success response (201):**

```json
{
  "id": "5",
  "name": "Marketing",
  "members": [],
  "createdAt": "2024-04-01T12:00:00.000Z",
  "updatedAt": "2024-04-01T12:00:00.000Z"
}
```

**Error responses:**

| Status | Condition              | Body                                        |
|--------|------------------------|---------------------------------------------|
| 400    | Missing required field | `{"error": "Missing required field: name"}`  |

---

### `POST /api/teams/:id/members`

Add a user to a team. If the user is already a member, the request succeeds without duplicating them.

**URL parameters:**

| Parameter | Type   | Description      |
|-----------|--------|------------------|
| `id`      | string | The team's ID    |

**Request body:**

| Field    | Type   | Required | Description                    |
|----------|--------|----------|--------------------------------|
| `userId` | string | Yes      | The ID of the user to add      |

**Example request:**

```bash
curl -X POST http://localhost:3000/api/teams/3/members \
  -H "Content-Type: application/json" \
  -d '{"userId": "5"}'
```

**Success response (200):**

```json
{
  "id": "3",
  "name": "Design",
  "members": ["4", "5"],
  "createdAt": "2024-01-20T11:00:00Z",
  "updatedAt": "2024-04-01T12:00:00.000Z"
}
```

**Error responses:**

| Status | Condition                | Body                                          |
|--------|--------------------------|-----------------------------------------------|
| 400    | Missing userId field     | `{"error": "Missing required field: userId"}`  |
| 404    | Team or user not found   | `{"error": "Team or user not found"}`          |

---

### `DELETE /api/teams/:id/members/:userId`

Remove a user from a team.

**URL parameters:**

| Parameter | Type   | Description                     |
|-----------|--------|---------------------------------|
| `id`      | string | The team's ID                   |
| `userId`  | string | The ID of the user to remove    |

**Example request:**

```bash
curl -X DELETE http://localhost:3000/api/teams/1/members/2
```

**Success response (200):**

```json
{
  "id": "1",
  "name": "Engineering",
  "members": ["1", "3", "5"],
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-04-01T12:00:00.000Z"
}
```

**Error responses:**

| Status | Condition       | Body                              |
|--------|-----------------|-----------------------------------|
| 404    | Team not found  | `{"error": "Team not found"}`     |

---

## Error Handling

All error responses follow a consistent format:

```json
{
  "error": "Description of what went wrong"
}
```

### Common HTTP Status Codes

| Status | Meaning                | Description                                          |
|--------|------------------------|------------------------------------------------------|
| 200    | OK                     | Request succeeded                                    |
| 201    | Created                | Resource successfully created                        |
| 400    | Bad Request            | Invalid input (missing fields, bad email format)     |
| 401    | Unauthorized           | Authentication failed                                |
| 404    | Not Found              | Requested resource does not exist                    |
| 409    | Conflict               | Resource already exists (e.g., duplicate email)      |
| 500    | Internal Server Error  | Unexpected server error                              |

---

## Data Models

### User

| Field       | Type   | Description                                              |
|-------------|--------|----------------------------------------------------------|
| `id`        | string | Unique identifier (auto-generated)                       |
| `email`     | string | User's email address (unique)                            |
| `name`      | string | User's full display name                                 |
| `role`      | string | One of: `admin`, `developer`, `designer`, `product_manager` |
| `status`    | string | One of: `active`, `inactive`, `pending`                  |
| `createdAt` | string | ISO 8601 timestamp of when the user was created          |
| `updatedAt` | string | ISO 8601 timestamp of the last update                    |

### Team

| Field       | Type     | Description                                       |
|-------------|----------|---------------------------------------------------|
| `id`        | string   | Unique identifier (auto-generated)                |
| `name`      | string   | Team name                                         |
| `members`   | string[] | Array of user IDs belonging to this team          |
| `createdAt` | string   | ISO 8601 timestamp of when the team was created   |
| `updatedAt` | string   | ISO 8601 timestamp of the last update             |

### Seed Data

The API ships with the following pre-loaded data:

**Users:**

| ID | Name            | Email              | Role             | Status   |
|----|-----------------|--------------------|--------------------|----------|
| 1  | Alice Chen      | alice@acme.com     | admin              | active   |
| 2  | Bob Smith       | bob@acme.com       | developer          | active   |
| 3  | Carol Jones     | carol@acme.com     | developer          | active   |
| 4  | David Park      | david@acme.com     | designer           | active   |
| 5  | Eve Martinez    | eve@acme.com       | developer          | active   |
| 6  | Frank Wilson    | frank@acme.com     | product_manager    | active   |
| 7  | Grace Lee       | grace@acme.com     | developer          | inactive |
| 8  | Henry Taylor    | henry@acme.com     | developer          | pending  |

**Teams:**

| ID | Name            | Members                          |
|----|-----------------|----------------------------------|
| 1  | Engineering     | Alice, Bob, Carol, Eve           |
| 2  | Product         | Frank                            |
| 3  | Design          | David                            |
| 4  | Infrastructure  | Alice, Bob                       |
