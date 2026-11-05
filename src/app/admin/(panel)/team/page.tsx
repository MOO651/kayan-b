import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteLawyer } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function TeamAdminPage() {
  await requireUser();
  const lawyers = await db.lawyer.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal-900">
            فريقنا وشركاؤنا
          </h1>
          <p className="mt-1 text-sm text-charcoal-600">
            إدارة المحامين والمستشارين والشركاء وفريق التطوير الرقمي
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 bg-charcoal-900 px-5 py-2.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-brass-600"
        >
          <Icon name="plus" className="size-4" />
          إضافة عضو أو شريك
        </Link>
      </div>

      {lawyers.length === 0 ? (
        <div className="border border-dashed border-charcoal-900/20 bg-white px-6 py-16 text-center">
          <Icon
            name="users"
            className="mx-auto size-12 text-charcoal-600/30"
            strokeWidth={1}
          />
          <p className="mt-4 text-sm text-charcoal-600">
            لم يتم إضافة أعضاء بعد. أضف أول عضو في الفريق.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer) => {
            const isDigital =
              lawyer.category === "DIGITAL" || lawyer.role === "DIGITAL";
            const isPartner =
              lawyer.category === "PARTNER" || lawyer.role === "PARTNER";
            const categoryLabel = isDigital
              ? "التطوير والحلول الرقمية"
              : isPartner
                ? "شريك"
                : lawyer.category === "CONSULTANT" ||
                    lawyer.role === "CONSULTANT"
                  ? "مستشار قانوني"
                  : "الفريق القانوني";

            return (
              <div
                key={lawyer.id}
                className="flex items-center gap-4 border border-charcoal-900/10 bg-white p-4"
              >
                {lawyer.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lawyer.photo}
                    alt={lawyer.nameAr}
                    className="size-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-charcoal-900/5 font-display text-xl font-bold text-brass-600">
                    {lawyer.nameAr.charAt(0)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-charcoal-900">
                    {lawyer.nameAr}
                  </p>
                  <p className="truncate text-xs text-charcoal-600">
                    {lawyer.titleAr || "—"}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs">
                    <span
                      className={
                        isDigital
                          ? "inline-block bg-sky-100 px-1.5 py-0.5 text-[0.6rem] font-semibold text-sky-800"
                          : isPartner
                            ? "inline-block bg-violet-100 px-1.5 py-0.5 text-[0.6rem] font-semibold text-violet-800"
                            : "inline-block bg-brass-500/10 px-1.5 py-0.5 text-[0.6rem] font-semibold text-brass-700"
                      }
                    >
                      {categoryLabel}
                    </span>
                    {lawyer.visible ? (
                      <span className="font-semibold text-green-700">ظاهر</span>
                    ) : (
                      <span className="font-semibold text-charcoal-600">مخفي</span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <Link
                    href={`/admin/team/${lawyer.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-charcoal-700 transition-colors hover:text-brass-600"
                  >
                    <Icon name="edit" className="size-3.5" />
                    تعديل
                  </Link>
                  <DeleteButton
                    small
                    onDelete={async () => {
                      "use server";
                      await deleteLawyer(lawyer.id);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
