import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  await requireUser();
  const categories = await db.category.findMany({ orderBy: { nameAr: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          مقال جديد
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          أنشئ مقالاً أو رؤية قانونية جديدة
        </p>
      </div>
      <ArticleForm categories={categories} />
    </div>
  );
}
