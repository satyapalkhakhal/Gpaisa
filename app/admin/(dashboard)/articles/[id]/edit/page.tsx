import { notFound } from 'next/navigation';
import { getArticleByIdAdmin } from '@/lib/supabaseAdmin';
import ArticleForm from '@/components/admin/ArticleForm';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticleByIdAdmin(id);
    if (!article) notFound();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Article</h1>
            <ArticleForm mode="edit" initialArticle={article} />
        </div>
    );
}
