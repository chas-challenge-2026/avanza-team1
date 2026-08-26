# Avanza Frontend

The frontend is a React 18 single-page application built with Vite and TypeScript. It is maintained separately from the Spring Boot backend.

## Environment

Required tools:

- Node.js 22 LTS or newer
- npm

Main frontend technologies:

- React 18
- TypeScript
- Vite
- TanStack Query

All frontend commands in this document must be run from the `frontend/` directory.

## Install dependencies

From the repository root:

```powershell
cd frontend
npm install
```

Run this again after pulling changes that modify `package.json` or `package-lock.json`.

## Start the Vite development server

From `frontend/`:

```powershell
npm run dev
```

Open the local URL printed by Vite, normally:

```text
http://localhost:5173
```

The development server supports hot module replacement. Keep it running while making UI changes and refresh the browser if the page does not update automatically.

To make the server available to other devices on the local network:

```powershell
npm run dev -- --host
```

## Build and preview the production bundle

Build the frontend first:

```powershell
npm run build
```

This runs the TypeScript check and creates the production bundle in `dist/`.

Preview that bundle locally:

```powershell
npm run preview
```

Open the URL printed by Vite, normally:

```text
http://localhost:4173
```

The preview server is useful for checking the built output before deployment. It is not the development server and does not replace the Spring Boot backend.

## Visual testing workflow

1. Start the development server with `npm run dev`.
2. Open the Vite URL in a browser.
3. Check the main views at both desktop and mobile viewport sizes.
4. Test navigation, loading states, empty states, error states, forms, and interactive controls.
5. Use `npm run build` to confirm the UI also compiles as a production bundle.
6. Use `npm run preview` to inspect the production bundle locally.

When the frontend calls the backend API, start the backend infrastructure separately according to the repository documentation in `../DRIFT.md`. The Vite server and Spring Boot server are separate processes.

## Available npm scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the production bundle |
| `npm run preview` | Serve the production bundle locally |
| `npm run lint` | Run ESLint |
