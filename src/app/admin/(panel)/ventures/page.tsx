import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { VentureForm } from "@/components/admin/VentureForm";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function VenturesAdminPage() {
  await requireUser();
  const ventures = await db.externalVenture.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          المشروعات الأخرى
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          إدارة كروت «اكتشف مشروعاتنا الأخرى» التي تظهر في نهاية الموقع — كل
          مشروع موقع خارجي مستقل يفتح في نافذة جديدة.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            مشروع جديد
          </h2>
          <div className="mt-5">
            <VentureForm />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {ventures.length === 0 ? (
            <div className="border border-dashed border-charcoal-900/20 bg-white px-6 py-16 text-center">
              <Icon
                name="briefcase"
                className="mx-auto size-12 text-charcoal-600/30"
                strokeWidth={1}
              />
              <p className="mt-4 text-sm text-charcoal-600">
                لا توجد مشروعات بعد. أضف أول مشروع خارجي.
              </p>
            </div>
          ) : (
            ventures.map((venture) => (
              <details
                key={venture.id}
                className="border border-charcoal-900/10 bg-white"
              >
                <summary className="cursor-pointer list-none px-6 py-4 text-sm font-semibold text-charcoal-900 hover:text-brass-600">
                  {venture.published ? "" : "🚫 "}
                  {venture.nameAr}
                </summary>
                <div className="border-t border-charcoal-900/10 p-6">
                  <VentureForm
                    venture={{
                      id: venture.id,
                      nameAr: venture.nameAr,
                      nameEn: venture.nameEn,
                      descAr: venture.descAr,
                      descEn: venture.descEn,
                      url: venture.url,
                      logo: venture.logo,
                      image: venture.image,
                      order: venture.order,
                      published: venture.published,
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
