# URL Shortener Service

A REST API for shortening long URLs, resolving short codes, tracking click counts, and managing created links.

## Features

- Create a new shortened URL via POST /api/urls
- List all shortened URLs via GET /api/urls
- Retrieve metadata for a short code via GET /api/urls/:shortCode
- Delete a short code via DELETE /api/urls/:shortCode
- Resolve a short code via GET /:shortCode and increment the click count

## Architecture

The service uses a simple layered structure:

- Express route handlers for HTTP concerns
- In-memory storage using a Map for persistence during the process lifetime
- Basic validation and collision handling in the route module

## Short code generation and collision strategy

Short codes are generated as 6-character hex strings using Node's crypto module. If a collision happens, a new code is generated until the key is unique.

For very large scale systems, a centralized unique ID generator such as Snowflake, ULID, or a database-backed sequence would be more suitable than random collision retries.

## Duplicate URL decision

Submitting the same original URL twice creates a new independent entry with a different short code. This keeps the API simple and avoids ambiguous identity when the same destination is shared by multiple links.

## Design notes for production scale

### 1. Short-code generation and collision handling

The current implementation uses a 6-character random hexadecimal short code generated with Node's crypto module. That is simple and fast, but it becomes less efficient at very large scale because collisions must be retried until a unique code is found.

For a system that may need to handle billions of URLs, I would change the approach to use a database-backed or sequence-based ID generator and then encode that ID into a shorter base62 value. A typical pattern in JavaScript/Node would be:

- generate a numeric ID from a database sequence, Snowflake-style ID, or ULID
- encode it as base62 to produce a compact short code
- enforce uniqueness in the database layer before persisting the mapping

This is more scalable because it avoids collision-heavy random generation and gives a predictable, ordered identifier strategy.

### 2. Switching from H2 to PostgreSQL without changing business logic

In a JavaScript/Node service, the same idea applies: the business logic stays the same, and only the persistence layer configuration changes. If the app were moved from an in-memory store or an H2-backed setup to PostgreSQL, I would:

- install the PostgreSQL client library such as pg
- create a connection pool configuration for PostgreSQL
- replace the repository implementation so it uses SQL queries instead of the current in-memory structure
- keep the controller and service layers unchanged

Example Node/Express configuration idea:

```js
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "urlshortener",
});
```

The business logic would remain intact because the service layer would still accept the same input and return the same response shape.

### 3. Caching the resolve endpoint for hot traffic

The GET /{shortCode} endpoint is often the hottest path because it is called frequently after a short URL is shared. In a Node/Express service, I would reduce database hits by caching successful lookups in memory or with a dedicated cache such as Redis.

Example approach with an in-memory cache:

```js
const cache = new Map();

function getCachedMapping(shortCode) {
  return cache.get(shortCode);
}

function setCachedMapping(shortCode, mapping) {
  cache.set(shortCode, mapping);
}
```

For correctness, I would also invalidate or refresh the cache when a short URL is created, deleted, or updated. A reasonable strategy would be:

- cache successful lookups for a short TTL
- store only the resolved target URL and metadata needed by the endpoint
- clear the cache entry on create/delete/update operations

This keeps the hot path fast without changing the external API behavior.

## AI-assisted development notes

### 1. AI tools used

- GitHub Copilot for scaffolding the Express app, generating route/controller code, and drafting tests
- GitHub Copilot Chat for debugging route issues and refining API behavior

### 2. Example prompts used

- "Create a Node.js Express URL shortener API with CRUD-like endpoints and tests"
- "Add Jest and supertest tests for invalid URL and click counting behavior"
- "Help me fix the route not found response for /api/urls"
- "Document the API endpoints and response shape in the README"

### 3. Where AI helped most

- Generating the initial project structure and route skeleton
- Drafting controller and service logic for creating, listing, fetching, and deleting short URLs
- Suggesting test cases for validation, 404 handling, and click-count behavior

### 4. What was manually corrected or implemented

- Wired the route modules into a working server entry point
- Adjusted the response contract to match the assignment requirements
- Added the in-memory persistence behavior for short URLs
- Implemented the root health endpoint and route handling for browser requests
- Moved the test files to the top-level tests directory

### 5. How correctness was validated

- Ran the Jest suite with npm test to verify endpoint behavior
- Verified the API returns the expected status codes and JSON payloads for success and error cases
- Tested the main flows manually for creating, resolving, listing, and deleting short URLs

## Running locally

```bash
npm install
npm start
```

## Testing

```bash
npm test
```
