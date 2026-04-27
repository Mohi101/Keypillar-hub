#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
APP_DIR="/Users/mohi/.openclaw/workspace/keypillar-hub"

cd "$APP_DIR"

echo "Stopping old preview processes..."
if [ -f .cf-dev.pid ]; then
  kill "$(cat .cf-dev.pid)" 2>/dev/null || true
  rm -f .cf-dev.pid
fi

if [ -f .cf-tunnel.pid ]; then
  kill "$(cat .cf-tunnel.pid)" 2>/dev/null || true
  rm -f .cf-tunnel.pid
fi

PIDS=$(lsof -ti tcp:"$PORT" || true)
if [ -n "$PIDS" ]; then
  kill -9 $PIDS || true
fi

echo "Setting local NextAuth URL to localhost:$PORT..."
python3 - <<PY
from pathlib import Path

path = Path(".env")
text = path.read_text() if path.exists() else ""
lines = []
found_nextauth = False
found_trust = False

for line in text.splitlines():
    if line.startswith("NEXTAUTH_URL="):
        lines.append('NEXTAUTH_URL="http://localhost:$PORT"')
        found_nextauth = True
    elif line.startswith("AUTH_TRUST_HOST="):
        lines.append("AUTH_TRUST_HOST=true")
        found_trust = True
    else:
        lines.append(line)

if not found_nextauth:
    lines.append('NEXTAUTH_URL="http://localhost:$PORT"')
if not found_trust:
    lines.append("AUTH_TRUST_HOST=true")

path.write_text("\\n".join(lines) + "\\n")
PY

echo "Starting Next.js on port $PORT..."
npm run dev -- -H 0.0.0.0 -p "$PORT" > .openclaw-dev.log 2>&1 &
echo $! > .cf-dev.pid

echo "Waiting for localhost..."
for i in {1..60}; do
  if curl -fsS "http://localhost:$PORT" >/dev/null 2>&1; then
    echo "Localhost is working: http://localhost:$PORT"
    break
  fi
  sleep 1
done

curl -fsS "http://localhost:$PORT" >/dev/null

echo "Starting Cloudflare temporary tunnel..."
rm -f .openclaw-cloudflare.log .openclaw-cloudflare-url.txt

cloudflared tunnel --url "http://localhost:$PORT" > .openclaw-cloudflare.log 2>&1 &
echo $! > .cf-tunnel.pid

echo "Waiting for trycloudflare.com URL..."
for i in {1..60}; do
  URL=$(grep -Eo 'https://[-a-zA-Z0-9]+\.trycloudflare\.com' .openclaw-cloudflare.log | head -n 1 || true)
  if [ -n "$URL" ]; then
    echo "$URL" > .openclaw-cloudflare-url.txt
    echo "Cloudflare URL: $URL"
    exit 0
  fi
  sleep 1
done

echo "Could not find Cloudflare URL. Log:"
cat .openclaw-cloudflare.log
exit 1
