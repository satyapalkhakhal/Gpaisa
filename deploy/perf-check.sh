#!/usr/bin/env bash
# Measures gpaisa.in the same way every time, so runs before/after a change (e.g. adding
# Cloudflare) can be compared side by side. Run from your laptop, not the server.
#   ./perf-check.sh [label]        → deploy/perf-results/<date>-<label>.txt
# Needs curl and jq. PageSpeed numbers come from Google's servers (outside India); the
# keyless quota is shared and often exhausted, so set PSI_API_KEY (free: Google Cloud
# console → enable "PageSpeed Insights API" → Credentials → API key).
set -uo pipefail
cd "$(dirname "$0")"

SITE=https://www.gpaisa.in
RUNS=5
LABEL=${1:-run}
mkdir -p perf-results
OUT=perf-results/$(date +%Y%m%d-%H%M)-$LABEL.txt

PAGES=(/ /news /ipo /ipo/nova-industries-ipo /gold-rate /calculator/sip /articles/epfo-credits-8-25-percent-epf-interest)

# Static assets referenced by the homepage: one JS chunk, the CSS, one optimized image.
HOME_HTML=$(curl -s "$SITE/")
JS=$(grep -oE '/_next/static/chunks/[^"]+\.js' <<<"$HOME_HTML" | head -1)
CSS=$(grep -oE '/_next/static/css/[^"]+\.css' <<<"$HOME_HTML" | head -1)
IMG=$(grep -oE '/_next/image\?url=[^" ]+' <<<"$HOME_HTML" | head -1 | sed 's/&amp;/\&/g')
ASSETS=("$JS" "$CSS" "$IMG")

median() { sort -n | awk '{a[NR]=$1} END {print (NR % 2) ? a[(NR+1)/2] : (a[NR/2] + a[NR/2+1]) / 2}'; }
ms() { awk '{printf "%.0f", $1 * 1000}'; }

measure() {   # prints one table row for a path: medians over $RUNS fresh connections
    local path=$1 dns=() conn=() tls=() ttfb=() total=() last
    for _ in $(seq 1 "$RUNS"); do
        last=$(curl -s -o /dev/null -H 'Accept-Encoding: br, gzip' \
            -w '%{time_namelookup} %{time_connect} %{time_appconnect} %{time_starttransfer} %{time_total} %{size_download} %{http_code} %{http_version} %header{content-encoding}|%header{server}|%header{cf-cache-status}' \
            "$SITE$path")
        read -r d c t f a _ <<<"$last"
        dns+=("$d"); conn+=("$c"); tls+=("$t"); ttfb+=("$f"); total+=("$a")
    done
    read -r _ _ _ _ _ size code ver rest <<<"$last"
    IFS='|' read -r enc server cache <<<"$rest"
    printf '%-48s %4s %6s %6s %6s %6s %6s %8s  %-5s %-4s %-8s %s\n' "${path:0:48}" "$code" \
        "$(printf '%s\n' "${dns[@]}" | median | ms)" "$(printf '%s\n' "${conn[@]}" | median | ms)" \
        "$(printf '%s\n' "${tls[@]}" | median | ms)" "$(printf '%s\n' "${ttfb[@]}" | median | ms)" \
        "$(printf '%s\n' "${total[@]}" | median | ms)" "$size" "${enc:--}" "$ver" "${server:--}" "${cache:--}"
}

pagespeed() {   # Lighthouse lab metrics from Google's PageSpeed Insights API
    local url=$1 strategy=$2 json
    json=$(curl -s --max-time 120 "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$url&strategy=$strategy&category=performance${PSI_API_KEY:+&key=$PSI_API_KEY}")
    jq -r --arg s "$strategy" --arg u "$url" '
        if .lighthouseResult then
          .lighthouseResult.audits as $a |
          "\($s | .[0:7] | . + (" " * (8 - length)))\($u | sub("https://www.gpaisa.in"; "") | if . == "" then "/" else . end | .[0:34] | . + (" " * (35 - length)))" +
          "score \((.lighthouseResult.categories.performance.score * 100) | round)  " +
          "TTFB \($a["server-response-time"].numericValue | round)ms  " +
          "FCP \($a["first-contentful-paint"].displayValue)  LCP \($a["largest-contentful-paint"].displayValue)  " +
          "TBT \($a["total-blocking-time"].displayValue)  CLS \($a["cumulative-layout-shift"].displayValue)  " +
          "page \(($a["total-byte-weight"].numericValue / 1024) | round)KB"
        else "\($s) \($u)  PageSpeed error: \(.error.message // "no result")" end' <<<"$json"
}

{
    echo "gpaisa.in performance check — $(date '+%F %T %Z') — label: $LABEL"
    echo "DNS: $(dig +short A gpaisa.in | tr '\n' ' ')  NS: $(dig +short NS gpaisa.in | head -1)"
    echo
    echo "== Network timings from this machine (median of $RUNS, ms; size in bytes) =="
    printf '%-48s %4s %6s %6s %6s %6s %6s %8s  %-5s %-4s %-8s %s\n' PATH CODE DNS CONN TLS TTFB TOTAL SIZE ENC HTTP SERVER CF-CACHE
    for p in "${PAGES[@]}"; do measure "$p"; done
    echo "-- static assets --"
    for p in "${ASSETS[@]}"; do [ -n "$p" ] && measure "$p"; done
    echo
    echo "== Google PageSpeed (lab test from Google's servers) =="
    for p in / /ipo/nova-industries-ipo /articles/epfo-credits-8-25-percent-epf-interest; do
        for s in mobile desktop; do pagespeed "$SITE$p" "$s"; done
    done
} | tee "$OUT"
echo
echo "Saved: deploy/$OUT"
