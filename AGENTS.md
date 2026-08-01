# ThreadHive – GitHub Copilot Agent Instructions

These instructions apply to all AI-assisted work in this monorepo. Follow them for every code suggestion, edit, or generation task.

---

## Project Overview

**ThreadHive** is a Reddit-style discussion platform built as a full-stack MERN application.

| Folder | Purpose |
|--------|---------|
| `threadhive-frontend/` | React 19 + Vite SPA |
| `threadhive-backend/` | Express 5 + Mongoose REST API |

---

## Tech Stack

### Frontend
- **React 19** with functional components and hooks only (no class components)
- **Redux Toolkit** (`@reduxjs/toolkit`) for all global state
- **React-Redux** (`useSelector`, `useDispatch`)
- **React Router DOM v7** for routing
- **Axios** for HTTP requests (via `src/api/axiosInstance.js`)
- **React-Bootstrap + Bootstrap 5** for UI components
- **Vite** as the build tool

### Backend
- **Express 5** — async errors are caught automatically (no `express-async-errors` needed)
- **Mongoose 8** for MongoDB ODM
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT authentication
- **helmet** + **express-rate-limit** for security middleware
- **dotenv** for environment variables

---

## Project Structure

### Frontend (`threadhive-frontend/src/`)
```
api/            # axiosInstance.js — single Axios instance (base URL, interceptors)
config/         # apiConfig.js — all API endpoint constants
components/     # Reusable UI components (Header, Sidebar, Comment, etc.)
pages/          # Route-level page components (Auth/, User/)
reducers/       # Redux slices (one file per feature)
services/       # API call functions (called by thunks, not components)
store/          # store.js — Redux store configuration
utils/          # handleApiError.js and other helpers
```

### Backend (`threadhive-backend/src/`)
```
controllers/    # Route handler functions (thin — delegate to services)
services/       # Business logic and DB queries
models/         # Mongoose schemas/models
routes/         # Express routers
middleware/     # authHandler.js, errorHandler.js
utils/          # createAppError.js
```

---

## State Management (Redux Toolkit)

1. All global state is managed with Redux Toolkit. The store is configured in `src/store/store.js`.
2. Each feature has its own slice in `src/reducers/` (e.g., `authSlice.js`, `threadListSlice.js`).
3. Use `useSelector` to read state and `useDispatch` to dispatch actions. **Never import the store directly in components.**
4. For API calls, use `createAsyncThunk`. Each thunk calls a function from `src/services/`.
5. Handle loading, success, and error states in `extraReducers` using the builder pattern:
   - `.addCase(thunk.pending, ...)` → set loading `true`, clear error
   - `.addCase(thunk.fulfilled, ...)` → update state with payload, set loading `false`
   - `.addCase(thunk.rejected, ...)` → set loading `false`, store error from payload
6. **Never access `localStorage` directly in components** — always use Redux actions (`loginUser`, `logout`, `setUser`).
7. Use `handleApiError` from `src/utils/handleApiError.js` in thunk `catch` blocks for consistent error handling.

**Example thunk pattern:**
```js
export const fetchThings = createAsyncThunk(
  'feature/fetchThings',
  async (arg, { rejectWithValue }) => {
    try {
      return await thingService.getAll(arg);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
```

---

## API Layer

- All requests go through `src/api/axiosInstance.js` (base URL: `http://localhost:3000/api`).
- All endpoint paths are defined as constants in `src/config/apiConfig.js`. **Never hardcode URLs in services or components.**
- Service functions live in `src/services/` and are the only place that imports `axiosInstance`.
- For authenticated requests, the Axios instance must attach the JWT from Redux state (not from `localStorage` directly).

---

## Backend Conventions

- Controllers are thin: validate input, call a service, return JSON. No business logic in controllers.
- Services contain all DB queries and business logic. Throw errors using `createAppError(message, statusCode)` from `src/utils/createAppError.js`.
- All routes that require authentication use the `authHandler` middleware.
- The global `errorHandler` middleware (last in `app.js`) handles all thrown errors. Express 5 auto-forwards async errors — no try/catch needed in controllers.
- Environment variables are loaded via `dotenv` in `main.js` only. Never call `dotenv.config()` in multiple files.

---

## Coding Conventions

- Use **ES Modules** (`import`/`export`) throughout — both frontend and backend use `"type": "module"`.
- Prefer `async/await` over `.then()` chains.
- Destructure props and state where it improves readability.
- Component files use `.jsx`, utility/service files use `.js`.
- Keep components focused: extract repeated logic into hooks or services, not inline in JSX.
- Do not add `console.log` statements in production code paths.
