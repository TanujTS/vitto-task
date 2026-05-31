# Vitto Loan Applications Portal

A modern, responsive full-stack monorepo application for submitting, reviewing, and managing loan applications. Built with a rich dark-mode user interface, type-safe APIs, and containerized backend orchestration.

---

## Run it locally

### Prerequisites
Make sure you have [Node.js (v24+)](https://nodejs.org/), [PNPM (v11+)](https://pnpm.io/), and optionally [Docker](https://www.docker.com/) installed.

1. **Clone & Install Dependencies**
   ```bash
   # Clone the repository
   git clone https://github.com/TanujTS/vitto-task.git
   cd vitto-task

   # Install dependencies for all workspace projects (packages, web, api)
   pnpm install
   ```

2. **Configure Environment Variables**
   * Create `apps/api/.env`:
     ```env
     DATABASE_URL=<db_url_here>
     PORT=3000
     WEB_URL=http://localhost:5173
     ```
   * Create `apps/web/.env` (optional, falls back to port 3000):
     ```env
     VITE_API_URL=http://localhost:3000/api
     ```

3. **Run Database Migrations**
   ```bash
   pnpm migrate
   ```

4. **Start Development Servers**
   In the root directory, start both the backend API and frontend web app:
   ```bash
   # Run both concurrently in separate terminals or processes:
   pnpm dev:api   # Starts API on http://localhost:3000
   pnpm dev:web   # Starts Web Portal on http://localhost:5173
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Option 2: Run Backend with Docker Compose

If you want to run the Express API in a clean container:

1. **Configure Environment Variables**
   Ensure `apps/api/.env` is configured (see steps above).

2. **Build and Start Container**
   ```bash
   docker-compose up --build
   ```
   * The API container spins up and runs a healthcheck on `http://localhost:3000/health`.
   * It exposes the API on `http://localhost:3000`.

3. **Run Web Client Locally**
   ```bash
   pnpm dev:web
   ```

---

## 🛠 Tech Stack

### Monorepo Structure
* **`apps/web`**: React Single Page Application (built with Vite, Tailwind CSS, TanStack Query, and Radix UI).
* **`apps/api`**: Express.js server backend (built with pg/node-postgres, Zod, and built using `tsup`).
* **`packages/types`**: Shared TypeScript definitions ensuring full compile-time type-safety across client and server.
* **`migrations/`**: Raw SQL files for postgres schema versioning.

### Styling & UI/UX
* **Dark-themed Glassmorphism UI** using Tailwind CSS.
* Modern typography via **Geist** and **Space Grotesk** variable fonts.
* Responsive components, smooth micro-animations, loading skeletons, and interactive state indicators.

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api` (excluding `/health`).

### Health Check
* **`GET /health`**
  * Check backend service and DB connection status.
  * **Response:** `200 OK` `"Healthy"`

### Applications
* **`POST /api/applications`**
  * Create a new loan application.
  * **Request Body:**
    ```json
    {
      "name": "Jane Doe",
      "mobile": "9876543210",
      "amount": 150000.00,
      "purpose": "Medical expenses and personal consolidation.",
      "language": "English"
    }
    ```
    * *Available Languages:* `'Hindi' | 'Tamil' | 'Telugu' | 'Marathi' | 'English'`
  * **Response:** `201 Created`

* **`GET /api/applications`**
  * Retrieve all applications sorted by creation date (newest first).
  * **Query Parameters:** `status` (optional) - Filter applications by status (`pending` | `approved` | `rejected`).
  * **Response:** `200 OK`

* **`PATCH /api/applications/:id/status`**
  * Update the status of an existing application.
  * **Request Body:**
    ```json
    {
      "status": "approved"
    }
    ```
  * **Response:** `200 OK`

* **`GET /api/applications/summary`**
  * Retrieve summary stats including overall application counts, total loan amount requested, and status distributions.
  * **Response:** `200 OK`

---
