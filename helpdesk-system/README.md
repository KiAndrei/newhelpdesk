# Helpdesk Ticket Management System

Laravel REST API (`backend/`) + React/Vite SPA (`frontend/`). Two separate apps.

```
helpdesk-system/
├── backend/      Laravel 12 API (SQLite/MySQL/PostgreSQL), Dockerfile for deployment
├── frontend/     React + Vite + React Router + Axios
└── render.yaml   Optional Render Blueprint (API + PostgreSQL)
```

**Exam login (client-side only):** username `itadmin` · password `helpdesk 123` (note the space).

---

## 1. Run locally

Requirements: PHP 8.2+ (with `pdo_sqlite`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `fileinfo`), Composer 2, Node 18+.

### Backend
```bash
cd backend
composer install
cp .env.example .env          # Windows CMD: copy .env.example .env
php artisan key:generate
php artisan migrate           # uses database/database.sqlite (already created, empty)
php artisan serve             # http://127.0.0.1:8000
```
Optional demo data: `php artisan db:seed`

If `database/database.sqlite` is missing, create an empty file with that name, then run `php artisan migrate`.

### Frontend (new terminal)
```bash
cd frontend
npm install
cp .env.example .env          # Windows CMD: copy .env.example .env
npm run dev                   # http://localhost:5173
```
`.env` → `VITE_API_BASE_URL=http://127.0.0.1:8000/api`

### Quick API test (optional)
```bash
curl -X POST http://127.0.0.1:8000/api/tickets -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"requester_name":"Test","requester_email":"t@example.com","issue_category":"Network","priority":"High","subject":"Hi","description":"Testing"}'
curl http://127.0.0.1:8000/api/tickets -H "Accept: application/json"
```

---

## 2. API reference

Base: `/api` · JSON in/out · always send `Accept: application/json`.

| Method | Endpoint | Success | Errors |
|---|---|---|---|
| GET | `/api/tickets` | 200 `{data:[...]}` (newest first) | |
| POST | `/api/tickets` | 201 `{message,data}` | 422 validation |
| GET | `/api/tickets/{id}` | 200 `{data}` | 404 |
| PUT / PATCH | `/api/tickets/{id}` | 200 `{message,data}` | 404, 422 |
| DELETE | `/api/tickets/{id}` | 204 (no body) | 404 |

Validation: `requester_name`, `requester_email` (valid email), `issue_category` (Hardware, Software, Network, Account Access, Other), `priority` (Low, Medium, High, Urgent), `subject`, `description` are required. `status` (Open, In Progress, Resolved, Closed) defaults to `Open`. 
422 shape: `{"message":"...","errors":{"field":["msg"]}}` · 404 shape: `{"message":"Ticket not found."}`
Ticket numbers (`TKT-0001`, …) are generated from the record ID.

---

## 3. Deployment

### A. Managed database (PostgreSQL)
Create a managed PostgreSQL database (Render, Neon, Supabase, Railway, …) and copy its connection string (`postgresql://user:pass@host:5432/db`).

### B. Backend (Render, using the included Dockerfile)
1. Push the repo to GitHub.
2. Generate a key locally: `php artisan key:generate --show` → copy the `base64:...` value.
3. Render → New → **Web Service** → pick repo → **Root Directory: `backend`** → Runtime: **Docker**. (Or use `render.yaml` as a Blueprint, which also creates the DB.)
4. Environment variables (see `backend/.env.production.example`):
   - `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY=<key>`, `APP_URL=https://<api-domain>`
   - `LOG_CHANNEL=stderr`, `CACHE_STORE=file`
   - `DB_CONNECTION=pgsql`, `DB_URL=<connection string>`, `DB_SSLMODE=require` (use `prefer` for Render's internal URL if `require` fails)
   - `CORS_ALLOWED_ORIGINS=https://<your-frontend-domain>` (no trailing slash; add `,http://localhost:5173` if you also test locally)
5. Health check path: `/up`. On each start the container runs `php artisan migrate --force`, which only applies pending migrations and never drops data.
6. Verify: open `https://<api-domain>/api/tickets` → should return `{"data":[]}`.

> Free tiers may sleep when idle; the first request can take up to a minute. The frontend allows 45 s per request.

### C. Frontend (Vercel / Netlify / Render Static)
- Root directory: `frontend` · Build: `npm run build` · Output: `dist`
- Env var **before building**: `VITE_API_BASE_URL=https://<api-domain>/api`
- SPA rewrites are already included: `vercel.json` (Vercel) and `public/_redirects` (Netlify).
  For Render Static Site add a Rewrite rule: source `/*` → destination `/index.html`.
- After deploying, put the final frontend URL into the backend's `CORS_ALLOWED_ORIGINS` and redeploy/restart the backend.

### D. Verify persistence (for the evidence screenshots)
1. Create a ticket in the live app. 2. Confirm the row in your DB provider's console/SQL editor (`SELECT * FROM tickets;`).
3. Trigger a backend redeploy/restart. 4. Reload the app — the ticket must still be listed.

---

## 4. Testing checklist
- [ ] Login with `itadmin` / `helpdesk 123`; wrong credentials show inline errors
- [ ] Opening `/tickets` while logged out redirects to `/login`
- [ ] FAB opens `/tickets/add`; empty submit shows per-field errors; bad email rejected
- [ ] Create → success message → list shows new ticket (no manual refresh)
- [ ] Details page shows all fields; unknown ID (`/tickets/99999`) shows inline error
- [ ] Edit loads existing values, saves, returns to details
- [ ] Delete shows the in-app modal; ticket disappears afterwards
- [ ] Stop API → list shows error + Retry
- [ ] Restart both servers → data still present
- [ ] Reload on `/tickets/1` (deployed) works for a logged-in user
- [ ] No `alert()` / `confirm()` anywhere

## Notes
- Client-side login is required by the exam brief; it is **not** real security — the API itself is unauthenticated.
- Login state is kept in `sessionStorage` (survives refresh, cleared on tab close/Logout). Ticket data is never stored in the browser.
