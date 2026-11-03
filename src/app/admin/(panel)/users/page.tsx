import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteUser } from "@/lib/actions/admin";
import { UserForm, PasswordForm } from "@/components/admin/UserForms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const current = await requireAdmin();
  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          المستخدمون
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          إدارة حسابات لوحة التحكم والصلاحيات
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            إضافة مستخدم
          </h2>
          <div className="mt-5">
            <UserForm />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap items-center gap-4 border border-charcoal-900/10 bg-white p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brass-500/15 font-display text-lg font-bold text-brass-600">
                {user.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-charcoal-900">
                  {user.name}
                  {user.id === current.id && (
                    <span className="ms-2 text-xs font-normal text-charcoal-600">
                      (أنت)
                    </span>
                  )}
                </p>
                <p className="text-xs text-charcoal-600" dir="ltr">
                  {user.email}
                </p>
                <p className="mt-1 text-xs text-charcoal-600">
                  {user.role === "ADMIN" ? "مدير — صلاحيات كاملة" : "محرر — إدارة المحتوى فقط"}{" "}
                  · انضم {formatDate(user.createdAt, "ar")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <details className="relative">
                  <summary className="cursor-pointer list-none px-3 py-1.5 text-xs font-semibold text-charcoal-700 transition-colors hover:text-brass-600">
                    تغيير كلمة المرور
                  </summary>
                  <div className="absolute end-0 top-full z-10 mt-2 w-72 border border-charcoal-900/10 bg-white p-4 shadow-lg">
                    <PasswordForm userId={user.id} />
                  </div>
                </details>
                {user.id !== current.id && (
                  <DeleteButton
                    small
                    confirmMessage={`سيتم حذف حساب ${user.name} نهائياً. متابعة؟`}
                    onDelete={async () => {
                      "use server";
                      await deleteUser(user.id);
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
