# Bug Bounty Platform — Backend

Short, interview-focused README describing the backend for the Bug Bounty web platform.

## Project Summary

This repository contains the backend for a simple Bug Bounty web platform where users can post bugs with bounties and other users can submit solutions. The bug creator reviews submissions and approves one winner, who receives the bounty (logical award only).

## Features Implemented
- User registration, login, logout, refresh token flows (JWT + refresh tokens stored on user).
- Create bug with title, description, bounty amount, and status.
- Public listing of bugs and bug detail view including submissions.
- Submit a solution (one submission per user per bug enforced by unique index).
- Approve a submission (transactional flow): mark approved, reject others, close bug, assign winner, increment winner's `totalRewards`.
- Basic error handling and API response wrapper utilities.

## Tech Stack & Justification
- Node.js + Express: lightweight and quick to implement REST APIs.
- MongoDB + Mongoose: flexible document model suits rapid prototyping of bugs/submissions; transactions used for approval flow.
- JWT for auth: stateless access tokens plus refresh tokens for session management.

These choices match the stated flexible tech stack and are appropriate for an interview MVP.

## Quick Setup (Development)

Prerequisites:
- Node 18+ and npm
- MongoDB (for transactions, a replica set is required — see Notes)

Install and run locally:

```bash
cd "d:/bug bounty system/backend"
npm install
# create a .env file with the variables listed below
npm run dev
```

### Required environment variables
- `MONGODB_URI` — MongoDB connection string
- `ACCESS_TOKEN_SECRET` — JWT access token secret
- `REFRESH_TOKEN_SECRET` — JWT refresh token secret
- `ACCESS_TOKEN_EXPIRY` — e.g. `15m`
- `REFRESH_TOKEN_EXPIRY` — e.g. `7d`
- `CORS_ORIGIN` — allowed origin(s)
- `PORT` — optional, default `8000`

## API Summary

All APIs are prefixed with `/api/v1`.

- `POST /api/v1/auth/register` — Register user: `username`, `email`, `fullName`, `password`.
- `POST /api/v1/auth/login` — Login: `email` or `username`, `password`.
- `POST /api/v1/auth/logout` — Logout (protected).
- `POST /api/v1/auth/refresh-token` — Refresh access token.

- `GET /api/v1/bugs` — List bugs (query: `page`, `limit`, `status`, `search`).
- `POST /api/v1/bugs` — Create bug (protected): `title`, `description`, `bountyAmount`.
- `GET /api/v1/bugs/:bugId` — Get bug details and submissions.
- `GET /api/v1/bugs/my` — (not implemented) My bugs endpoint placeholder.

- `POST /api/v1/submissions/:bugId` — Submit solution (protected): `description`, `proofLink`.
- `PATCH /api/v1/submissions/:submissionId/approve` — Approve submission (protected, only bug creator).

Notes:
- Auth uses cookies (`accessToken`, `refreshToken`) and Authorization header `Bearer <token>` is also supported.

## Data Models (summary)

- `User`:
  - `username`, `email`, `fullName`, `password`, `totalRewards`, `refreshToken`
- `Bug`:
  - `title`, `description`, `bountyAmount`, `status` (`OPEN`|`CLOSED`), `creator`, `winner`
- `Submission`:
  - `bug`, `user`, `description`, `proofLink`, `status` (`PENDING`|`APPROVED`|`REJECTED`)

## Important Notes & Known Issues
- Missing / optional: frontend, API docs (Postman/Swagger), and payment gateway integration — these were out of scope.
- Transactions used in `approveSubmission` require MongoDB replica set; for single-node development, either enable a single-node replica set or remove transactions and use careful updates.
- Some validations are ad-hoc; consider adding request validation (Joi / Zod) in production.
- `submission` model enforces unique `(bug, user)` — one submission per user per bug. If you want multiple attempts per user, remove the unique index.

## Security Considerations
- Ensure `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are strong and kept secret.
- In production, set cookie option `secure: true` and configure CORS specifically.

## What I would look for as an interviewer
- Clear README and setup instructions (this file).
- Well-structured code and separation of concerns (controllers, models, routes, utils).
- Error handling and consistent API responses.
- Thoughtful handling of the approval flow (transactions + winner award logic).
- Tests and API documentation would be a plus (not included here).

## Next Improvements (if time allowed)
- Add API tests (unit + integration).
- Add input validation using Joi or Zod.
- Add Postman/Swagger docs and sample requests.
- Add frontend with React or minimal HTML views.
- Add CI config and meaningful commit history.

---

If you want, I can also add a Postman collection and a short `docker-compose` for local MongoDB with a replica set.
