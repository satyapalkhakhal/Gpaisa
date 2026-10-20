#!/usr/bin/env bash
# Pull the latest code, rebuild the app image (prerendering from the live database),
# restart, and wait for /api/health. Usage (on the VM): ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

git -C .. pull --ff-only
# deploy/.env is in Docker env-file format (values may contain spaces), so read the
# few values needed here instead of sourcing it.
env_get() { grep -E "^$1=" .env | tail -n 1 | cut -d= -f2- | sed -E "s/^'(.*)'$/\\1/; s/^\"(.*)\"$/\\1/"; }
BUILD_DATABASE_URL=$(env_get BUILD_DATABASE_URL)
export BUILD_DATABASE_URL   # passed to the build as a secret below

docker compose up -d postgres
# Built with buildx directly rather than `docker compose build`: newer Compose builds
# via bake, which refuses host networking unless granted explicitly. Host network lets
# `next build` prerender from Postgres on 127.0.0.1:5432.
docker buildx build --allow network.host --network host \
    --secret id=database_url,env=BUILD_DATABASE_URL \
    -t gpaisa-app:latest --load ..
docker compose up -d

echo "Waiting for health check..."
for _ in $(seq 1 30); do
    if docker compose exec -T app wget -qO- http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
        echo "✅ Deployed and healthy"
        docker image prune -f >/dev/null
        exit 0
    fi
    sleep 2
done
echo "❌ App failed its health check. Recent logs:"
docker compose logs --tail=50 app
exit 1
