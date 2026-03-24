# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

A browser-only habit tracker app. No backend, no database — all state lives in `localStorage`. See `CLAUDE_CODE_HABIT_TRACKER_SPEC.md` for the full feature specification.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript** + **Tailwind CSS**
- **No backend, no API, no auth** — pure client-side
- Deployed as a Docker container (Next.js `standalone` + Node) on k3s via Argo CD

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server

# Build & test
npm run build        # Production build (standalone → .next/standalone)
npm test             # Jest unit tests
npm run test:coverage  # Jest with coverage report (threshold: 80%)

# Run a single test file
npx jest lib/streak.test.ts

# Docker (local) — image prod uniquement
npm run docker:up    # build + run → http://localhost:3000
# ou : npm run docker:build && npm run docker:run
```

## Architecture

```
app/                  # Next.js App Router pages
components/           # Reusable React components (HabitRow, AddHabitForm, etc.)
lib/                  # Pure business logic: streak calculation, localStorage helpers
hooks/                # Custom React hooks (e.g., useHabits)
```

**Key architectural decisions:**
- Components that use `localStorage` or React state must be `'use client'` components
- Streak logic and localStorage access belong in `lib/` or `hooks/`, not in components
- localStorage key prefix: `habit-tracker:` (stable, never change)
- Streak is recalculated on every page load and on `visibilitychange` events

**Data model** (localStorage JSON):
- Each habit stores an array of completed dates as `YYYY-MM-DD` strings (local timezone)
- Streak is derived from the date array at runtime, not stored directly

## Deployment

- CI: GitHub Actions builds OCI image and pushes to `ghcr.io/vinzlac/habit`
- GitOps: CI auto-updates `kubernetes/deployment.yaml` with the new image SHA
- Argo CD watches `kubernetes/` and syncs to the cluster
- Live at: `http://habit.homelab` (k3s homelab)
- Required CI secret: `BUILDKIT_HOST=tcp://buildkitd.cicd.svc.cluster.local:1234`

