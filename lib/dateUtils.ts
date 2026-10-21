/**
 * Returns today's date formatted as "DD Month YYYY" in IST timezone.
 * Example: "26 April 2026"
 *
 * This is used for SEO titles, H1 headings, and meta descriptions
 * on gold-rate and silver-rate pages.
 */
export function getTodayIST(): string {
    const now = new Date();
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
    }).format(now);
}

/**
 * Hindi equivalent of getTodayIST for /hi pages. Example: "22 अक्तूबर 2026"
 */
export function getTodayISTHindi(): string {
    return new Intl.DateTimeFormat('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
    }).format(new Date());
}
