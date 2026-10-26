# Gather — Event & Workshop Management Portal

A MERN-stack event discovery and management application built for the Full Stack Developer Intern assignment. The public site reads events from MongoDB through Express REST APIs. Admins can sign in, review dashboard statistics, and create, edit, and delete events.

## Features
- Public event listing with title search, category filter, date sorting, event detail pages, loading/error/empty states and responsive layout.
- Registration form with client and server validation, normalized email addresses, duplicate prevention via a unique compound index, and atomic seat reservation.
- Admin login using environment-configured credentials and an HTTP-only JWT cookie; protected CRUD, dashboard stats, registration lists.
- Dashboard summary and registration/seat counts; confirmation before event deletion.
- Seed script with eight reusable sample events; environment examples and `.gitignore`.

## Stack
React, Vite, JavaScript, Bootstrap 5, React Router, Axios, React Icons; Node.js, Express, Mongoose, MongoDB, JWT, Helmet.

## Requirements
- Node.js 20+ and npm
- MongoDB local instance or MongoDB Atlas URI
- Git (optional for local run)

## Setup
Open two terminals from the repository root.

### 1. Backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and configure `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`, and `PORT`. Do not commit `.env`.

For local MongoDB, start the MongoDB service and use `mongodb://127.0.0.1:27017/event_workshop_portal`. For Atlas, use your private connection string.

```bash
npm run seed
npm run dev
```
API runs on `http://localhost:5000` by default.

### 2. Frontend
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:5000/api`.

```bash
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Admin account
Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` before starting the backend. These values are never embedded in frontend code. Use a strong local password. The login endpoint issues an HTTP-only cookie that expires after eight hours.

## API overview
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/login` | Public, rate-limited | Admin login |
| POST | `/api/auth/logout` | Public | Clear admin cookie |
| GET | `/api/auth/me` | Admin | Verify session |
| GET | `/api/events?search=&category=&sort=` | Public | List/search/filter/sort events |
| GET | `/api/events/:id` | Public | Event detail |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event and registrations |
| POST | `/api/registrations` | Public | Register for an event |
| GET | `/api/registrations` | Admin | List registrations |
| GET | `/api/registrations/event/:eventId` | Admin | Registrations for an event |
| GET | `/api/dashboard/stats` | Admin | Dashboard statistics |
| GET | `/api/dashboard/events` | Admin | Event management list |

Success responses use `{ "success": true, "message": "...", "data": ... }`; errors use `{ "success": false, "message": "..." }`.

## Data and concurrency notes
- The `Registration` collection has a unique `{ event, email }` index.
- A conditional atomic increment on the event document reserves a seat only while `registrationsCount < totalSeats`; failed registration creation rolls back that increment.
- Event deletion uses a MongoDB transaction to delete the event and registrations consistently. **Transactions require MongoDB replica-set mode**, including for a local deployment. Configure a local single-node replica set or use an appropriately configured Atlas deployment before testing event deletion.
- `registrationsCount` is maintained by registration creation and used for available seats. If manually editing database records, reconcile this counter before demonstrating.
- The date/status rules are intentionally simple: Completed events reject registrations; public registration is also unavailable for events whose date has passed. Dashboard completed counts include explicit Completed status or past dates. Keep statuses and dates consistent when creating events.

## Testing checklist
Automated API integration tests have not been included in this initial implementation. Verify manually with Postman/browser:
1. `GET /api/health` returns success and events appear after seeding.
2. Search, category filter, sorting, event details, and empty states work.
3. Invalid registration fields are rejected; valid registration creates a record and reduces seats.
4. Registering the same email twice for one event returns HTTP 409.
5. A full or completed event rejects registrations; try parallel requests against a one-seat event.
6. Unauthenticated `POST/PUT/DELETE /api/events` and dashboard requests return 401.
7. Admin can create/edit events, and capacity cannot be reduced below existing registrations.
8. Event deletion works with MongoDB replica-set mode enabled.
9. Check mobile widths near 375 px, tablet 768 px, and desktop 1366 px.

Do not report any check as passed until you have run it in your environment.

## Screenshots
Add screenshots of the public events page, event details/registration, and admin dashboard here before submission.

## Known limitations
- Admin credentials are environment-configured rather than stored as a database user. Protect `.env` and use strong credentials.
- The UI does not yet include a dedicated registration-management table view, although authorized registration endpoints are available.
- Image URLs are externally hosted; the app uses fallback imagery if a URL fails.
- MongoDB transaction support is needed for safe cascade deletion.
