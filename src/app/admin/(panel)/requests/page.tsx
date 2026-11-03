import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Icon } from "@/components/ui/Icon";
import { formatDate, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  NEW: "جديد",
  IN_PROGRESS: "قيد المتابعة",
  CLOSED: "مغلق",
};

const statusColors: Record<string, string> = {
  NEW: "bg-brass-500/15 text-brass-600",
  IN_PROGRESS: "bg-blue-600/10 text-blue-700",
  CLOSED: "bg-charcoal-900/10 text-charcoal-600",
};

const contactLabels: Record<string, string> = {
  phone: "مكالمة هاتفية",
  email: "بريد إلكتروني",
  whatsapp: "واتساب",
};

export default async function RequestsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireUser();
  const { status, q } = await searchParams;
  const query = (q ?? "").trim();

  const requests = await db.consultationRequest.findMany({
    where: {
      ...(status && statusLabels[status] ? { status } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { phone: { contains: query } },
              { email: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { service: true },
  });

  const counts = await db.consultationRequest.groupBy({
    by: ["status"],
    _count: true,
  });
  const countFor = (s: string) =>
    counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          طلبات الاستشارة
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          طلبات العملاء الواردة من الموقع — تعامل معها بسرية تامة
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form method="get" className="relative">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="بحث بالاسم أو الهاتف أو البريد…"
            className="w-72 border border-charcoal-900/15 bg-white py-2.5 ps-10 pe-4 text-sm focus:border-brass-500 focus:outline-none"
          />
          <Icon
            name="search"
            className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-charcoal-600/60"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          {[
            { key: "", label: `الكل (${counts.reduce((a, c) => a + c._count, 0)})` },
            { key: "NEW", label: `جديد (${countFor("NEW")})` },
            { key: "IN_PROGRESS", label: `قيد المتابعة (${countFor("IN_PROGRESS")})` },
            { key: "CLOSED", label: `مغلق (${countFor("CLOSED")})` },
          ].map((filter) => (
            <Link
              key={filter.key}
              href={
                filter.key
                  ? `/admin/requests?status=${filter.key}${query ? `&q=${encodeURIComponent(query)}` : ""}`
                  : `/admin/requests${query ? `?q=${encodeURIComponent(query)}` : ""}`
              }
              className={cn(
                "border px-4 py-2 text-xs font-semibold transition-colors",
                (status ?? "") === filter.key
                  ? "border-brass-500 bg-brass-500 text-ink-950"
                  : "border-charcoal-900/15 text-charcoal-700 hover:border-brass-500",
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="border border-dashed border-charcoal-900/20 bg-white px-6 py-16 text-center">
          <Icon
            name="inbox"
            className="mx-auto size-12 text-charcoal-600/30"
            strokeWidth={1}
          />
          <p className="mt-4 text-sm text-charcoal-600">
            لا توجد طلبات مطابقة.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-charcoal-900/10 bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-charcoal-900/10 bg-ivory-100">
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">العميل</th>
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">المجال</th>
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">طريقة التواصل</th>
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">الحالة</th>
                <th className="px-5 py-3 text-start text-xs font-semibold text-charcoal-600">التاريخ</th>
                <th className="px-5 py-3 text-end text-xs font-semibold text-charcoal-600">عرض</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-900/10">
              {requests.map((request) => (
                <tr key={request.id} className="transition-colors hover:bg-ivory-100/60">
                  <td className="px-5 py-3.5">
                    <span className="block font-semibold text-charcoal-900">
                      {request.name}
                    </span>
                    <span className="block text-xs text-charcoal-600" dir="ltr">
                      {request.phone}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-charcoal-600">
                    {request.service?.titleAr ?? "استفسار عام"}
                  </td>
                  <td className="px-5 py-3.5 text-charcoal-600">
                    {contactLabels[request.preferredContact] ?? request.preferredContact}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 text-xs font-semibold ${statusColors[request.status]}`}>
                      {statusLabels[request.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-charcoal-600">
                    {formatDate(request.createdAt, "ar")}
                  </td>
                  <td className="px-5 py-3.5 text-end">
                    <Link
                      href={`/admin/requests/${request.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-charcoal-700 transition-colors hover:bg-brass-500/10 hover:text-brass-600"
                    >
                      <Icon name="eye" className="size-3.5" />
                      التفاصيل
                    </Link>
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
