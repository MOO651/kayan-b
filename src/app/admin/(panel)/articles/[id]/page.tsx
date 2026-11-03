import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const [article, categories] = await Promise.all([
    db.article.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { nameAr: "asc" } }),
  ]);
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          تعديل: {article.titleAr}
        </h1>
        <p className="mt-1 text-sm text-charcoal-600" dir="ltr">
          /articles/{article.slug}
        </p>
      </div>
      <ArticleForm article={article} categories={categories} />
    </div>
  );
}
