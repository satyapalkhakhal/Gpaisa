// Read-only, rate-limited HTTP client. Only GET is ever issued.
// Redirects are followed manually so every hop (status + Location) is recorded.

export class Fetcher {
    constructor({ userAgent, concurrency = 2, minDelayMs = 250, timeoutMs = 30000, maxRequests = 1000, maxBodyBytes = 3e6 }) {
        this.userAgent = userAgent;
        this.concurrency = concurrency;
        this.minDelayMs = minDelayMs;
        this.timeoutMs = timeoutMs;
        this.maxRequests = maxRequests;
        this.maxBodyBytes = maxBodyBytes;
        this.requestCount = 0;
        this.active = 0;
        this.queue = [];
        this.lastStart = 0;
        this.log = [];
    }

    budgetLeft() {
        return this.maxRequests - this.requestCount;
    }

    async _slot() {
        if (this.active < this.concurrency) {
            this.active++;
        } else {
            await new Promise((resolve) => this.queue.push(resolve));
        }
        // Space request starts at least minDelayMs apart, across all slots.
        const now = Date.now();
        const startAt = Math.max(now, this.lastStart + this.minDelayMs);
        this.lastStart = startAt;
        if (startAt > now) await new Promise((r) => setTimeout(r, startAt - now));
    }

    _release() {
        const next = this.queue.shift();
        if (next) next();
        else this.active--;
    }

    async _single(url, userAgent) {
        if (this.requestCount >= this.maxRequests) {
            return { url, error: 'request budget exhausted', status: 0 };
        }
        this.requestCount++;
        await this._slot();
        const started = Date.now();
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
            const res = await fetch(url, {
                method: 'GET',
                redirect: 'manual',
                signal: controller.signal,
                headers: {
                    'User-Agent': userAgent || this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-IN,en;q=0.9',
                },
            });
            const ttfbMs = Date.now() - started;
            const headers = Object.fromEntries(res.headers.entries());
            const type = headers['content-type'] || '';
            let body = '';
            let bodyBytes = 0;
            if (/(html|xml|text|json)/i.test(type) && !(res.status >= 300 && res.status < 400)) {
                const buf = Buffer.from(await res.arrayBuffer());
                bodyBytes = buf.length;
                body = buf.subarray(0, this.maxBodyBytes).toString('utf8');
            } else {
                await res.body?.cancel().catch(() => {});
            }
            const entry = { url, status: res.status, headers, body, bodyBytes, ttfbMs, totalMs: Date.now() - started };
            this.log.push({ at: new Date().toISOString(), method: 'GET', url, status: res.status, ms: entry.totalMs, ua: userAgent ? 'alt' : 'default' });
            return entry;
        } catch (err) {
            this.log.push({ at: new Date().toISOString(), method: 'GET', url, status: 0, error: String(err.message || err) });
            return { url, status: 0, error: String(err.cause?.code || err.message || err), headers: {}, body: '' };
        } finally {
            clearTimeout(timer);
            this._release();
        }
    }

    // First `maxBytes` of a binary resource (e.g. image header) via a Range request.
    async fetchBytes(url, maxBytes = 131072) {
        if (this.requestCount >= this.maxRequests) return { url, status: 0, error: 'request budget exhausted' };
        this.requestCount++;
        await this._slot();
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
            const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': this.userAgent, Range: `bytes=0-${maxBytes - 1}` } });
            const buf = Buffer.from(await res.arrayBuffer()).subarray(0, maxBytes);
            this.log.push({ at: new Date().toISOString(), method: 'GET(range)', url, status: res.status });
            return { url, status: res.status, bytes: buf, contentType: res.headers.get('content-type') || '' };
        } catch (err) {
            this.log.push({ at: new Date().toISOString(), method: 'GET(range)', url, status: 0, error: String(err.message || err) });
            return { url, status: 0, error: String(err.message || err) };
        } finally {
            clearTimeout(timer);
            this._release();
        }
    }

    // Follow up to maxHops redirects, returning the hop chain and the final response.
    async get(url, { userAgent, maxHops = 10 } = {}) {
        const chain = [];
        let current = url;
        const seen = new Set();
        for (let i = 0; i <= maxHops; i++) {
            const res = await this._single(current, userAgent);
            if (res.status >= 300 && res.status < 400 && res.headers.location) {
                const next = new URL(res.headers.location, current).toString();
                chain.push({ url: current, status: res.status, location: next });
                if (seen.has(next)) {
                    return { ...res, requestedUrl: url, finalUrl: next, chain, redirectLoop: true };
                }
                seen.add(current);
                current = next;
                continue;
            }
            return { ...res, requestedUrl: url, finalUrl: current, chain };
        }
        return { requestedUrl: url, finalUrl: current, chain, status: 0, error: 'too many redirects', headers: {}, body: '' };
    }
}
