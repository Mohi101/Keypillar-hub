#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"

PIDS=$(lsof -ti tcp:"$PORT" || true)
if [ -n "$PIDS" ]; then
  kill -9 $PIDS || true
fi

npm run dev -- -H 0.0.0.0 -p "$PORT" > .openclaw-dev.log 2>&1 &
echo $! > .openclaw-dev.pid

echo "Waiting for localhost..."
for i in {1..60}; do
  if curl -fsS "http://localhost:$PORT" >/dev/null 2>&1; then
    echo "Localhost working: http://localhost:$PORT"
    break
  fi
  sleep 1
done

curl -fsS "http://localhost:$PORT" >/dev/null

rm -f .openclaw-cloudflare.log .openclaw-cloudflare-url.txt

cloudflared tunnel --url "http://localhost:$PORT" > .openclaw-cloudflare.log 2>&1 &
echo $! > .openclaw-cloudflare.pid

for i in {1..60}; do
  URL=$(grep -Eo 'https://[-a-zA-Z0-9]+\.trycloudflare\.com' .openclaw-cloudflare.log | head -n 1 || true)
  if [ -n "$URL" ]; then
    echo "$URL" > .openclaw-cloudflare-url.txt
    echo "Cloudflare preview URL: $URL"
    exit 0
  fi
  sleep 1
done

echo "Could not find Cloudflare URL."
cat .openclaw-cloudflare.log
exit 1
