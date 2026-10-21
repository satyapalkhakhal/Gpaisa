import { articleFeedResponse } from '@/lib/rssFeed';

// Hindi RSS feed (see lib/rssFeed.ts). Linked from the Hindi hub and Hindi article pages.
export const revalidate = 3600;

export function GET() {
    return articleFeedResponse('hi');
}
