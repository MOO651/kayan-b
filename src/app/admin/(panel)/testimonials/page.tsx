import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  await requireUser();
  const items = await db.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          آراء العملاء
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          شهادات العملاء التي تظهر في الصفحة الرئيسية
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            رأي جديد
          </h2>
          <div className="mt-5">
            <TestimonialForm />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {items.length === 0 ? (
            <div className="border border-dashed border-charcoal-900/20 bg-white px-6 py-16 text-center">
              <Icon
                name="quote"
                className="mx-auto size-12 text-charcoal-600/30"
                strokeWidth={1}
              />
              <p className="mt-4 text-sm text-charcoal-600">
                لا توجد آراء بعد.
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
                  {item.name}
                  {item.roleAr ? ` — ${item.roleAr}` : ""}
                </summary>
                <div className="border-t border-charcoal-900/10 p-6">
                  <TestimonialForm
                    item={{
                      id: item.id,
                      name: item.name,
                      roleAr: item.roleAr,
                      roleEn: item.roleEn,
                      contentAr: item.contentAr,
                      contentEn: item.contentEn,
                      rating: item.rating,
                      photo: item.photo,
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
