#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-3000}"

echo "Checking localhost on port $PORT..."
if ! curl -fsS "http://localhost:$PORT" >/dev/null 2>&1; then
  echo "Localhost is not running on port $PORT."
  echo "Start the app first with:"
  echo "npm run dev -- -H 0.0.0.0 -p $PORT"
  exit 1
fi

echo "Localhost works."
echo "Starting temporary Cloudflare preview tunnel..."
cloudflared tunnel --url "http://localhost:$PORT"
