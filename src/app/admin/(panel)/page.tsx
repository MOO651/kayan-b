import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  NEW: "جديد",
  IN_PROGRESS: "قيد المتابعة",
  CLOSED: "مغلق",
};

const statusStyles: Record<string, string> = {
  NEW: "bg-amber-50 text-amber-800 ring-amber-200",
  IN_PROGRESS: "bg-sky-50 text-sky-800 ring-sky-200",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default async function AdminDashboard() {\n  const currentUser = await requireUser();
  const [
    newRequests, totalRequests, publishedArticles, draftArticles,
    activeServices, recentRequests, lawyers, portfolio, faqs,
    testimonials, media, categories, ventures,
  ] = await Promise.all([
    db.consultationRequest.count({ where: { status: "NEW" } }),
    db.consultationRequest.count(),
    db.article.count({ where: { published: true } }),
    db.article.count({ where: { published: false } }),
    db.service.count({ where: { published: true } }),
    db.consultationRequest.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { service: true } }),
    db.lawyer.count({ where: { visible: true } }),
    db.portfolioItem.count({ where: { published: true } }),
    db.faq.count({ where: { published: true } }),
    db.testimonial.count({ where: { published: true } }),
    db.media.count(),
    db.category.count(),
    db.externalVenture.count({ where: { published: true } }),
  ]);

  const stats = [
    { label: "طلبات جديدة", value: newRequests, icon: "inbox", href: "/admin/requests", tone: "amber" },
    { label: "إجمالي الطلبات", value: totalRequests, icon: "clock", href: "/admin/requests", tone: "blue" },
    { label: "الخدمات القانونية", value: activeServices, icon: "briefcase", href: "/admin/services", tone: "gold" },
    { label: "أعضاء الفريق", value: lawyers, icon: "users", href: "/admin/team", tone: "violet" },
    { label: "القضايا والإنجازات", value: portfolio, icon: "award", href: "/admin/portfolio", tone: "green" },
    { label: "المقالات المنشورة", value: publishedArticles, icon: "article", href: "/admin/articles", tone: "blue" },
    { label: "المسودات", value: draftArticles, icon: "edit", href: "/admin/articles", tone: "slate" },
    { label: "مكتبة الوسائط", value: media, icon: "image", href: "/admin/media", tone: "violet" },
  ];

  const modules = [
    { label: "الخدمات القانونية", hint: "تعديل مجالات وخدمات المكتب", href: "/admin/services", icon: "briefcase", count: activeServices },
    { label: "المحامون والشركاء", hint: "السير الذاتية والبيانات والصور", href: "/admin/team", icon: "users", count: lawyers },
    { label: "القضايا والإنجازات", hint: "عرض الأعمال والمشروعات المختارة", href: "/admin/portfolio", icon: "award", count: portfolio },
    { label: "المشروعات والشركات", hint: "إدارة الروابط والمشروعات المرتبطة", href: "/admin/ventures", icon: "briefcase", count: ventures },
    { label: "المقالات القانونية", hint: "محتوى عربي وإنجليزي وتهيئة SEO", href: "/admin/articles", icon: "article", count: publishedArticles },
    { label: "تصنيفات المقالات", hint: "تنظيم المقالات حسب الموضوع", href: "/admin/categories", icon: "file-text", count: categories },
    { label: "آراء العملاء", hint: "الشهادات والتقييمات المعروضة", href: "/admin/testimonials", icon: "quote", count: testimonials },
    { label: "الأسئلة الشائعة", hint: "إجابات الزوار بالعربية والإنجليزية", href: "/admin/faq", icon: "inbox", count: faqs },
    { label: "مكتبة الوسائط", hint: "الصور والملفات المستخدمة بالموقع", href: "/admin/media", icon: "image", count: media },
    ...(currentUser.role === "ADMIN" ? [\n      { label: "إعدادات الموقع", hint: "الهوية والتواصل والصفحة الرئيسية", href: "/admin/settings", icon: "settings" },\n      { label: "المستخدمون والصلاحيات", hint: "إضافة مديرين ومحررين وإدارة الحسابات", href: "/admin/users", icon: "shield" },\n    ] : []),
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-[#111d2a] px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -left-12 -top-24 size-72 rounded-full border border-[#c6a66b]/20" />
        <div className="pointer-events-none absolute -left-1 top-0 size-48 rounded-full border border-[#c6a66b]/10" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[.22em] text-[#d4b77f]">AFaq · MANAGEMENT OVERVIEW</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">مرحباً بك في مركز الإدارة</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">من هنا تقدر تدير محتوى الموقع، تتابع طلبات الاستشارات، وتحدّث بيانات المكتب وفريق العمل في مصر والسعودية.</p>
          </div>
          <Link href="/admin/requests" className="inline-flex items-center gap-2 rounded-lg bg-[#c6a66b] px-5 py-3 text-sm font-bold text-[#111d2a] transition hover:bg-[#d8bd8c]">
            <Icon name="inbox" className="size-4" /> متابعة الطلبات
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#17212b]">ملخص الموقع</h2>
            <p className="mt-1 text-xs text-slate-500">أرقام مباشرة من قاعدة بيانات الموقع</p>
          </div>
          <span className="text-[10px] text-slate-500">تتحدث عند فتح لوحة الإدارة</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="group rounded-xl border border-[#17212b]/[.08] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c6a66b]/60 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#f2eee6] text-[#9a7b46] transition group-hover:bg-[#c6a66b] group-hover:text-[#111d2a]">
                  <Icon name={stat.icon} className="size-5" />
                </span>
                <span className="font-serif text-3xl font-semibold tabular-nums text-[#17212b]">{stat.value}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-700">{stat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="font-serif text-xl font-bold text-[#17212b]">إدارة أقسام الموقع</h2>
          <p className="mt-1 text-xs text-slate-500">كل قسم يفتح أدوات الإضافة والتعديل والنشر والحذف الخاصة به</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Link key={module.href} href={module.href} className="group flex items-start gap-4 rounded-xl border border-[#17212b]/[.08] bg-white p-4 shadow-sm transition hover:border-[#c6a66b]/60 hover:shadow-md">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f2eee6] text-[#9a7b46] group-hover:bg-[#c6a66b] group-hover:text-[#111d2a]">
                <Icon name={module.icon} className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#17212b]">{module.label}</span>
                  {module.count !== undefined && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{module.count}</span>}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{module.hint}</span>
              </span>
              <Icon name="chevron-left" className="mt-1 size-4 shrink-0 text-slate-300 transition group-hover:text-[#9a7b46]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#17212b]/[.08] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#17212b]/[.07] px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#17212b]">أحدث طلبات الاستشارة</h2>
            <p className="mt-1 text-xs text-slate-500">آخر الطلبات الواردة من زوار الموقع</p>
          </div>
          <Link href="/admin/requests" className="text-xs font-bold text-[#9a7b46] transition hover:text-[#17212b]">عرض كل الطلبات ←</Link>
        </div>
        {recentRequests.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Icon name="inbox" className="mx-auto size-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">لا توجد طلبات حتى الآن.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentRequests.map((request) => (
              <li key={request.id}>
                <Link href={`/admin/requests/${request.id}`} className="flex flex-wrap items-center gap-3 px-5 py-4 transition hover:bg-[#faf9f6] sm:px-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f2eee6] font-serif font-bold text-[#9a7b46]">{request.name.charAt(0)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-[#17212b]">{request.name}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{request.service?.titleAr ?? "استفسار عام"} · <span dir="ltr">{request.phone}</span></span>
                  </span>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold ring-1 ring-inset ${statusStyles[request.status] ?? statusStyles.NEW}`}>{statusLabels[request.status] ?? request.status}</span>
                  <span className="text-[11px] text-slate-400">{formatDate(request.createdAt, "ar")}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
