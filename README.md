# ThreadHive

A Reddit-style discussion platform built as a full-stack MERN application. Users can register, log in, browse community threads, post and vote on threads, and participate in comment discussions.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Testing](#testing)

---

## Features

- **Authentication** — Register and log in with JWT-based sessions
- **Threads** — Create, view, and vote (upvote/downvote) on threads
- **Comments** — Add comments to threads and vote on them
- **Subreddits** — Browse threads filtered by community
- **Dark Mode** — Toggle between light and dark themes
- **Responsive Layout** — Collapsible sidebar for mobile and desktop

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| Redux Toolkit | 2.x | Global state management |
| React Router DOM | 7.x | Client-side routing |
| Axios | 1.x | HTTP requests |
| React-Bootstrap + Bootstrap | 5.x | UI components and styling |
| Vite | 6.x | Build tool and dev server |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Express | 5.x | HTTP server and routing |
| Mongoose | 8.x | MongoDB ODM |
| bcryptjs | 3.x | Password hashing |
| jsonwebtoken | 9.x | JWT authentication |
| helmet | 8.x | Security headers |
| express-rate-limit | 7.x | Request rate limiting |
| dotenv | 16.x | Environment variable loading |

---

## Project Structure

```
threadhive/
├── threadhive-backend/
│   ├── main.js                 # App entry point (loads .env, connects DB, starts server)
│   ├── server.js               # Express server start/stop helpers
│   ├── db.js                   # MongoDB connection helper
│   └── src/
│       ├── app.js              # Express app — middleware + route registration
│       ├── controllers/        # Thin route handlers (delegate to services)
│       ├── services/           # Business logic and database queries
│       ├── models/             # Mongoose schemas (User, Thread, Comment, Subreddit)
│       ├── routes/             # Express routers
│       ├── middleware/         # authHandler.js, errorHandler.js
│       ├── utils/              # createAppError.js
│       └── scripts/            # populate_db.js — seed the database
│
└── threadhive-frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx             # Root component with routing
        ├── api/                # axiosInstance.js — single Axios instance
        ├── config/             # apiConfig.js — all endpoint constants
        ├── components/
        │   ├── Comment/        # CommentForm, CommentList
        │   ├── Forms/          # CreateThreadForm
        │   ├── Header/         # Top navigation bar
        │   ├── Sidebar/        # Collapsible navigation sidebar
        │   ├── ThreadList/     # ThreadList, ThreadCard
        │   ├── Shared/         # VoteButtons, FilterSortBar, PaginationComponent
        │   ├── Footer/         # Footer
        │   └── PrivateRoute/   # Auth guard wrapper
        ├── pages/
        │   ├── Auth/           # Login.jsx, Register.jsx
        │   └── User/           # Home.jsx, ThreadPage.jsx, Profile.jsx
        ├── reducers/           # Redux slices (auth, threads, comments, subreddits, theme)
        ├── services/           # API call functions (called by thunks)
        ├── store/              # store.js — Redux store configuration
        ├── utils/              # handleApiError.js
        └── tests/              # Vitest + MSW integration tests
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running MongoDB instance or a MongoDB Atlas connection string

### Backend Setup

```bash
cd threadhive-backend
npm install
```

Create a `.env` file in `threadhive-backend/` (see [Environment Variables](#environment-variables)).

Start the development server:

```bash
npm run dev
```

Optionally, seed the database with sample data:

```bash
npm run populate
```

### Frontend Setup

```bash
cd threadhive-frontend
npm install
npm run dev
```

The frontend dev server runs at `http://localhost:5173` by default and proxies API requests to `http://localhost:3000/api`.

---

## Environment Variables

Create `threadhive-backend/.env` with the following variables:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=7d
MONGODB_URI=your_mongodb_connection_string
```

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default: `3000`) |
| `NODE_ENV` | Runtime environment (`development` / `production`) |
| `JWT_SECRET` | Secret key used to sign and verify JWTs |
| `JWT_EXPIRATION` | JWT validity duration (e.g. `1d`, `7d`) |
| `MONGODB_URI` | Full MongoDB connection string |

---

## Available Scripts

### Backend (`threadhive-backend/`)

| Script | Command | Description |
|---|---|---|
| Start | `npm start` | Run server with Node |
| Dev | `npm run dev` | Run server with Nodemon (auto-restart) |
| Test | `npm test` | Run backend unit + integration tests |
| Seed | `npm run populate` | Populate database with sample data |
| Format | `npm run format` | Format source files with Prettier |

### Frontend (`threadhive-frontend/`)

| Script | Command | Description |
|---|---|---|
| Dev | `npm run dev` | Start Vite dev server |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Run ESLint |
| Test | `npx vitest run` | Run frontend integration tests |

---

## API Overview

All backend routes are prefixed with `/api`. Authenticated routes require an `Authorization: Bearer <token>` header.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| GET | `/api/threads` | Yes | Fetch all threads |
| GET | `/api/threads/:id` | Yes | Fetch a single thread |
| POST | `/api/threads` | Yes | Create a new thread |
| PUT | `/api/threads/:id` | Yes | Update a thread |
| DELETE | `/api/threads/:id` | Yes | Delete a thread |
| POST | `/api/threads/:id/upvote` | Yes | Upvote a thread |
| POST | `/api/threads/:id/downvote` | Yes | Downvote a thread |
| GET | `/api/comments/thread/:threadId` | Yes | Fetch comments for a thread |
| POST | `/api/comments` | Yes | Add a comment |
| POST | `/api/comments/:id/upvote` | Yes | Upvote a comment |
| POST | `/api/comments/:id/downvote` | Yes | Downvote a comment |
| GET | `/api/subreddits` | Yes | Fetch all subreddits |
| GET | `/api/subreddits/:id` | Yes | Fetch subreddit with its threads |
| POST | `/api/subreddits` | Yes | Create a new subreddit |

---

## Testing

### Frontend (Vitest + MSW + Testing Library)

Tests live in `threadhive-frontend/src/tests/`.

```bash
cd threadhive-frontend
npx vitest run          # run all tests once
npx vitest              # run in watch mode
npx vitest --coverage   # run with coverage report
```

MSW intercepts all Axios requests at the network layer — no real server needed for frontend tests.

### Backend (Vitest)

Tests live in `threadhive-backend/tests/` with unit and integration suites.

```bash
cd threadhive-backend
npm test
```
