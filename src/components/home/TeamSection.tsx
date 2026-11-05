import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { getHome } from "@/lib/settings";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export async function TeamSection() {
  const t = await getTranslations("home.team");
  const tt = await getTranslations("team");
  const locale = await getLocale();
  const home = await getHome();

  if (!home.showTeam) return null;

  const members = await db.lawyer.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });

  if (members.length === 0) return null;

  const groups = [
    {
      key: "legal",
      title: locale === "ar" ? "الفريق القانوني" : "Legal Team",
      people: members.filter(
        (member) =>
          member.category !== "DIGITAL" &&
          member.role !== "DIGITAL" &&
          member.category !== "PARTNER" &&
          member.role !== "PARTNER",
      ),
    },
    {
      key: "partners",
      title: locale === "ar" ? "الشركاء" : "Partners",
      people: members.filter(
        (member) =>
          member.category === "PARTNER" || member.role === "PARTNER",
      ),
    },
    {
      key: "digital",
      title: locale === "ar" ? "فريق التطوير والحلول الرقمية" : "Digital Development Team",
      people: members.filter(
        (member) =>
          member.category === "DIGITAL" || member.role === "DIGITAL",
      ),
    },
  ].filter((group) => group.people.length > 0);

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker={t("kicker")}
          title={tt("title")}
          subtitle={tt("subtitle")}
        />

        <div className="mt-16 space-y-16">
          {groups.map((group) => (
            <div key={group.key}>
              <Reveal className="mb-8 text-center">
                <h3 className="font-display text-2xl font-semibold text-charcoal-900">
                  {group.title}
                </h3>
              </Reveal>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {group.people.map((member, i) => {
                  const name =
                    locale === "ar"
                      ? member.nameAr
                      : member.nameEn || member.nameAr;
                  const title =
                    locale === "ar"
                      ? member.titleAr
                      : member.titleEn || member.titleAr;
                  return (
                    <Reveal
                      key={member.id}
                      delay={(i % 4) * 100}
                      className="group"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-800">
                        {member.photo ? (
                          <Image
                            src={member.photo}
                            alt={name}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="font-display text-6xl font-bold text-brass-500/30">
                              {name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/80 to-transparent"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          {(member.category === "DIGITAL" ||
                            member.role === "DIGITAL") && (
                            <span className="mb-2 inline-block border border-brass-500/40 px-2 py-0.5 text-[0.6rem] font-semibold tracking-widest text-brass-300 uppercase">
                              {locale === "ar" ? "تطوير رقمي" : "Digital"}
                            </span>
                          )}
                          {(member.category === "PARTNER" ||
                            member.role === "PARTNER") && (
                            <span className="mb-2 inline-block border border-brass-500/40 px-2 py-0.5 text-[0.6rem] font-semibold tracking-widest text-brass-300 uppercase">
                              {locale === "ar" ? "شريك" : "Partner"}
                            </span>
                          )}
                          <h4 className="font-display text-lg font-semibold text-ivory-50">
                            {name}
                          </h4>
                          {title && (
                            <p className="mt-1 text-xs tracking-wide text-brass-300">
                              {title}
                            </p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <ButtonLink href="/team" variant="outline-dark" arrow>
            {t("viewAll")}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
