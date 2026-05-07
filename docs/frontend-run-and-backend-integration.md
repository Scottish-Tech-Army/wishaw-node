# Frontend Runbook and Backend Integration Guide

## 1. What was verified

The frontend was started successfully from this repository and verified live.

- Start command: `npm start`
- Effective script: `node ./bin/www`
- Default frontend port: `4000` (from `bin/www`)
- Verified endpoint: `GET /login` returns `200`
- Smoke-tested role flows: admin, player, parent routes all returned expected statuses

## 2. Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm 9+
- Spring Boot backend available (for non-mock mode)

## 3. Install and run frontend

From project root:

```bash
npm install
npm start
```

Frontend base URL:

- `http://localhost:4000`

Login page:

- `http://localhost:4000/login`

## 4. Environment variables

The app uses `config/apiConfig.js` and `bin/www`.

### Required / important

- `PORT`
  - Default: `4000`
  - Controls frontend Express listen port
- `USE_MOCK`
  - Default behavior: mock mode is ON unless explicitly set to `false`
  - Real backend mode: set `USE_MOCK=false`
- `API_BASE_URL`
  - Default: `http://localhost:8080`
  - Backend base host and port (API path `/api/v1` is appended automatically)
- `SESSION_SECRET`
  - Default dev fallback exists, but must be overridden in production
- `NODE_ENV`
  - Use `production` in deployed environments

### Example (.env)

```env
PORT=4000
USE_MOCK=false
API_BASE_URL=http://localhost:8080
SESSION_SECRET=replace-with-strong-secret
NODE_ENV=development
```

## 5. Run modes

### A) Mock mode (frontend only)

Use this when backend is unavailable.

```bash
# USE_MOCK defaults to true, so this is enough
npm start
```

### B) Integrated mode (frontend + backend)

```bash
# Bash
USE_MOCK=false API_BASE_URL=http://localhost:8080 PORT=4000 npm start
```

```powershell
# PowerShell
$env:USE_MOCK='false'
$env:API_BASE_URL='http://localhost:8080'
$env:PORT='4000'
npm start
```

## 6. Backend contract used by frontend

All backend calls are routed through `utils/apiClient.js` and prefixed as:

- `${API_BASE_URL}/api/v1/*`

### Auth headers forwarded to backend

On authenticated requests, frontend sends:

- `X-User-Id: <session user id>`
- `X-User-Role: <session user role>`

If backend authorization expects different header names, update `utils/apiClient.js`.

### Endpoints expected by frontend services

#### Auth

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /users?role=PARENT`

#### Centres

- `GET /centres`
- `GET /centres/:id`
- `POST /centres`
- `PUT /centres/:id`
- `DELETE /centres/:id`

#### Groups

- `GET /groups`
- `GET /groups?centreId=:id`
- `GET /groups/:id`
- `POST /groups`
- `PUT /groups/:id`
- `DELETE /groups/:id`

#### Players

- `GET /players`
- `GET /players/:id`
- `POST /players`
- `PUT /players/:id`
- `PATCH /players/:id/toggle-active`
- `DELETE /players/:id`

#### Modules

- `GET /modules`
- `GET /modules/:id`
- `POST /modules`
- `PUT /modules/:id`
- `DELETE /modules/:id`

#### Challenges

- `GET /challenges`
- `GET /challenges?moduleId=:id`
- `GET /challenges/:id`
- `POST /challenges`
- `PUT /challenges/:id`
- `DELETE /challenges/:id`

#### Schedule

- `GET /schedule`
- `GET /schedule?centreId=:id`
- `GET /schedule/:id`
- `POST /schedule`
- `PUT /schedule/:id`
- `DELETE /schedule/:id`

#### Progress

- `GET /progress/:playerId`
- `POST /progress/award`

#### Parent links

- `GET /parent-links`
- `GET /parent-links?parentId=:id`
- `POST /parent-links`
- `DELETE /parent-links/:id`

#### Leaderboard

- `GET /leaderboard?scope=global`
- `GET /leaderboard?scope=centre&scopeId=:id`
- `GET /leaderboard?scope=group&scopeId=:id`

## 7. Session and auth behavior

- Frontend auth is session-based (`express-session`).
- After successful login, user object is stored in `req.session.user`.
- UI route access is enforced with:
  - `isAuthenticated`
  - `requireRole(...)`
- On logout, frontend destroys session and redirects to `/login`.

## 8. Integration smoke test checklist

After both apps are running:

1. Open `/login` and authenticate as admin.
2. Verify these pages load: `/admin/dashboard`, `/centres`, `/groups`, `/players`, `/modules`, `/challenges`, `/schedule`, `/progress`, `/leaderboard`, `/parents`, `/import`.
3. Login as `PLAYER` and verify `/profile/me`.
4. Login as `PARENT` and verify `/parent/dashboard` and linked child page.
5. Verify unauthorized parent child access returns `403`.

## 9. Troubleshooting

### `npm run start` fails but `npm start` works

- This project defines only `start` script.
- Use:

```bash
npm start
```

### Port conflict (`EADDRINUSE`)

- Change frontend port:

```bash
PORT=4001 npm start
```

### Backend not reachable in integrated mode

- Confirm backend is running on `API_BASE_URL`.
- Confirm frontend has `USE_MOCK=false`.
- Check backend supports `/api/v1` base path.

### Unauthorized/forbidden from backend

- Confirm backend accepts forwarded headers:
  - `X-User-Id`
  - `X-User-Role`
- Confirm role names match exactly:
  - `SUPER_ADMIN`, `CENTRE_ADMIN`, `PLAYER`, `PARENT`

### 500 errors due to response shape mismatch

- Frontend expects DTO field names as implemented in services and views.
- Ensure backend JSON field names match existing contract.

## 10. Recommended deployment defaults

- `USE_MOCK=false`
- Strong `SESSION_SECRET`
- `NODE_ENV=production`
- Reverse proxy / TLS termination in front of Node app
- Backend and frontend base URLs configured explicitly per environment
