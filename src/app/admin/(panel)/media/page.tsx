import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteMedia } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { CopyPathButton } from "@/components/admin/CopyPathButton";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  await requireUser();
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          مكتبة الوسائط
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          رفع وإدارة صور الموقع — تُحسَّن الصور تلقائياً عند الرفع
        </p>
      </div>

      <div className="border border-charcoal-900/10 bg-white p-6">
        <MediaUploader />
      </div>

      {media.length === 0 ? (
        <div className="border border-dashed border-charcoal-900/20 bg-white px-6 py-16 text-center">
          <Icon
            name="image"
            className="mx-auto size-12 text-charcoal-600/30"
            strokeWidth={1}
          />
          <p className="mt-4 text-sm text-charcoal-600">
            لا توجد وسائط بعد. ارفع أول صورة.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group border border-charcoal-900/10 bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.path}
                  alt={item.alt || item.filename}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-charcoal-900">
                  {item.filename}
                </p>
                <p className="mt-0.5 truncate text-[0.65rem] text-charcoal-600" dir="ltr">
                  {item.path}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <CopyPathButton path={item.path} />
                  <DeleteButton
                    small
                    label=""
                    confirmMessage="سيتم حذف الصورة نهائياً. متابعة؟"
                    onDelete={async () => {
                      "use server";
                      await deleteMedia(item.id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
