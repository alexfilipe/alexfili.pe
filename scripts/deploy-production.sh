#!/usr/bin/env bash

set -euo pipefail

REPO="alexfilipe/alexfili.pe"
WORKFLOW="deploy-production.yml"
BRANCH="main"

cd "$(git rev-parse --show-toplevel)"

for command in git gh curl; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "Missing required command: $command" >&2
    exit 1
  fi
done

if [[ "$(git branch --show-current)" != "$BRANCH" ]]; then
  echo "Production deploys must be run from $BRANCH." >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Commit or stash your changes before deploying production." >&2
  exit 1
fi

if ! gh auth status --hostname github.com >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login -h github.com -w -s workflow" >&2
  exit 1
fi

echo "Pushing $BRANCH to origin..."
git push origin "$BRANCH"

commit="$(git rev-parse HEAD)"
dispatched_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "Starting production deploy for ${commit:0:7}..."
gh workflow run "$WORKFLOW" \
  --repo "$REPO" \
  --ref "$BRANCH" \
  -f confirm=alexfili.pe

run_id=""
for _ in {1..15}; do
  run_id="$(gh run list \
    --repo "$REPO" \
    --workflow "$WORKFLOW" \
    --branch "$BRANCH" \
    --event workflow_dispatch \
    --commit "$commit" \
    --limit 1 \
    --json databaseId,createdAt \
    --jq ".[] | select(.createdAt >= \"$dispatched_at\") | .databaseId")"

  [[ -n "$run_id" ]] && break
  sleep 2
done

if [[ -z "$run_id" ]]; then
  echo "Deploy was dispatched, but its workflow run could not be found." >&2
  echo "Check: https://github.com/$REPO/actions/workflows/$WORKFLOW" >&2
  exit 1
fi

echo "Watching workflow run $run_id..."
gh run watch "$run_id" --repo "$REPO" --exit-status

echo "Verifying production..."
curl --fail --silent --show-error --location --output /dev/null https://alexfili.pe/

www_status="$(curl --silent --output /dev/null --write-out '%{http_code}' https://www.alexfili.pe/)"
if [[ ! "$www_status" =~ ^30[1278]$ ]]; then
  echo "Expected www.alexfili.pe to redirect, but received HTTP $www_status." >&2
  exit 1
fi

robots="$(curl --fail --silent --show-error https://alexfili.pe/robots.txt)"
if [[ "$robots" != *"https://alexfili.pe"* ]]; then
  echo "robots.txt does not reference https://alexfili.pe." >&2
  exit 1
fi

echo "Production deploy succeeded: https://alexfili.pe/"
