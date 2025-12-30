# Pastebin Lite

A simple, secure pastebin application built with Next.js and Redis.

## Features
- Create text pastes with optional expiry (TTL).
- Set maximum view limits (burn after reading).
- "Premium" clean UI.
- API-first design.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: JavaScript
- **Persistence**: Redis (via `ioredis`)
- **Styling**: CSS Modules (Vanilla CSS variables)

## Persistence Choice
I chose **Redis** for the persistence layer because:
1. **TTL Support**: Redis has native support for key expiration (`EXPIRE`), which maps perfectly to the "Time-based expiry" requirement.
2. **Performance**: In-memory speeds for fast read/write of pastes.
3. **Atomic Counters**: `INCR` operations make handling "Max Views" concurrency simple and robust.
4. **Simplicity**: Key-Value storage is ideal for mapping IDs to paste content.

## Setup & Run Locally

1. **Prerequisites**:
   - Node.js (v18+)
   - Redis server running locally (default: `localhost:6379`) or a `REDIS_URL` environment variable.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open Browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## API Endpoints

- **GET /api/healthz**: Health check.
- **POST /api/pastes**: Create a paste.
  - Body: `{ "content": "...", "ttl_seconds": 60, "max_views": 5 }`
- **GET /api/pastes/:id**: Fetch paste JSON.

## Testing
- The application supports deterministic time testing via `TEST_MODE=1` and `x-test-now-ms` header.
