# Expense Manager

Expense Manager is a modern, cross-platform React Native app (Expo + TypeScript) that helps users manage expenses, add transactions, and track financial health. It uses Tailwind via NativeWind and a modular UI component system.

## Table of Contents
- Project Overview
- Tech Stack
- Getting Started
- Scripts
- Environment Setup
- Branching Strategy
- Conventional Commits
- Pull Request (PR) Workflow
- Labels & Automation
- Release & Versioning
- Troubleshooting

## Project Overview
Track transactions, add expenses/income, and view summaries with a clean, mobile-first experience.

## Tech Stack
- Expo / React Native
- TypeScript
- Tailwind CSS (NativeWind)
- Modular UI components

## Getting Started
1. Install pnpm if not installed: https://pnpm.io/installation
2. Install dependencies:
   pnpm install
3. Start the app (Expo):
   pnpm start

## Scripts
- pnpm start: Start Expo dev server
- pnpm android / pnpm ios: Run on Android/iOS
- pnpm web: Run in web browser (Expo for Web)
- pnpm lint: Lint the codebase
- pnpm format: Format with Prettier

## Environment Setup
1. Copy .env.example to .env and fill in values as needed.
2. Restart the dev server after changes.

## Branching Strategy
Use small, focused branches off main:
- feat/<scope>: new features (e.g., feat/app-shell)
- fix/<scope>: bug fixes
- docs/<scope>: documentation changes (e.g., docs/readme)
- refactor/<scope>: refactoring without behavior change
- chore/<scope>: tooling and maintenance (e.g., chore/tooling)

Tip: Keep PRs small and cohesive; one logical change per PR where possible.

## Conventional Commits
Use semantic Conventional Commit messages:
- feat(scope): short description
- fix(scope): short description
- docs(scope): short description
- refactor(scope): short description
- chore(scope): short description

Examples:
- chore(tooling): configure Tailwind, NativeWind, and Prettier
- feat(transactions): add list and add-transaction screens
- docs(readme): add setup and workflow tips

## Pull Request (PR) Workflow
1. Create a dedicated branch for the change.
2. Commit with Conventional Commits.
3. Push the branch and open a PR via GitHub CLI:
   gh pr create --fill --label "type: feature" --title "feat(scope): concise title" --body "Why, What, How, Testing steps"
4. Keep PR descriptions actionable:
   - Why: the motivation
   - What: summary of changes
   - How: key implementation notes
   - Testing: steps to verify
5. Request reviews. Address comments quickly and keep commits clean (prefer additional commits over force-push during review).

## Labels & Automation
Suggested labels:
- type: feature, type: fix, type: docs, type: refactor, type: chore
- area: app, area: components, area: tooling, area: docs
- priority: high/medium/low

## Release & Versioning
We follow Semantic Versioning (SemVer).
Consider using changesets or release-please for automated release notes.

## Troubleshooting
- If Tailwind classes don’t apply, ensure NativeWind and Tailwind configs are in sync and restart Metro bundler.
- If TypeScript types fail, delete node_modules and pnpm-lock.yaml, then reinstall.
- For Expo cache issues:
  rm -rf .expo && pnpm start -c

---
Last updated: 2026-01-04
