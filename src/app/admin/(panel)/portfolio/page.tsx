import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PortfolioItemForm } from "@/components/admin/PortfolioItemForm";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function PortfolioAdminPage() {
  await requireUser();
  const items = await db.portfolioItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          بورتفوليو المكتب
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          إنجازات وقضايا رئيسية — تظهر في الصفحة الرئيسية وصفحة البورتفوليو
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            عنصر جديد
          </h2>
          <div className="mt-5">
            <PortfolioItemForm />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {items.length === 0 ? (
            <div className="border border-dashed border-charcoal-900/20 bg-white px-6 py-16 text-center">
              <Icon
                name="briefcase"
                className="mx-auto size-12 text-charcoal-600/30"
                strokeWidth={1}
              />
              <p className="mt-4 text-sm text-charcoal-600">
                لا توجد عناصر بعد.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <details
                key={item.id}
                className="border border-charcoal-900/10 bg-white"
              >
                <summary className="cursor-pointer list-none px-6 py-4 text-sm font-semibold text-charcoal-900 hover:text-brass-600">
                  {item.published ? "" : "🚫 "}
                  {item.titleAr}
                </summary>
                <div className="border-t border-charcoal-900/10 p-6">
                  <PortfolioItemForm
                    item={{
                      id: item.id,
                      titleAr: item.titleAr,
                      titleEn: item.titleEn,
                      summaryAr: item.summaryAr,
                      summaryEn: item.summaryEn,
                      outcomeAr: item.outcomeAr,
                      outcomeEn: item.outcomeEn,
                      image: item.image,
                      tags: item.tags,
                      order: item.order,
                      published: item.published,
                    }}
                  />
                </div>
              </details>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
