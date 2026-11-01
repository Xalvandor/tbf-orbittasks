# OrbitTasks Architecture

## Overview

OrbitTasks is a TypeScript monorepo with two apps:

## Components

- **API**: Node.js + Express backend, file-backed JSON store (JSON file via DATABASE_URL; in-memory only under tests).
- **Web**: React + Vite frontend.

External services are mocked in tests via scripts/mock-server.js.

For deeper detail see the per-app READMEs.
