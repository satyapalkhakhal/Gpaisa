export function slugify(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .normalize('NFKD')
        .replace(/\p{Mark}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 200);
}
