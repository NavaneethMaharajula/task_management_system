# Task Management App

## Overview
A beginner‑friendly full‑stack task management application built with the **MERN** (Mongo, Express, React, Node) stack, but using **SQLite** as the SQL backend for simplicity. The project is split into two main folders:

- **backend** – Node.js + Express server handling CRUD operations with a local SQLite database.
- **frontend** – React app created with Vite that talks to the backend via a clean REST API.

The UI is deliberately minimal with a single `App.jsx` component, making it easy to understand and extend.

## Project Structure
```
task_management_system/
├─ backend/
│   ├─ package.json
│   ├─ index.js          # Express server + SQLite logic
│   └─ database.sqlite   # Auto‑created DB file (run the server first)
└─ frontend/
    ├─ package.json
    ├─ vite.config.js
    └─ src/
        ├─ App.jsx      # Main React component
        ├─ index.js
        └─ App.css
```

## Prerequisites
- **Node.js** (v18 or later) installed on your machine.
- **npm** (comes with Node).
- No separate SQL server is needed – SQLite is bundled with the backend.

## Setup Instructions
1. **Clone the repository** (or copy the files into a new folder).
2. **Backend**
   ```bash
   cd backend
   npm install   # installs express, sqlite3, cors, etc.
   node index.js # starts the server on http://localhost:5000
   ```
   The server will automatically create `database.sqlite` on the first run.
3. **Frontend**
   ```bash
   cd ../frontend
   npm install   # installs react, vite, axios, etc.
   npm run dev   # starts Vite dev server, usually at http://localhost:5173
   ```
4. Open the frontend URL in your browser. You should see a clean task list UI where you can:
   - Add new tasks (title & description).
   - Mark tasks as completed.
   - Delete tasks.
   - Edit existing tasks.

## API Endpoints (Backend)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/get` | Retrieve all tasks |
| GET | `/api/get/:id` | Retrieve a single task |
| POST | `/api/post` | Create a new task (expects `title`, `description`) |
| DELETE | `/api/remove/:id` | Delete a task |
| PUT | `/api/update/:id` | Update title/description/completed flag |
| PUT | `/api/updateCompleted/:id` | Toggle completed status |

All responses are JSON.

## Running Everything Together
You can open two terminals side‑by‑side, start the backend in one and the frontend in the other. The React app proxies API calls to `http://localhost:5000` (CORS is enabled on the server).

## Extending the Project
- Add user authentication (e.g., JWT).
- Switch to a fully‑featured SQL server (PostgreSQL, MySQL) by changing the DB client.
- Split the UI into multiple components (TaskList, TaskForm, etc.) for a more modular architecture.

---
*Feel free to modify the code to suit your learning goals. Happy coding!*
