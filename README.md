# Bug Bounty Platform — Backend & API Documentation

A robust backend for a Bug Bounty platform where users post technical issues with rewards, and hunters submit solutions to earn bounties.

## 🚀 Features Implemented

- **Advanced Authentication**: Secure registration, login, logout, and refresh token flows using JWT stored in HTTP-only cookies.
- **Bug Lifecycle Management**:
    - **OPEN**: Newly created bugs.
    - **IN REVIEW**: Automatically triggered when the first solution is submitted.
    - **CLOSED**: Set when a creator approves a winner.
- **Smart Listing**: Public bug feed with server-side pagination (page/limit), status filtering, and title search.
- **Submission Guardrails**: Enforced unique submissions (one per user per bug) and creator-restrictions (cannot submit to your own bug).
- **Transactional Rewards**: Automated flow to mark winners, reject other candidates, and increment the winner's `totalRewards`.
- **Ownership Control**: Creators have exclusive rights to approve solutions or delete their own bug posts.

## 🛠 Tech Stack

- **Runtime**: Node.js & Express.js for a scalable RESTful architecture.
- **Database**: MongoDB & Mongoose for flexible document modeling and indexing.
- **Security**: Bcrypt for password hashing and JWT for stateful session management.

### Required environment variables

- `MONGODB_URI` — mongodb://127.0.0.1:27017/bugBountyDB
- `ACCESS_TOKEN_SECRET` — JWT access token secret
- `REFRESH_TOKEN_SECRET` — JWT refresh token secret
- `ACCESS_TOKEN_EXPIRY` — e.g. `15m`
- `REFRESH_TOKEN_EXPIRY` — e.g. `7d`
- `CORS_ORIGIN` — allowed origin(s)
- `PORT` — optional, default `8000`

## 📋 API Summary (Base URL: `/api/v1`)

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | Login and receive cookies |
| GET | `/auth/me` | Fetch current session user (Protected) |
| POST | `/auth/logout` | Clear session cookies (Protected) |

### Bug Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/bugs` | List bugs with pagination & filters |
| POST | `/bugs` | Post a new bug with bounty (Protected) |
| GET | `/bugs/:bugId` | View detailed bug & submissions |
| GET | `/bugs/my-bugs` | View your posted bugs (Protected) |
| DELETE | `/bugs/:bugId` | Remove bug (Owner only) |

### Submissions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/submissions/my` | View your submitted solutions |
| POST | `/submissions/:bugId` | Submit a fix (Protected) |
| PATCH | `/submissions/:id/approve` | Reward hunter & close bug (Owner only) |

## 📊 Database Schema (ER Diagram)


```mermaid
erDiagram
    USER ||--o{ BUG : "posts"
    USER ||--o{ SUBMISSION : "solves"
    BUG ||--o{ SUBMISSION : "receives"
    USER ||--o| BUG : "wins (rewarded)"

    USER {
        string username UK
        string email UK
        number totalRewards
        string password
    }

    BUG {
        string title
        number bountyAmount
        string status "OPEN, IN_REVIEW, CLOSED"
        ObjectId creator FK
        ObjectId winner FK
    }

    SUBMISSION {
        ObjectId bug FK
        ObjectId user FK
        string proofLink
        string status "PENDING, APPROVED, REJECTED"
    }