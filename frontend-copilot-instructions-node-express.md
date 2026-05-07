# GitHub Copilot Instruction File - Frontend Module (Node + Express)

## Purpose
Build the frontend-facing application layer for a digital badging web application for Wishaw YMCA Esports Academy using **Node.js + Express** as the primary tech stack.
The application must be designed to integrate cleanly with a separate Spring Boot backend running independently.

This instruction file is aligned with the backend instruction document.
Follow the backend API contract and keep the implementation minimal and maintainable.

---

## Important Clarification
The primary tech stack for this module is now:
- **Node.js**
- **Express**
- server-rendered pages and/or lightweight template-based UI
- minimal client-side JavaScript where required

Do not build this module as a React SPA.
Keep all business variables, product scope, and integration expectations intact, but implement the UI layer using Node + Express.

---

## Non-Negotiable Constraints
1. Use **Node.js + Express**.
2. Keep external libraries to a minimum.
3. Prefer built-in Node.js features and simple Express patterns.
4. Do **not** assume React, Axios, Redux, React Query, Material UI, Tailwind, or other large frontend libraries are available.
5. Use built-in `fetch` in modern Node.js or a minimal server-side HTTP integration approach for backend API calls.
6. The Node + Express module and Spring Boot backend will run as **separate IntelliJ modules/windows**.
7. Keep backend API integration isolated so base URL changes are easy.
8. Build clean pages, reusable route handlers, and simple view templates without over-engineering.
9. Only include this stretch goal: **Parent read-only login**.

---

## Assumptions
- This module is a separate Node + Express application
- Spring Boot backend runs on a separate local port
- Backend API base path is `/api/v1`
- Backend returns JSON only
- This Node + Express module is responsible for rendering the user-facing screens and calling the backend APIs

---

## Product Scope for This Module

### Must Have Screens
1. Login page
2. Admin dashboard
3. Centres management
4. Groups management
5. Players management
6. Parent link management
7. Modules management
8. Challenges management
9. Schedule management
10. Progress award screen
11. Player profile page
12. My profile page
13. Leaderboard page
14. CSV import preview + commit page
15. Parent read-only area

### Out of Scope for Now
- evidence upload
- tournaments
- advanced animation
- advanced charts libraries
- offline sync complexity
- notification centre

---

## Node + Express Architecture Rules
Keep the application simple.
Use a clear structure like this:

```text
src/
  app.js
  server.js
  config/
  routes/
  controllers/
  services/
  middleware/
  views/
  public/
  utils/
  types/
```

Suggested view folders:

```text
views/
  auth/
  admin/
  players/
  modules/
  leaderboard/
  parent/
  import/
  partials/
```

Avoid unnecessary architectural patterns unless they clearly help.

---

## Integration Rules with Backend

### Backend API Base Configuration
Create a single config file such as:
- `src/config/apiConfig.js`

It should define:
- backend base URL
- common headers
- auth/session forwarding helpers where needed

Do not hardcode backend URLs throughout the app.

### HTTP Integration
Use a small wrapper around backend API calls.
Example responsibilities:
- base URL prefixing
- JSON parsing
- common error handling
- passing session/token data between Node + Express app and Spring Boot backend

Do not introduce a heavy HTTP abstraction.

### Backend Contract Discipline
The backend uses DTO-based JSON APIs.
This Node + Express module must:
- treat backend field names as contract-driven
- centralize request/response mapping in service files
- avoid reshaping response objects too much inside route handlers or views

---

## Rendering Approach Guidance
Use a lightweight server-side templating approach if needed, such as:
- EJS, or
- another minimal template engine already available in the environment

If no template engine is available yet, structure the code so views can be added cleanly.
Keep rendering simple and form-based.
Do not overbuild client-side interactivity in the first version.

---

## Pages to Build

### 1. Login Page
Supports login for:
- admin
- player
- parent

After login, route users based on role.

### 2. Admin Dashboard
Show quick navigation cards/links to:
- centres
- groups
- players
- modules
- leaderboards
- import wizard

Keep the first version simple.

### 3. Centres Screen
- list centres
- create centre
- edit centre

### 4. Groups Screen
- list groups
- create group
- edit group
- filter by centre

### 5. Players Screen
- list players
- create player
- edit player
- activate/deactivate player
- assign to group/centre
- show externalRef for import mapping

### 6. Parent Link Screen
- create/read parent-to-player links
- show which parent can view which player

### 7. Modules Screen
- list modules
- create/edit module
- view module details

### 8. Challenges Screen
- add/edit challenges inside a module
- show badge category, points, description, skills

### 9. Schedule Screen
- add/edit weekly schedule items for a module

### 10. Award Progress Screen
Admin selects:
- centre
- group
- module
- challenge
- one or more players
Then submits challenge awards.

### 11. Player Profile Page
Show:
- display name
- group / centre
- badge totals by category
- current badge levels
- enrolled modules
- completed modules
- recent challenge awards

### 12. My Profile Page
Same as player profile but for current logged-in player.

### 13. Leaderboard Page
Support views for:
- global leaderboard
- centre leaderboard
- group leaderboard

### 14. CSV Import Wizard
Use a multi-step UI:
1. upload CSV
2. preview parsed data
3. map CSV players to app users
4. review validation messages
5. commit import
6. show import summary

### 15. Parent Read-Only Area
Parent can:
- see linked players
- open player progress
- not edit anything

---

## Role-Based Routing Rules
Implement simple role checks.

### Roles
- SUPER_ADMIN
- CENTRE_ADMIN
- PLAYER
- PARENT

### Routing Expectations
- admin roles -> admin area
- player -> self profile area
- parent -> parent area

If role is missing or unauthorized:
- redirect to login or unauthorized page

---

## Session and Auth Handling Guidance
Keep the auth implementation simple and aligned with backend.
Depending on backend approach:
- session/cookie based, or
- simple token returned by login

This Node + Express app must isolate auth handling in one place.
Create:
- auth middleware
- login/logout handlers
- current user/session bootstrap logic
- role-check middleware for protected routes

Do not spread auth parsing logic across unrelated routes.

---

## Suggested Core Route/Controller Areas
Create route/controller groups for:
- auth
- admin
- centres
- groups
- players
- parent links
- modules
- challenges
- schedule
- progress
- leaderboard
- import
- parent

Keep route names and handlers predictable.

---

## Suggested Reusable UI/Template Components
Create reusable partials/components for:
- page header
- navigation sidebar/top nav
- data table
- form field wrapper
- confirmation dialog/message area
- status badge
- loading state
- error message block
- empty state

Keep styling clean and basic.
No need for a complex design system.

---

## Styling Guidance
Use plain CSS and simple layout files served from `public/`.
Do not require large UI frameworks.
Focus on:
- clear layout
- readable forms
- mobile-friendly spacing
- accessible contrast

---

## Backend Service Integration Plan
Create dedicated service files such as:
- `authService`
- `adminService`
- `moduleService`
- `playerService`
- `leaderboardService`
- `importService`
- `parentService`

Each service should expose small functions.
Example style:
- `login(payload)`
- `getCurrentUser(context)`
- `getModules(context)`
- `createChallenge(moduleId, payload, context)`

Keep functions predictable.

---

## Data Types / Interfaces
Create centralized type notes/interfaces or JSDoc definitions for backend DTOs.
At minimum, define structures for:
- auth response
- user summary
- player profile
- badge progress
- leaderboard entry
- module summary
- module detail
- challenge
- schedule item
- import preview
- import validation row
- parent player link

Keep names aligned with backend response DTOs.

---

## Form Handling Guidance
Most pages will be form-based.
Keep forms simple and server-driven.
Recommended pattern:
- GET route to render form
- POST/PUT/PATCH route handler to submit to backend
- on success, redirect with success message
- on failure, re-render with validation errors

Do not overbuild client-side state in the first version.

---

## CSV Import UI Guidance
This is an important part of the product.
The import flow should clearly show:
- uploaded file name
- parsing status
- rows recognized
- users not yet mapped
- validation warnings/errors
- what will be created/updated on commit

Do not hide validation issues.
Admins need confidence before committing legacy data.

---

## Parent Read-Only Scope
Parent functionality is the only included stretch goal.
Implement only:
- login
- linked player list
- view player profile/progress

Do not allow parent edits.
Show a clearly read-only UI state.

---

## Error Handling Rules
Each page should handle:
- loading state where relevant
- empty state
- backend validation errors
- generic failure messages

Create a common error display mechanism.
Do not leave raw error objects in the UI.

---

## Frontend-Backend Contract Notes
The backend includes comments marked `FRONTEND_INTEGRATION`.
Align this Node + Express module with those integration points.
If backend DTOs change, update centralized service mappings and view models first.

Important screens that rely on stable contracts:
- login
- player profile
- leaderboard
- import preview
- parent player view

---

## Suggested Implementation Order
Build in this order:
1. app shell and routing
2. auth middleware and login page
3. backend API config and common service wrapper
4. admin dashboard navigation
5. centres/groups/players CRUD pages
6. modules/challenges/schedule pages
7. player profile and my profile pages
8. leaderboard page
9. parent read-only area
10. CSV import wizard
11. final cleanup and styling polish

---

## Definition of Done for This Module
This module is complete for MVP when:
1. users can log in
2. admin can manage core data through forms and lists
3. player can view own progress
4. parent can view linked player progress read-only
5. leaderboard views work
6. import wizard supports preview and commit flow
7. app integrates cleanly with backend running separately
8. code remains minimal and maintainable without heavy dependencies

---

## Final Instruction to Copilot
Generate this Node + Express module incrementally and keep it tightly aligned with the backend contract.
Prefer simple server-rendered pages, minimal dependencies, basic backend API integration, and maintainable route/controller/service separation.
Make the UI easy to extend later, but avoid overbuilding in the first version.
