import { LoginForm } from "@/components/admin/LoginForm";
import { Icon } from "@/components/ui/Icon";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center bg-ink-950 px-5">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_30%,rgba(176,141,87,0.12),transparent)]"
      />
      <div className="relative w-full max-w-md">
        <div className="border border-ivory-50/10 bg-charcoal-900 p-10">
          <div className="flex flex-col items-center text-center">
            <span className="relative flex size-14 items-center justify-center before:absolute before:inset-0 before:rotate-45 before:border before:border-brass-500">
              <span className="font-display text-2xl font-bold text-brass-400">
                ك
              </span>
            </span>
            <h1 className="mt-6 font-display text-2xl font-bold text-ivory-50">
              لوحة التحكم
            </h1>
            <p className="mt-2 text-sm text-ivory-100/60">
              تسجيل الدخول لإدارة موقع مكي و باشميل
            </p>
          </div>
          <div className="mt-8">
            <LoginForm next={next ?? "/admin"} />
          </div>
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ivory-100/40">
          <Icon name="shield" className="size-4" />
          منطقة محمية — للمسؤولين فقط
        </p>
      </div>
    </main>
  );
}
