#!/bin/bash
# Usage: npm run release:patch | release:minor | release:major
# Or:    bash scripts/release.sh [patch|minor|major]
set -e

BUMP=${1:-patch}

if [[ "$BUMP" != "patch" && "$BUMP" != "minor" && "$BUMP" != "major" ]]; then
  echo "Usage: $0 [patch|minor|major]"
  exit 1
fi

# ── 1. Bump version ────────────────────────────────────────────────────────────
echo "Bumping version ($BUMP)..."
npm version "$BUMP" --no-git-tag-version
VERSION=$(node -p "require('./package.json').version")
echo "  → v$VERSION"

# ── 2. Rebuild API docs ────────────────────────────────────────────────────────
echo "Rebuilding docs..."
npm run docs

# ── 3. Rebuild agent bundle ────────────────────────────────────────────────────
AGENT_SRC=${AGENT_SRC:-"../ureport-reporter/ureport-agent"}

if [ -d "$AGENT_SRC" ]; then
  echo "Building agent bundle from $AGENT_SRC..."
  (cd "$AGENT_SRC" && npm version "$BUMP" --no-git-tag-version && npm run bundle)
  mkdir -p agent
  cp "$AGENT_SRC/dist/ureport-agent.tar.gz" agent/
  cp "$AGENT_SRC/dist/ureport-agent.zip"    agent/
  echo "  Agent bundles copied to agent/"
else
  echo "  Skipping agent build — $AGENT_SRC not found (set AGENT_SRC env var to override)"
fi

echo ""
echo "Release v$VERSION ready."
