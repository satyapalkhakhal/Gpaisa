export interface ArticleFormInput {
    title?: string;
    category?: string;
    excerpt?: string;
    content?: string;
    status?: string;
}

export function validateArticleInput(input: ArticleFormInput): string[] {
    const errors: string[] = [];

    if (!input.title?.trim()) errors.push('Title is required.');
    else if (input.title.length > 300) errors.push('Title must be under 300 characters.');

    if (!input.category?.trim()) errors.push('Category is required.');

    if (!input.excerpt?.trim()) errors.push('Excerpt is required.');
    else if (input.excerpt.length > 500) errors.push('Excerpt must be under 500 characters.');

    if (!input.content?.trim() || input.content === '<p></p>') errors.push('Content is required.');

    if (input.status && !['draft', 'published'].includes(input.status)) {
        errors.push('Status must be draft or published.');
    }

    return errors;
}
