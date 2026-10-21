#!/usr/bin/env bash
# Syncs IPO data into the database through the app's /api/cron/* routes:
#   groww-ipo-sync  Groww's upcoming/open/closed feeds (creates and updates IPOs)
#   gmp-sync        Investorgain grey market premium, one reading per IPO per day
# Installed via cron — see deploy/README.md.
# Usage: ./ipo-sync.sh [--dry-run]   (--dry-run reports what would change, writes nothing)
set -euo pipefail
cd "$(dirname "$0")"

QUERY=""
[[ "${1:-}" == "--dry-run" ]] && QUERY="?dryRun=1"

# Runs inside the app container: Caddy blocks /api/cron/* publicly, and CRON_SECRET is
# expanded from the container's own environment (single quotes keep the host shell out of it).
# The Groww sync runs first: it creates the IPOs that GMP readings attach to.
STATUS=0
for JOB in groww-ipo-sync gmp-sync; do
    if OUT=$(docker compose exec -T -e JOB="$JOB" -e QUERY="$QUERY" app sh -c \
        'wget -qO- --header "Authorization: Bearer $CRON_SECRET" --post-data "" "http://127.0.0.1:3000/api/cron/$JOB$QUERY"'); then
        echo "$(date -u '+%F %T') $JOB ok: $OUT"
    else
        echo "$(date -u '+%F %T') $JOB FAILED — see: docker compose logs app | grep -E 'GROWW_IPO_SYNC|GMP_SYNC'"
        STATUS=1
    fi
done
exit $STATUS
