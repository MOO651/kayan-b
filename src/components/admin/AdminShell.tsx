"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { logout } from "@/lib/actions/auth";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "الرئيسية",
    items: [
      { href: "/admin", label: "لوحة المعلومات", icon: "dashboard" },
      { href: "/admin/requests", label: "طلبات الاستشارة", icon: "inbox" },
    ],
  },
  {
    title: "المحتوى",
    items: [
      { href: "/admin/services", label: "المجالات القانونية", icon: "briefcase" },
      { href: "/admin/team", label: "فريق العمل", icon: "users" },
      { href: "/admin/articles", label: "المقالات", icon: "article" },
      { href: "/admin/categories", label: "التصنيفات", icon: "file-text" },
    ],
  },
  {
    title: "النظام",
    items: [
      { href: "/admin/media", label: "مكتبة الوسائط", icon: "image" },
      { href: "/admin/settings", label: "إعدادات الموقع", icon: "settings", adminOnly: true },
      { href: "/admin/users", label: "المستخدمون", icon: "shield", adminOnly: true },
    ],
  },
];

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
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => !item.adminOnly || user.role === "ADMIN"),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex min-h-svh">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-40 flex w-64 flex-col bg-ink-950 text-ivory-100 transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full rtl:translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-ivory-50/10 px-6 py-5">
          <span className="relative flex size-9 shrink-0 items-center justify-center before:absolute before:inset-0 before:rotate-45 before:border before:border-brass-500">
            <span className="font-display text-base font-bold text-brass-400">
              ك
            </span>
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-tight">
              كيان باشميل
            </p>
            <p className="text-[0.6rem] tracking-[0.2em] text-brass-400 uppercase">
              لوحة التحكم
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.title} className="mb-5 last:mb-0">
              <p className="px-4 pb-2 text-[0.6rem] font-semibold tracking-[0.2em] text-ivory-100/40 uppercase">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-brass-500/15 text-brass-300"
                            : "text-ivory-100/70 hover:bg-ivory-50/5 hover:text-ivory-50",
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon name={item.icon} className="size-4.5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-ivory-50/10 p-4">
          <div className="flex items-center gap-3 px-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-brass-500/20 font-display text-sm font-bold text-brass-300">
              {user.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-ivory-100/50">
                {user.role === "ADMIN" ? "مدير" : "محرر"}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex flex-1 items-center justify-center gap-2 border border-ivory-50/15 px-3 py-2 text-xs text-ivory-100/70 transition-colors hover:border-brass-400 hover:text-brass-300"
            >
              <Icon name="eye" className="size-3.5" />
              عرض الموقع
            </Link>
            <form action={logout} className="flex-1">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 border border-ivory-50/15 px-3 py-2 text-xs text-ivory-100/70 transition-colors hover:border-red-400 hover:text-red-300"
              >
                <Icon name="logout" className="size-3.5" />
                خروج
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-ink-950/60 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-charcoal-900/10 bg-ivory-100/95 px-5 py-3 backdrop-blur-sm lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="فتح القائمة"
            className="flex size-10 items-center justify-center border border-charcoal-900/15 text-charcoal-800 lg:hidden"
          >
            <Icon name="menu" />
          </button>
          <p className="text-sm text-charcoal-600">
            مرحباً، <span className="font-semibold">{user.name}</span>
          </p>
        </header>
        <main className="flex-1 px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
