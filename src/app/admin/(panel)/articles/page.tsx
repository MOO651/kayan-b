import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteArticle } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ArticlesAdminPage() {
  await requireUser();
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal-900">
            المقالات
          </h1>
          <p className="mt-1 text-sm text-charcoal-600">
            إدارة المقالات والرؤى القانونية
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-charcoal-900 px-5 py-2.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-brass-600"
        >
          <Icon name="plus" className="size-4" />
          مقال جديد
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="border border-dashed border-charcoal-900/20 bg-white px-6 py-16 text-center">
          <Icon
            name="article"
            className="mx-auto size-12 text-charcoal-600/30"
            strokeWidth={1}
          />
          <p className="mt-4 text-sm text-charcoal-600">
            لا توجد مقالات بعد. أنشئ أول مقال.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-charcoal-900/10 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-charcoal-900/10 bg-ivory-100">
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                  المقال
                </th>
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                  التصنيف
                </th>
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                  الحالة
                </th>
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                  التاريخ
                </th>
                <th className="px-5 py-3 text-end text-xs font-semibold text-charcoal-600">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-900/10">
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="transition-colors hover:bg-ivory-100/60"
                >
                  <td className="px-5 py-3.5">
                    <span className="block max-w-xs truncate font-semibold text-charcoal-900">
                      {article.titleAr}
                    </span>
                    <span className="block text-xs text-charcoal-600" dir="ltr">
                      /articles/{article.slug}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-charcoal-600">
                    {article.category?.nameAr ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {article.published ? (
                      <span className="bg-green-600/10 px-2.5 py-1 text-xs font-semibold text-green-700">
                        منشور
                      </span>
                    ) : (
                      <span className="bg-charcoal-900/10 px-2.5 py-1 text-xs font-semibold text-charcoal-600">
                        مسودة
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-charcoal-600">
                    {article.publishedAt
                      ? formatDate(article.publishedAt, "ar")
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-charcoal-700 transition-colors hover:bg-brass-500/10 hover:text-brass-600"
                      >
                        <Icon name="edit" className="size-3.5" />
                        تعديل
                      </Link>
                      <DeleteButton
                        small
                        onDelete={async () => {
                          "use server";
                          await deleteArticle(article.id);
                        }}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
