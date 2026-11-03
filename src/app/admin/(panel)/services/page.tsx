import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteService } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  await requireUser();
  const services = await db.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal-900">
            المجالات القانونية
          </h1>
          <p className="mt-1 text-sm text-charcoal-600">
            إدارة مجالات الممارسة المعروضة على الموقع
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-charcoal-900 px-5 py-2.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-brass-600"
        >
          <Icon name="plus" className="size-4" />
          إضافة مجال
        </Link>
      </div>

      <div className="overflow-x-auto border border-charcoal-900/10 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-charcoal-900/10 bg-ivory-100 text-start">
              <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                الترتيب
              </th>
              <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                المجال
              </th>
              <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                الرابط
              </th>
              <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">
                الحالة
              </th>
              <th className="px-5 py-3 text-end text-xs font-semibold text-charcoal-600">
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-900/10">
            {services.map((service) => (
              <tr key={service.id} className="transition-colors hover:bg-ivory-100/60">
                <td className="px-5 py-3.5 text-charcoal-600">{service.order}</td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-3 font-semibold text-charcoal-900">
                    <Icon
                      name={service.icon || "scale"}
                      className="size-4 text-brass-600"
                    />
                    {service.titleAr}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-charcoal-600" dir="ltr">
                  <span className="text-xs">/services/{service.slug}</span>
                </td>
                <td className="px-5 py-3.5">
                  {service.published ? (
                    <span className="bg-green-600/10 px-2.5 py-1 text-xs font-semibold text-green-700">
                      منشور
                    </span>
                  ) : (
                    <span className="bg-charcoal-900/10 px-2.5 py-1 text-xs font-semibold text-charcoal-600">
                      مخفي
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-charcoal-700 transition-colors hover:bg-brass-500/10 hover:text-brass-600"
                    >
                      <Icon name="edit" className="size-3.5" />
                      تعديل
                    </Link>
                    <DeleteButton
                      small
                      onDelete={async () => {
                        "use server";
                        await deleteService(service.id);
                      }}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
