<!-- Copilot instructions for the raistocksadmin repo -->

# raistocksadmin — Copilot / AI agent quick guide

Purpose: give an AI coding agent the minimal, concrete knowledge to be productive in this frontend repo.

Quick commands

- Install deps: npm install
- Dev server (fast HMR): npm run dev (vite, default host: http://localhost:5173)
- Build static bundle: npm run build
- Preview production build: npm run preview
- Lint: npm run lint (uses eslint)

Project entry points

- `src/main.jsx` — React entry, renders `<App />`.
- `src/App.jsx` — Router setup: root (`/`) is Login; admin panel is nested under `/admin/*`.
- `src/Layout/MainLayout.jsx` — Main admin layout that wraps nested routes via `<Outlet />` and manages the responsive sidebar.

Architecture / big picture

- Single-page React app built with Vite. No backend code in this repo — many screens use mock data.
- Routing: react-router-dom (v7) with nested routes. Admin pages are children of `/admin/*` and rendered inside `MainLayout`.
- UI: Bootstrap 5 (CSS + JS) is included via CDN links in `index.html`. Components use `react-bootstrap` but also rely on the global `bootstrap` JS object (see `MainLayout.jsx`).
- Charts: `chart.js` + `react-chartjs-2` (import `chart.js/auto` in pages that render charts).
- Icons: `lucide-react` used across Sidebar and components.

Important repository patterns & conventions

- Files use `.jsx` and default exports for components. Prefer creating new components as functional components with React hooks.
- Styling: global CSS in `index.html` and local `src/*.css`. Bootstrap classes are used throughout. Do not assume a CSS-in-JS solution.
- Global bootstrap JS: code expects a global `bootstrap` variable (e.g. `bootstrap.Offcanvas.getInstance(...)`) — `index.html` injects bootstrap bundle via CDN. When editing `MainLayout` or Sidebar, preserve the `mobileSidebar` element id and offcanvas usage.
- Active sidebar detection: Sidebar uses `location.pathname.split('/')[2]` to compute the active page. If you rename routes, update both `App.jsx` routes and Sidebar mapping.
- Auth: `src/Auth/Login.jsx` stores auth info in localStorage with keys `login_details` (JSON with role/email) and `user_id` (string). Login currently uses static credentials (admin@example.com / 123). Search for `login_details` when touching auth.

Routes & path names (use exact strings)

- Admin child routes defined in `App.jsx`: `dashboard`, `clients`, `payments`, `plans`, `emails`, `rai-data`, `support`, `user-management`, `leads`, `settings`, `tradeSatup` (note spelling: `tradeSatup`).
  - If you change a path (for example, fix `tradeSatup` → `trade-setup`), update `App.jsx`, `Sidebar.jsx` and any hard-coded links.

Data & integration notes

- Many components use mock data arrays inline (e.g. `Components/Clients.jsx` defines `mockClients`). There is no centralized data layer or API client yet.
- When adding backend integration: create a lightweight API module (e.g. `src/api/*`) and replace mock arrays. Avoid touching UI logic that expects synchronous arrays — convert to async loaders and show loading states.

Direct DOM usage & side-effects

- Several files directly access DOM APIs (window.innerWidth, document.getElementById, new bootstrap.Offcanvas(...)). These are deliberate for responsive/offcanvas interactions. Keep this behavior or refactor carefully into useEffect hooks.

Searchable tokens / quick examples

- Find auth: search for `login_details` and `user_id` (auth is simple localStorage-based).
- Offcanvas id: `mobileSidebar` (MainLayout relies on this exact id).
- Sidebar active logic: look for `location.pathname.split('/')[2]` in `Sidebar.jsx`.
- Routes: inspect `src/App.jsx` to see route names and nested layout usage.

Developer guidance for automated edits

- Preserve global bootstrap usage unless you intentionally add `import 'bootstrap'` and rebuild `index.html` references. Replacing CDN bootstrap with npm bootstrap is OK but requires updating `index.html` and verifying Offcanvas behavior.
- Keep route strings and Sidebar mapping synchronized. A safe automated change is to add a new admin route: update `src/App.jsx`, add route component, and add a Sidebar menu entry (same path string).
- Avoid changing localStorage keys without a migration plan. If you must, update `Login.jsx`, any consumers, and consider a graceful fallback for the old key.

Files worth reading before changing UI/behavior

- `index.html` — global CSS/JS (Bootstrap via CDN), fonts.
- `src/Layout/MainLayout.jsx` — responsive layout + bootstrap Offcanvas usage.
- `src/Layout/Sidebar.jsx` — menu mapping and active route logic.
- `src/Auth/Login.jsx` — static login flow and localStorage keys.
- `src/Components/Clients.jsx` — example of mock data + pagination + modals.

Testing & linting

- No unit tests present. Use `npm run lint` to run ESLint. When adding code, prefer following existing patterns (JSX, bootstrap classes, local state).

If you need more

- Tell me which part you want automated edits for (e.g., add API integration, rename a route, migrate bootstrap from CDN → package). I can produce a precise PR and update tests/lint as needed.

---

If anything in this file looks incomplete or you want a different focus (e.g., expand on API integration points or add Contributing.md style rules), tell me what to add and I will iterate.
