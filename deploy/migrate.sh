#!/usr/bin/env bash
# Applies every db/migrations/*.sql file in order. Each file is idempotent, so this is
# safe to run on every schema change. Usage (on the VM): ./migrate.sh
set -euo pipefail
cd "$(dirname "$0")"

for f in ../db/migrations/*.sql; do
    echo "→ $(basename "$f")"
    docker compose exec -T postgres psql -U gpaisa -d gpaisa -v ON_ERROR_STOP=1 -q < "$f"
done
echo "✅ Migrations applied"
