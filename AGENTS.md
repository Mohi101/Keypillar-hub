Cloudflare / OpenClaw rule for this project:

This project must always run on port 3000.

Public Cloudflare URL:
https://hub.keypillar.co.uk

When starting the local development server, always use:

npm run dev -- -H 0.0.0.0 -p 3000

Do not use random localhost ports.
Do not only give me http://localhost links.
After starting the app, always tell me to open:

https://hub.keypillar.co.uk

Cloudflare Tunnel route:
https://hub.keypillar.co.uk -> http://localhost:3000

This public link only works when:
1. this Mac is on,
2. the Cloudflare tunnel is healthy,
3. the app is running on port 3000.
