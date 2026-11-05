import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser, getCurrentUser } from "@/lib/auth";
import { deleteRequest } from "@/lib/actions/admin";
import { RequestStatusForm } from "@/components/admin/RequestStatusForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const contactLabels: Record<string, string> = {
  phone: "مكالمة هاتفية",
  email: "بريد إلكتروني",
  whatsapp: "واتساب",
};

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const user = await getCurrentUser();
  const { id } = await params;
  const request = await db.consultationRequest.findUnique({
    where: { id },
    include: { service: true },
  });
  if (!request) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brass-600 transition-colors hover:text-brass-500"
          >
            <Icon name="arrow-left" className="size-4" />
            العودة إلى الطلبات
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold text-charcoal-900">
            طلب من: {request.name}
          </h1>
          <p className="mt-1 text-sm text-charcoal-600">
            {formatDate(request.createdAt, "ar")}
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <DeleteButton
            confirmMessage="سيتم حذف هذا الطلب نهائياً. متابعة؟"
            onDelete={async () => {
              "use server";
              await deleteRequest(request.id);
            }}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border border-charcoal-900/10 bg-white p-6">
            <h2 className="text-sm font-semibold tracking-wider text-brass-600 uppercase">
              وصف الحالة
            </h2>
            <p className="mt-4 leading-loose whitespace-pre-wrap text-charcoal-800">
              {request.message}
            </p>
          </div>

          {request.attachmentName && (
            <div className="border border-charcoal-900/10 bg-white p-6">
              <h2 className="text-sm font-semibold tracking-wider text-brass-600 uppercase">
                المرفق
              </h2>
              <a
                href={`/api/admin/attachments/${request.id}`}
                className="mt-4 inline-flex items-center gap-3 border border-charcoal-900/15 px-4 py-3 text-sm font-medium text-charcoal-800 transition-colors hover:border-brass-500 hover:text-brass-600"
              >
                <Icon name="paperclip" className="size-4 text-brass-600" />
                {request.attachmentName}
                <span className="text-xs text-charcoal-600">
                  {request.attachmentMime.includes("pdf") ? "PDF" : "صورة"}
                </span>
              </a>
            </div>
          )}

          <div className="border border-charcoal-900/10 bg-white p-6">
            <h2 className="text-sm font-semibold tracking-wider text-brass-600 uppercase">
              بيانات التواصل
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-charcoal-600">الهاتف</dt>
                <dd className="mt-1 font-semibold" dir="ltr">
                  <a href={`tel:${request.phone}`} className="text-charcoal-900 hover:text-brass-600">
                    {request.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-600">البريد الإلكتروني</dt>
                <dd className="mt-1 font-semibold">
                  {request.email ? (
                    <a href={`mailto:${request.email}`} className="text-charcoal-900 hover:text-brass-600">
                      {request.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-600">الدولة</dt>
                <dd className="mt-1 font-semibold text-charcoal-900">{request.country || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-600">الموعد المفضل</dt>
                <dd className="mt-1 font-semibold text-charcoal-900">{request.preferredDate || "غير محدد"}</dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-600">المجال القانوني</dt>
                <dd className="mt-1 font-semibold text-charcoal-900">
                  {request.service?.titleAr ?? "استفسار عام"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-600">طريقة التواصل المفضلة</dt>
                <dd className="mt-1 font-semibold text-charcoal-900">
                  {contactLabels[request.preferredContact] ?? request.preferredContact}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="border border-charcoal-900/10 bg-white p-6">
          <h2 className="text-sm font-semibold tracking-wider text-brass-600 uppercase">
            إدارة الطلب
          </h2>
          <div className="mt-5">
            <RequestStatusForm
              id={request.id}
              status={request.status}
              notes={request.notes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
