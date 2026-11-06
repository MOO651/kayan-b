import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { FaqForm } from "@/components/admin/FaqForm";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  await requireUser();
  const faqs = await db.faq.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          الأسئلة الشائعة
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          أسئلة وأجوبة تظهر في الصفحة الرئيسية وتُفهرس في جوجل
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="border border-charcoal-900/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal-900">
            سؤال جديد
          </h2>
          <div className="mt-5">
            <FaqForm />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {faqs.length === 0 ? (
            <div className="border border-dashed border-charcoal-900/20 bg-white px-6 py-16 text-center">
              <Icon
                name="file-text"
                className="mx-auto size-12 text-charcoal-600/30"
                strokeWidth={1}
              />
              <p className="mt-4 text-sm text-charcoal-600">
                لا توجد أسئلة بعد.
              </p>
            </div>
          ) : (
            faqs.map((faq, i) => (
              <details
                key={faq.id}
                className="border border-charcoal-900/10 bg-white"
                open={i === 0}
              >
                <summary className="cursor-pointer list-none px-6 py-4 text-sm font-semibold text-charcoal-900 hover:text-brass-600">
                  {faq.published ? "" : "🚫 "}
                  {faq.questionAr}
                </summary>
                <div className="border-t border-charcoal-900/10 p-6">
                  <FaqForm
                    faq={{
                      id: faq.id,
                      questionAr: faq.questionAr,
                      questionEn: faq.questionEn,
                      answerAr: faq.answerAr,
                      answerEn: faq.answerEn,
                      order: faq.order,
                      published: faq.published,
                    }}
                  />
                </div>
              </details>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
