# Week 8 – Authenticated Tasks API

A NestJS REST API for task management using PostgreSQL, TypeORM, JWT authentication, bcrypt password hashing, DTO validation, and automated tests.

## Tech Stack

* NestJS
* TypeScript
* PostgreSQL
* TypeORM
* JWT
* Passport
* bcrypt
* class-validator
* Jest
* Supertest

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=week8-practice-db

JWT_SECRET=your_jwt_secret

PORT=3000
```

Run the application:

```bash
npm run start:dev
```

The API runs on:

```text
http://localhost:3000
```

The database schema is managed through TypeORM migrations. `synchronize` is disabled.

## Authentication

### Register

```http
POST /auth/register
```

Request:

```json
{
  "email": "test@gmail.com",
  "password": "Test12345"
}
```

The password is hashed with bcrypt and is never returned in the response.

### Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "test@gmail.com",
  "password": "Test12345"
}
```

Response:

```json
{
  "access_token": "JWT_TOKEN"
}
```

The JWT contains:

```json
{
  "sub": 1,
  "email": "test@gmail.com"
}
```

### Using the token

For protected routes, send the JWT in the `Authorization` header:

```http
Authorization: Bearer JWT_TOKEN
```

Task write operations and project write operations require authentication.

## Task Endpoints

### Create Task

```http
POST /tasks
```

Protected.

Example:

```json
{
  "title": "Complete Week 8",
  "description": "Finish authenticated tasks API",
  "status": "todo",
  "priority": 3,
  "projectId": 1,
  "assigneeId": 1,
  "tagIds": [1, 2]
}
```

Returns `201 Created` on success.

### List Tasks

```http
GET /tasks
```

Supports optional filters:

```text
GET /tasks?status=todo
GET /tasks?projectId=1
GET /tasks?assigneeId=1
```

Filters can be combined:

```text
GET /tasks?status=todo&projectId=1&assigneeId=1
```

### Get Task

```http
GET /tasks/:id
```

Returns the task with its project, assignee, and tags loaded.

Returns `404` if the task does not exist.

### Update Task

```http
PATCH /tasks/:id
```

Protected.

Only supplied fields are updated.

Returns `404` if the task does not exist.

### Delete Task

```http
DELETE /tasks/:id
```

Protected.

Returns:

```text
204 No Content
```

Returns `404` if the task does not exist.

## Project Endpoint

### Create Project

```http
POST /projects
```

Protected.

The authenticated user is used as the project owner.

## Validation

The API uses a global `ValidationPipe` with:

* `whitelist: true`
* `forbidNonWhitelisted: true`
* `transform: true`

Invalid request bodies return `400 Bad Request`.

Fields not declared by the DTO are rejected.

## Error Handling

A global exception filter provides a consistent error response containing:

```json
{
  "statusCode": 404,
  "message": "Task not found",
  "error": "Not Found",
  "timestamp": "2026-08-31T00:00:00.000Z",
  "path": "/tasks/999"
}
```

## CORS

CORS is enabled for the Next.js development origin.

## Testing

Run unit tests:

```bash
npm test
```

Run end-to-end authentication tests:

```bash
npm run test:e2e
```

Build the project:

```bash
npm run build
```

The project includes:

* Unit tests for services/controllers
* `TasksService.create` unit test with a mocked repository
* E2E test for successful login
* E2E test for incorrect password returning `401`
