#!/usr/bin/env bash
# Nightly database backup: pg_dump → Cloud Storage, keeping 7 days locally (the bucket's
# lifecycle rule keeps 30). Installed via cron — see deploy/README.md.
set -euo pipefail
cd "$(dirname "$0")"
# cron's PATH is minimal; on GCP Ubuntu images gcloud is a snap in /snap/bin.
export PATH="$PATH:/usr/local/bin:/snap/bin"
# deploy/.env is in Docker env-file format (values may contain spaces), so read the
# few values needed here instead of sourcing it.
env_get() { grep -E "^$1=" .env | tail -n 1 | cut -d= -f2- | sed -E "s/^'(.*)'$/\\1/; s/^\"(.*)\"$/\\1/"; }
BACKUP_BUCKET=$(env_get BACKUP_BUCKET)

mkdir -p backups
FILE=backups/gpaisa-$(date -u +%Y%m%dT%H%M%SZ).dump
docker compose exec -T postgres pg_dump -U gpaisa -d gpaisa -Fc > "$FILE"
gcloud storage cp --quiet "$FILE" "${BACKUP_BUCKET:?Set BACKUP_BUCKET in deploy/.env}/"
find backups -name 'gpaisa-*.dump' -mtime +7 -delete
echo "$(date -u '+%F %T') backup ok: $FILE ($(du -h "$FILE" | cut -f1))"
