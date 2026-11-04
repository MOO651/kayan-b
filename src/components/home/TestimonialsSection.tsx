import { getTranslations, getLocale } from "next-intl/server";
import { db } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export async function TestimonialsSection() {
  const t = await getTranslations("home.testimonials");
  const locale = await getLocale();

  const items = await db.testimonial.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 6,
  });
  if (items.length === 0) return null;

  return (
    <section className="bg-ink-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker={t("kicker")}
          title={t("title")}
          subtitle={t("subtitle")}
          dark
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const role = locale === "ar" ? item.roleAr : item.roleEn || item.roleAr;
            const content =
              locale === "ar" ? item.contentAr : item.contentEn || item.contentAr;
            return (
              <Reveal
                key={item.id}
                delay={(i % 3) * 100}
                className="flex h-full flex-col border border-ivory-50/10 bg-ivory-50/[0.03] p-8"
              >
                <Icon name="quote" className="size-8 text-brass-500/40" strokeWidth={1} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ivory-100/80">
                  {content}
                </blockquote>
                <div className="mt-6 flex items-center gap-1" aria-label={`${item.rating}/5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg
                      key={s}
                      viewBox="0 0 20 20"
                      className={`size-4 ${s < item.rating ? "fill-brass-400" : "fill-ivory-50/20"}`}
                      aria-hidden
                    >
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <div className="mt-4 border-t border-ivory-50/10 pt-4">
                  <p className="font-display text-base font-semibold text-ivory-50">
                    {item.name}
                  </p>
                  {role && (
                    <p className="mt-0.5 text-xs text-brass-300">{role}</p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
