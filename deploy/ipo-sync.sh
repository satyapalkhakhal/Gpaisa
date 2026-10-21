#!/usr/bin/env bash
# Syncs Groww's upcoming/open/closed IPO feeds into the database through the app's
# /api/cron/groww-ipo-sync route. Installed via cron — see deploy/README.md.
# Usage: ./ipo-sync.sh [--dry-run]   (--dry-run reports what would change, writes nothing)
set -euo pipefail
cd "$(dirname "$0")"

QUERY=""
[[ "${1:-}" == "--dry-run" ]] && QUERY="?dryRun=1"

# Runs inside the app container: Caddy blocks /api/cron/* publicly, and CRON_SECRET is
# expanded from the container's own environment (single quotes keep the host shell out of it).
if OUT=$(docker compose exec -T -e QUERY="$QUERY" app sh -c \
    'wget -qO- --header "Authorization: Bearer $CRON_SECRET" --post-data "" "http://127.0.0.1:3000/api/cron/groww-ipo-sync$QUERY"'); then
    echo "$(date -u '+%F %T') ipo-sync ok: $OUT"
else
    echo "$(date -u '+%F %T') ipo-sync FAILED — see: docker compose logs app | grep GROWW_IPO_SYNC"
    exit 1
fi
