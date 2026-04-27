#!/usr/bin/env bash
set -euo pipefail

cd /Users/mohi/.openclaw/workspace/keypillar-hub

if [ -f .cf-dev.pid ]; then
  kill "$(cat .cf-dev.pid)" 2>/dev/null || true
  rm -f .cf-dev.pid
fi

if [ -f .cf-tunnel.pid ]; then
  kill "$(cat .cf-tunnel.pid)" 2>/dev/null || true
  rm -f .cf-tunnel.pid
fi

echo "Stopped OpenClaw Cloudflare preview."
