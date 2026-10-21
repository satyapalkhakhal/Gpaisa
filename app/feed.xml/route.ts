import { articleFeedResponse } from '@/lib/rssFeed';

// English RSS feed (see lib/rssFeed.ts). Linked from the root layout.
export const revalidate = 3600;

export function GET() {
    return articleFeedResponse('en');
}
