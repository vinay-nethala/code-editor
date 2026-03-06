# Code Editor

A browser-based code editor with advanced keyboard shortcuts, state management for undo/redo, and performance optimizations.

## Features

- Real-time event logging dashboard
- Keyboard shortcuts: Save (Ctrl/Cmd+S), Tab indentation, Enter with auto-indent, Undo/Redo (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z), Toggle comments (Ctrl/Cmd+/), Chord shortcut (Ctrl/Cmd+K then Ctrl/Cmd+C)
- Undo/Redo history stack
- Debounced syntax highlighting simulation
- Cross-platform modifier key support
- Containerized with Docker

## Setup

1. Clone the repository.
2. Ensure Docker and Docker Compose are installed.
3. Copy `.env.example` to `.env` and set `APP_PORT` if needed (default 3000).
4. Run `docker-compose up --build` to build and start the application.
5. Open http://localhost:3000 in your browser.

## Development

For local development without Docker:

1. Install Node.js.
2. Run `npm install`.
3. Run `npm start` to start the server.
4. Open http://localhost:3000.

## Project Structure

- `src/server.js`: Express server to serve static files.
- `public/index.html`: Main HTML page.
- `public/styles.css`: Styles for the editor and dashboard.
- `public/app.js`: Main application logic.
- `docker-compose.yml`: Docker Compose configuration.
- `Dockerfile`: Docker build instructions.
- `.env.example`: Environment variables template.

## Requirements

- Node.js (for local dev)
- Docker and Docker Compose (for containerized run)