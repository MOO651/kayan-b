"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { logout } from "@/lib/actions/auth";

type NavItem = { href: string; label: string; icon: string; adminOnly?: boolean };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { title: "الرئيسية", items: [
    { href: "/admin", label: "نظرة عامة", icon: "dashboard" },
    { href: "/admin/requests", label: "طلبات الاستشارة", icon: "inbox" },
  ]},
  { title: "إدارة الموقع", items: [
    { href: "/admin/services", label: "الخدمات القانونية", icon: "briefcase" },
    { href: "/admin/team", label: "المحامون والشركاء", icon: "users" },
    { href: "/admin/portfolio", label: "القضايا والإنجازات", icon: "award" },
    { href: "/admin/ventures", label: "المشروعات والشركات", icon: "briefcase" },
    { href: "/admin/articles", label: "المقالات والأخبار", icon: "article" },
    { href: "/admin/categories", label: "تصنيفات المقالات", icon: "file-text" },
  ]},
  { title: "تفاعل الزوار", items: [
    { href: "/admin/testimonials", label: "آراء العملاء", icon: "quote" },
    { href: "/admin/faq", label: "الأسئلة الشائعة", icon: "inbox" },
  ]},
  { title: "إدارة النظام", items: [
    { href: "/admin/media", label: "مكتبة الصور والملفات", icon: "image" },
    { href: "/admin/settings", label: "إعدادات وهوية الموقع", icon: "settings", adminOnly: true },
    { href: "/admin/users", label: "المستخدمون والصلاحيات", icon: "shield", adminOnly: true },
  ]},
];

const pageNames: Record<string, string> = {
  "/admin": "نظرة عامة",
  "/admin/requests": "طلبات الاستشارة",
  "/admin/services": "الخدمات القانونية",
  "/admin/team": "المحامون والشركاء",
  "/admin/ventures": "المشروعات والشركات",
  "/admin/portfolio": "القضايا والإنجازات",
  "/admin/articles": "المقالات والأخبار",
  "/admin/categories": "تصنيفات المقالات",
  "/admin/testimonials": "آراء العملاء",
  "/admin/faq": "الأسئلة الشائعة",
  "/admin/media": "مكتبة الوسائط",
  "/admin/settings": "إعدادات الموقع",
  "/admin/users": "المستخدمون والصلاحيات",
};

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const groups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.adminOnly || user.role === "ADMIN"),
    }))
    .filter((group) => group.items.length > 0);
  const activeTitle =
    pageNames[pathname] ??
    Object.entries(pageNames).find(([href]) => href !== "/admin" && pathname.startsWith(href))?.[1] ??
    "لوحة الإدارة";

  return (
    <div dir="rtl" className="min-h-svh bg-[#f5f4f0] text-[#17212b] lg:flex">
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-[286px] flex-col border-l border-white/10 bg-[#111d2a] text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-svh lg:translate-x-0 lg:shadow-none",
        sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
      )}>
        <div className="relative overflow-hidden border-b border-white/10 px-6 pb-6 pt-7">
          <div className="pointer-events-none absolute -left-12 -top-16 size-40 rounded-full border border-[#c6a66b]/20" />
          <div className="pointer-events-none absolute -left-5 -top-9 size-28 rounded-full border border-[#c6a66b]/10" />
          <div className="relative flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center border border-[#c6a66b]/70 bg-[#c6a66b]/10 font-serif text-2xl font-bold text-[#d8bd8c]">م</span>
            <div>
              <p className="font-serif text-xl font-semibold tracking-wide">مكي و باشميل</p>
              <p className="mt-1 text-[10px] tracking-[.24em] text-[#c6a66b]">LEGAL ADMINISTRATION</p>
            </div>
          </div>
          <div className="relative mt-6 border-r-2 border-[#c6a66b] pr-3">
            <p className="text-sm font-semibold text-white">مركز إدارة المكتب</p>
            <p className="mt-1 text-xs text-slate-400">مصر · المملكة العربية السعودية</p>
          </div>
        </div>

        <nav aria-label="القائمة الرئيسية" className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          {groups.map((group) => (
            <section key={group.title}>
              <p className="mb-2 px-3 text-[10px] font-bold tracking-[.18em] text-slate-500">{group.title}</p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all",
                          active
                            ? "bg-[#c6a66b] text-[#111d2a] shadow-lg shadow-black/10"
                            : "text-slate-300 hover:bg-white/[.06] hover:text-white",
                        )}
                      >
                        <span className={cn("flex size-8 items-center justify-center rounded-lg", active ? "bg-black/10" : "bg-white/[.05] text-[#c6a66b] group-hover:bg-white/10")}>
                          <Icon name={item.icon} className="size-4" />
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {active && <span className="size-1.5 rounded-full bg-[#111d2a]" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[.05] p-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c6a66b]/50 bg-[#c6a66b]/10 font-serif text-lg font-bold text-[#d8bd8c]">
              {user.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">{user.role === "ADMIN" ? "مدير النظام" : "محرر محتوى"}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/" target="_blank" className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-2 py-2.5 text-xs text-slate-300 transition hover:border-[#c6a66b] hover:text-[#d8bd8c]">
              <Icon name="eye" className="size-3.5" /> الموقع
            </Link>
            <form action={logout}>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-2 py-2.5 text-xs text-slate-300 transition hover:border-red-400/60 hover:text-red-300">
                <Icon name="logout" className="size-3.5" /> تسجيل الخروج
              </button>
            </form>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button type="button" aria-label="إغلاق القائمة" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-[#08111b]/65 backdrop-blur-sm lg:hidden" />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-[#17212b]/[.08] bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} aria-label="فتح القائمة" className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#17212b]/10 text-[#17212b] lg:hidden">
              <Icon name="menu" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[.16em] text-[#a1844e]">مكتب مكي و باشميل للمحاماة والاستشارات القانونية</p>
              <h1 className="mt-1 truncate font-serif text-lg font-semibold text-[#17212b] sm:text-xl">{activeTitle}</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold text-[#17212b]">{user.name}</span>
              <span className="mt-1 block text-[10px] text-slate-500">{user.role === "ADMIN" ? "مدير النظام" : "محرر"}</span>
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-[#f0e8d9] font-serif font-bold text-[#8e7040]">{user.name.charAt(0)}</span>
          </div>
        </header>
        <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
        <footer className="border-t border-[#17212b]/[.07] px-6 py-4 text-center text-[10px] text-slate-500">
          مكتب مكي و باشميل للمحاماة والاستشارات القانونية · لوحة إدارة المحتوى
        </footer>
      </div>
    </div>
  );
}
