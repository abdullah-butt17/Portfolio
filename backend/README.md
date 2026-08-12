# Abdullah Butt — Portfolio Backend API

Backend REST API for Abdullah Butt's full-stack developer portfolio, with an authenticated admin CMS for managing projects, skills, profile, and contact messages.

## Tech Stack

- Node.js / Express.js
- MongoDB / Mongoose
- JWT auth (HTTP-only cookies) + bcryptjs
- express-validator
- Helmet, CORS, express-rate-limit, express-mongo-sanitize
- Cloudinary (media storage) + Multer (in-memory upload buffer)
- Morgan (logging)

## Architecture

```
React (frontend, deployed separately)
        │
        ▼
Express REST API  (this repo)
        │
   ┌────┴────┐
   ▼         ▼
MongoDB   Cloudinary
Atlas     (images/video)
```

Database: `Abdullah_butt_Portfolio` on the shared `mine` Atlas cluster. This backend never touches the Daily Sales database/collections.

## Local Setup

```bash
npm install
cp .env.example .env   # fill in real values
npm run dev
```

Server runs at `http://localhost:5000` by default.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string, pointed at `Abdullah_butt_Portfolio` |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT lifetime (e.g. `7d`) |
| `CLIENT_URL` | Deployed frontend origin, used for CORS |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by the seed script to create the first admin |
| `NODE_ENV` | `development` / `production` |

## Admin Setup

There is no public registration. Create the admin once:

```bash
npm run seed:admin
```

Reads `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` from `.env`, hashes the password, and skips creation if that email already exists.

## API Documentation

All responses follow:

```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "message": "..." }
{ "success": false, "message": "Validation failed", "errors": [] }
```

### Auth

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/login | No | Admin login (rate-limited) |
| POST | /api/auth/logout | Admin | Clear auth cookie |
| GET | /api/auth/me | Admin | Current admin info |

### Projects — Public

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/projects | List published projects. Query: `search, category, status, featured, page, limit` |
| GET | /api/projects/featured | Published + featured projects |
| GET | /api/projects/:slug | Single published project by slug |

### Projects — Admin

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/projects/admin | List all projects (any status) |
| GET | /api/projects/admin/:id | Get project by ID |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project (+ its Cloudinary media) |
| PATCH | /api/projects/:id/status | Update status |
| PATCH | /api/projects/:id/featured | Toggle featured |
| PATCH | /api/projects/:id/published | Toggle published |
| PATCH | /api/projects/:id/order | Update displayOrder |
| POST | /api/projects/:id/media | Upload media. `multipart/form-data`, field `file`, body `type=thumbnail\|screenshot\|video` |
| DELETE | /api/projects/:id/media/:publicId | Delete a specific media asset (publicId URL-encoded) |

### Profile

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | /api/profile | No | Get profile |
| PUT | /api/profile | Admin | Update profile fields |
| POST | /api/profile/image | Admin | Upload/replace profile image |

### Skills

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | /api/skills | No | List skills |
| POST | /api/skills | Admin | Create skill |
| PUT | /api/skills/:id | Admin | Update skill |
| DELETE | /api/skills/:id | Admin | Delete skill |
| PATCH | /api/skills/:id/order | Admin | Reorder skill |

### Contact

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/contact | No | Submit contact message (rate-limited) |

### Health

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | /api/health | No | Liveness check for Render |

## Deployment (Render)

1. Push this repo to GitHub.
2. Create a new **Web Service** on Render, connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add all variables from `.env.example` in Render's environment settings.
5. Set `CLIENT_URL` to the deployed frontend's origin, and `NODE_ENV=production`.
6. After first deploy, run `npm run seed:admin` once (Render Shell or a one-off job) to create the admin account.

## Security Notes

- No secrets are committed; `.env` is gitignored.
- Passwords are hashed with bcrypt; never returned in API responses.
- Admin routes require a valid JWT (HTTP-only cookie) + active admin role.
- CORS is locked to `CLIENT_URL`, not `*`.
- Rate limiting on `/api` generally, and stricter limits on login and contact.
- All inputs validated server-side via express-validator; Mongo operator injection stripped via express-mongo-sanitize.
- Media never stored on the Render filesystem — uploaded to Cloudinary via in-memory buffers.
