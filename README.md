# AI Powered Web3 Auditing (Frontend)

This repo contains the **React-based frontend** for the AI‑powered Web3 auditing system. The heavy backend AI agent (GenAI + model orchestration, audit engine, data pipelines) is not included here due to size constraints.

---

## 📁 Project Structure

```
AI_Powered_web3_auditing/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/            # images, icons, fonts, styles
│   ├── components/        # reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── AuditForm.jsx
│   │   ├── AuditResults.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/             # route-level views
│   │   ├── Home.jsx
│   │   ├── UploadAudit.jsx
│   │   ├── History.jsx
│   │   └── About.jsx
│   ├── services/          # API calls, HTTP client wrappers
│   │   └── auditService.js
│   ├── hooks/             # custom React hooks (e.g. useFetch, useForm)
│   ├── context/           # React Context or Redux slices for global state
│   ├── utils/             # utility functions, helpers
│   ├── App.jsx            # React root component (router setup)
│   ├── index.js           # entry point
│   └── styles/            # global and CSS modules
├── .gitignore
├── package.json
├── README.md
└── vite.config.js (or webpack.config.js / CRA scripts)
```

---

## 🔍 Description of Key Parts

### `public/`

Contains **static files** served as-is, including `index.html` which is the HTML shell.

### `src/`

* **assets/**: Storage for static assets like logos, style sheets, or branding images.
* **components/**: Modular UI components across the app (form inputs, table rows, spinners, etc.).
* **pages/**: High-level route-based components (Home, Upload Audit page, Audit history view, About).
* **services/**:

  * `auditService.js`: abstracts HTTP requests to your backend AI API (e.g., `/api/submit-audit`, `/api/status`).
* **hooks/**: e.g. `useFetch()` for API data loading, `useForm()` for form state.
* **context/** or **state/**: for global state management (user info, audit sessions, tokens).
* **utils/**: helper routines (date formatting, address checksum utilities, etc.).
* **App.jsx**: sets up React Router (likely `react-router-dom`), defines routes and layouts.
* **index.js**: application entry point, rendering `<App />` into the DOM.
* **styles/**: global CSS, CSS Modules, or styled‑components. Contains theme files if applicable.

---

## ⚙️ Development Workflow

1. Clone this repo and navigate in:

   ```bash
   git clone https://github.com/luv-k/AI_Powered_web3_auditing.git
   cd AI_Powered_web3_auditing
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:

   ```bash
   npm start
   # or
   yarn dev
   ```
4. The app runs on `http://localhost:3000` (or `:5173` for Vite).

---

## 🧠 Backend (AI Agent) Overview

* The backend is an **AI agent** that runs smart contract audit workflows.
* It orchestrates **multiple large language models** and GenAI agents.
* It receives code or contract input via HTTP from the frontend, executes vulnerability analysis, then sends structured audit results.
* Due to size and complexity, the backend is maintained separately; the frontend interacts using REST or GraphQL endpoints (e.g. `POST /audit`, `GET /audit/:id`).

---

## 🚀 How the Frontend Interacts with Backend

* **Submit Audit**: `components/AuditForm.jsx` gathers input (e.g. contract file or code snippet), passes data to `auditService.submit()` ➝ calls backend API.
* **Polling or WebSocket**: `AuditResults.jsx` shows a loading spinner and periodically polls status or gets real-time updates, then displays results.
* **Display Logic**: Parses structured data (list of vulnerabilities, severity, recommendations) and renders them in tables or alert cards.

---

## ✅ Recommended README Sections to Add

* **Prerequisites** (Node version, environment vars like `REACT_APP_API_URL`)
* **Available Scripts** (`npm test`, `npm run build`)
* **Environment Variables** — e.g. `NODE_ENV`, `REACT_APP_BACKEND_URL`
* **Deployment** — how to build for production and deploy (e.g. Netlify, Vercel)
* **Project Roadmap** — e.g. adding user auth, wallet integration, backend enhancements
* **Contributing Guide** — code style, linting, pull request process
* **License**

---

## NOTE

* This is exclusively the **frontend** portion: a React app built to gather input, communicate with a backend AI auditing service, and display results.
* Backend is handled separately — too large for this repo — but the front-end code assumes clean REST/GraphQL interfaces.
* Key folders: `components/`, `pages/`, `services/`, `hooks/`, `context/`, and `utils/`.
