#!/bin/bash
# SessionStart hook for Claude Code cloud sessions: installs npm dependencies
# so `npm run typecheck` / `npm run build` work right away.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

# npm install (not ci) keeps the cached node_modules between sessions and is idempotent.
npm install --no-audit --no-fund
