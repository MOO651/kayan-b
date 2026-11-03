import Link from "next/link";
import { db } from "@/lib/db";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/utils";

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

export default async function AdminDashboard() {
  const [
    newRequests,
    totalRequests,
    publishedArticles,
    activeServices,
    teamMembers,
    recentRequests,
  ] = await Promise.all([
    db.consultationRequest.count({ where: { status: "NEW" } }),
    db.consultationRequest.count(),
    db.article.count({ where: { published: true } }),
    db.service.count({ where: { published: true } }),
    db.lawyer.count({ where: { visible: true } }),
    db.consultationRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { service: true },
    }),
  ]);

  const stats = [
    { label: "طلبات جديدة", value: newRequests, icon: "inbox", href: "/admin/requests" },
    { label: "إجمالي الطلبات", value: totalRequests, icon: "clock", href: "/admin/requests" },
    { label: "مقالات منشورة", value: publishedArticles, icon: "article", href: "/admin/articles" },
    { label: "مجالات نشطة", value: activeServices, icon: "briefcase", href: "/admin/services" },
    { label: "أعضاء الفريق", value: teamMembers, icon: "users", href: "/admin/team" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          لوحة المعلومات
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          نظرة عامة على محتوى الموقع وطلبات الاستشارة
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-charcoal-900/10 bg-white p-5 transition-all hover:border-brass-500/50"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center bg-brass-500/10 text-brass-600 transition-colors group-hover:bg-brass-500 group-hover:text-ink-950">
                <Icon name={stat.icon} className="size-5" />
              </span>
              <span className="font-display text-3xl font-bold text-charcoal-900">
                {stat.value}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-charcoal-600">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="border border-charcoal-900/10 bg-white">
        <div className="flex items-center justify-between border-b border-charcoal-900/10 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-charcoal-900">
            أحدث طلبات الاستشارة
          </h2>
          <Link
            href="/admin/requests"
            className="text-xs font-semibold text-brass-600 transition-colors hover:text-brass-500"
          >
            عرض الكل ←
          </Link>
        </div>
        {recentRequests.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-charcoal-600">
            لا توجد طلبات حتى الآن.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal-900/10">
            {recentRequests.map((request) => (
              <li key={request.id}>
                <Link
                  href={`/admin/requests/${request.id}`}
                  className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-ivory-100"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900/5 font-display text-sm font-bold text-charcoal-700">
                    {request.name.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-charcoal-900">
                      {request.name}
                    </span>
                    <span className="block truncate text-xs text-charcoal-600">
                      {request.service?.titleAr ?? "استفسار عام"} ·{" "}
                      <span dir="ltr">{request.phone}</span>
                    </span>
                  </span>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold ${statusColors[request.status]}`}
                  >
                    {statusLabels[request.status]}
                  </span>
                  <span className="text-xs text-charcoal-600/70">
                    {formatDate(request.createdAt, "ar")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
