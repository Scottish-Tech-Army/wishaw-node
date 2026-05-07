# Wishaw frontend Copilot instructions

## Build, run, and test

- Install dependencies with `npm install`.
- Start the app with `npm start` (`bin/www` defaults to port `4000` unless `PORT` is set).
- For live backend integration, run with `USE_MOCK=false`, `API_BASE_URL=http://localhost:8080`, and a non-default `SESSION_SECRET`.
- There is currently no `npm test` or `npm run lint` script in `package.json`, so verification is manual smoke testing.
- The companion backend repo is `51a7db-tfg_hack_wishaw-java`; start that repo first when running this frontend in live mode.

## High-level architecture

- This repo is a server-rendered Express + EJS application, not a SPA.
- `app.js` wires the request pipeline as: logging/parsing -> `express-session` -> global CSRF middleware -> locals injection (`currentUser`, `useMock`) -> route modules -> shared error handler.
- Authentication is two-layered in live mode: `req.session.user` stores the frontend user context, and `req.session.backendCookie` stores the backend `JSESSIONID`. `authService` and `utils/apiClient.js` are responsible for creating, refreshing, and forwarding that backend cookie.
- Route modules stay thin and render EJS views. Service modules are where backend contract mapping happens, branching on `config/apiConfig.js` (`USE_MOCK`) between in-memory mock behavior and live backend calls.
- The CSV import flow is multi-step and server-rendered: `/import` upload -> backend preview -> unresolved-player mapping -> commit. Multipart upload must go through `apiClient.postMultipart(...)`.
- Some features remain intentionally mock-only (`/parents`, `/challenges`, `/schedule`), while others are live-capable and should stay aligned with the Spring Boot backend (`/modules`, `/leaderboard`, `/import`, `/profile`, `/progress`, and login/session flows).

## Key conventions

- Keep backend DTO field names intact in services and views. Do not invent alternate field names unless the service explicitly maps them once.
- `utils/apiClient.js` is the only place that should capture/store backend cookies or assemble multipart backend requests. Do not duplicate JSESSIONID handling in routes or services.
- Every unsafe form post should include the shared `views/partials/csrf.ejs` partial. `middleware/csrf.js` accepts the token from form body, query string, or `x-csrf-token`, and login rotates the token after session regeneration.
- `middleware/auth.js` is the source of truth for protected pages. In live mode it revalidates the backend session and clears stale `user`/`backendCookie` state on logout or expired sessions.
- Keep `views/partials/nav.ejs` in sync with `middleware/roleCheck.js` and the route modules. In this repo, navigation visibility and actual route permissions are easy to drift apart if only one side is changed.
- Preserve the existing split of responsibilities: routes own `req`/`res` and rendering, services own backend interaction and mock/live branching, and `app.js` owns shared error-page rendering via `next(err)`.
