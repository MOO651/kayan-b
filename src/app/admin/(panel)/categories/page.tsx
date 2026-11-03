import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteCategory } from "@/lib/actions/admin";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function CategoriesAdminPage() {
  await requireUser();
  const categories = await db.category.findMany({
    orderBy: { nameAr: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          التصنيفات
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          تصنيفات المقالات والرؤى القانونية
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            إضافة تصنيف
          </h2>
          <div className="mt-5">
            <CategoryForm />
          </div>
        </div>

        <div className="border border-charcoal-900/10 bg-white lg:col-span-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-900/10 bg-ivory-100">
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                  الاسم
                </th>
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                  الرابط
                </th>
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                  المقالات
                </th>
                <th className="px-5 py-3 text-end text-xs font-semibold text-charcoal-600">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-900/10">
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-charcoal-600"
                  >
                    لا توجد تصنيفات بعد.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-5 py-3.5 font-semibold text-charcoal-900">
                      {category.nameAr}
                      {category.nameEn && (
                        <span className="block text-xs font-normal text-charcoal-600" dir="ltr">
                          {category.nameEn}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-charcoal-600" dir="ltr">
                      {category.slug}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal-600">
                      {category._count.articles}
                    </td>
                    <td className="px-5 py-3.5 text-end">
                      <DeleteButton
                        small
                        confirmMessage="حذف التصنيف لن يحذف مقالاته. متابعة؟"
                        onDelete={async () => {
                          "use server";
                          await deleteCategory(category.id);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
