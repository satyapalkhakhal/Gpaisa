# Self-hosting gpaisa.in on one GCP VM

One VM runs everything with Docker Compose:

```
Internet → Caddy (80/443, auto HTTPS, gpaisa.in → www) → Next.js app (:3000) → PostgreSQL 17
                                                                     nightly pg_dump → Cloud Storage
```

| File | Purpose |
|---|---|
| `docker-compose.yml` | Postgres + app + Caddy |
| `Caddyfile` | HTTPS certificates, apex → www redirect, compression |
| `.env.example` | Template for `deploy/.env` (secrets, never committed) |
| `migrate-from-supabase.sh` | Copies the Supabase database here and verifies row counts |
| `deploy.sh` | Pull, rebuild, restart, health-check |
| `migrate.sh` | Applies `db/migrations/*.sql` (all idempotent) |
| `backup.sh` | Nightly `pg_dump` → Cloud Storage |
| `ipo-sync.sh` | Pulls Groww's IPO feeds, Investorgain GMP, NCDs and rights issues, and Chittorgarh buybacks into the database (cron) |

> **Until cutover, don't merge this work into `main`.** Vercel still deploys `main`,
> and this code needs `DATABASE_URL`, which Vercel doesn't have. Keep it on a branch
> and point the VM at that branch; merge once DNS has moved.

---

## 1. GCP resources (one time, from your laptop)

```bash
PROJECT=your-gcp-project-id
REGION=asia-south1          # Mumbai
ZONE=asia-south1-a
gcloud config set project $PROJECT

# Static IP
gcloud compute addresses create gpaisa-ip --region=$REGION
gcloud compute addresses describe gpaisa-ip --region=$REGION --format='value(address)'

# Backup bucket, objects auto-deleted after 30 days
gcloud storage buckets create gs://gpaisa-db-backups --location=$REGION --uniform-bucket-level-access
echo '{"rule":[{"action":{"type":"Delete"},"condition":{"age":30}}]}' > /tmp/lifecycle.json
gcloud storage buckets update gs://gpaisa-db-backups --lifecycle-file=/tmp/lifecycle.json

# VM identity that may only write backups
gcloud iam service-accounts create gpaisa-vm --display-name="gpaisa VM"
gcloud storage buckets add-iam-policy-binding gs://gpaisa-db-backups \
  --member=serviceAccount:gpaisa-vm@$PROJECT.iam.gserviceaccount.com --role=roles/storage.objectCreator

# VM: e2-medium (2 vCPU / 4 GB — `next build` needs ~2 GB), Ubuntu 24.04, 30 GB disk
gcloud compute instances create gpaisa-web --zone=$ZONE \
  --machine-type=e2-medium \
  --image-family=ubuntu-2404-lts-amd64 --image-project=ubuntu-os-cloud \
  --boot-disk-size=30GB --boot-disk-type=pd-balanced \
  --address=gpaisa-ip --tags=web \
  --service-account=gpaisa-vm@$PROJECT.iam.gserviceaccount.com --scopes=cloud-platform

# Firewall: web traffic open; SSH only through Google's IAP proxy
gcloud compute firewall-rules create gpaisa-allow-web --allow=tcp:80,tcp:443,udp:443 --target-tags=web
gcloud compute firewall-rules create gpaisa-allow-iap-ssh --allow=tcp:22 --source-ranges=35.235.240.0/20 --target-tags=web
# If the default network has `default-allow-ssh` (open to 0.0.0.0/0), delete it:
#   gcloud compute firewall-rules delete default-allow-ssh

# Weekly disk snapshots, kept 4 weeks (second safety net beside pg_dump)
gcloud compute resource-policies create snapshot-schedule gpaisa-weekly --region=$REGION \
  --weekly-schedule=sunday --start-time=21:00 --max-retention-days=28
gcloud compute disks add-resource-policies gpaisa-web --zone=$ZONE --resource-policies=gpaisa-weekly
```

## 2. Prepare the VM (one time)

```bash
gcloud compute ssh gpaisa-web --zone=$ZONE --tunnel-through-iap

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && exit     # log back in so the group applies

# 2 GB swap: headroom for `next build` next to the running site
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Code (add a read-only GitHub deploy key for the VM first)
sudo mkdir -p /opt/gpaisa && sudo chown $USER /opt/gpaisa
git clone git@github.com:satyapalkhakhal/Gpaisa.git /opt/gpaisa
cd /opt/gpaisa && git checkout <migration-branch>   # see the note at the top

# Secrets
cd deploy && cp .env.example .env && chmod 600 .env && nano .env
#  - POSTGRES_PASSWORD: openssl rand -hex 24 (hex keeps it URL-safe), and the same value in BUILD_DATABASE_URL
#  - ADMIN_PASSWORD_HASH: wrap in single quotes, no backslashes (see the comment in the file)
```

`gcloud` comes preinstalled on GCP's Ubuntu images; `gcloud --version` confirms it.

## 3. Trial run (site stays on Vercel)

```bash
cd /opt/gpaisa/deploy
SUPABASE_DB_URL='postgresql://postgres.<ref>:<db-password>@aws-0-<region>.pooler.supabase.com:5432/postgres' \
  ./migrate-from-supabase.sh      # use Supabase → Connect → "Session pooler" URL
./deploy.sh
```

The migration script ends with a row-count comparison. Every table must match before you continue.

To preview over HTTPS before switching DNS, point a spare subdomain such as
`new.gpaisa.in` at the VM IP and temporarily add this to `Caddyfile` (the `noindex` keeps
Google from indexing a duplicate site):

```
new.gpaisa.in {
	header X-Robots-Tag "noindex, nofollow"
	reverse_proxy app:3000
}
```

Then run `docker compose restart caddy` and browse `https://new.gpaisa.in`, including `/admin`.
Remove the block once you've moved over.

## 4. Cutover

1. **A day before:** lower the TTL on the `gpaisa.in` and `www` DNS records to 300 seconds.
2. Pause admin edits and the IPO/content agents. They still write to Supabase until step 7.
3. Refresh the data and rebuild:
   `SUPABASE_DB_URL='…' ./migrate-from-supabase.sh && ./deploy.sh`
4. Change DNS. Point both `gpaisa.in` (A record) and `www.gpaisa.in` at the VM's static IP,
   replacing Vercel's A and CNAME records.
5. `docker compose restart caddy`, then watch `docker compose logs -f caddy` until both
   hosts show `certificate obtained successfully`.
6. Verify:
   ```bash
   curl -sI https://www.gpaisa.in | head -1                 # 200
   curl -sI https://gpaisa.in/news | grep -i location       # https://www.gpaisa.in/news
   curl -s  https://gpaisa.in/ads.txt | head -2             # served on the apex, not redirected
   curl -s  https://www.gpaisa.in/api/health                # {"status":"ok"}
   ```
7. Merge the branch into `main`, then re-point the agents at the new database.
8. Keep Vercel and Supabase running, untouched, for about a week as a rollback.

**Rollback:** point DNS back at Vercel. Any admin edits made on the VM in the meantime
must be re-entered in Supabase.

## 5. Operations

**Backups.** Install the nightly job with `crontab -e`:
```
30 21 * * * /opt/gpaisa/deploy/backup.sh >> /opt/gpaisa/deploy/backups/backup.log 2>&1
```
21:30 UTC is 03:00 IST. Run `./backup.sh` once by hand to confirm the upload works.

**IPO data sync.** `ipo-sync.sh` pulls Groww's upcoming, open and closed IPO feeds.
It fills only empty fields, moves `status` forward, records overall subscription, and adds
IPOs that aren't in the database yet as **drafts**. Open those in `/admin/ipos` to review
and publish them. It then records grey market premium (GMP) from Investorgain: one reading
per IPO per day (today's is refreshed each run), plus a one-time backfill of earlier days
the first time an IPO is matched. Only rows with source `Investorgain` are written, so GMP
entered in the admin is left alone. Last, it syncs NCD issues and rights issues from
Investorgain, and buybacks from Chittorgarh, the same way: empty fields filled, status moved
forward, and new issues from the last 30 days created — published when complete (NCD: dates +
coupon series; rights: price + ratio + a date; buyback: price + a date), otherwise as drafts. One-time setup:
```bash
./migrate.sh                                   # 0007–0010: Groww / Investorgain / Chittorgarh link columns
# put CRON_SECRET in .env (openssl rand -hex 32), then: docker compose up -d app
./ipo-sync.sh --dry-run                        # see what it would change; writes nothing
./ipo-sync.sh
```
Then add to `crontab -e`, every 30 min from 08:00 to 00:00 IST, every day (the grey market
trades evenings and weekends too):
```
*/30 2-18 * * * /opt/gpaisa/deploy/ipo-sync.sh >> /opt/gpaisa/deploy/ipo-sync.log 2>&1
```

**Restore** a backup:
```bash
gcloud storage cp gs://gpaisa-db-backups/gpaisa-<stamp>.dump backups/
docker compose exec -T postgres pg_restore -U gpaisa -d gpaisa --clean --if-exists < backups/gpaisa-<stamp>.dump
```

**Routine**

| Task | Command (in `/opt/gpaisa/deploy`) |
|---|---|
| Deploy new code | `./deploy.sh` |
| Apply a new migration | add `db/migrations/000N_*.sql`, then `./migrate.sh` |
| Logs | `docker compose logs -f app` (or `caddy`, `postgres`) |
| SQL shell | `docker compose exec postgres psql -U gpaisa -d gpaisa` |
| Restart everything | `docker compose restart` |

**Monitoring.** In Cloud Console go to Monitoring → Uptime checks and add an HTTPS check on
`https://www.gpaisa.in/api/health` that alerts your email. `/api/health` returns 503
when the database is unreachable.

**OS updates.** Run `sudo apt update && sudo apt upgrade` monthly and reboot when a kernel
update asks for it. Containers restart on their own.

**Optional CDN.** You can put Cloudflare's free plan in front for edge caching. Set SSL
mode to *Full (strict)* and leave "Always Use HTTPS" off, because Caddy already handles
it and needs plain HTTP for certificate renewals.

## Troubleshooting

- **Build fails with `failed to calculate checksum of ref … not found`:** the Docker
  build cache is corrupt. Run `docker builder prune -f` and deploy again.
- **Admin login fails after deploy:** `ADMIN_PASSWORD_HASH` in `.env` must be in single
  quotes. Compose otherwise reads each `$` as a variable reference.
