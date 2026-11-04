import Image from "next/image";
import Link from "next/link";

export type TeamCardData = {
  id: string;
  slug: string | null;
  name: string;
  title: string;
  bio: string;
  photo: string;
  specialties: string[];
};

export function TeamCard({
  lawyer,
  locale,
  specialtiesLabel,
  viewProfileLabel,
}: {
  lawyer: TeamCardData;
  locale: string;
  specialtiesLabel: string;
  viewProfileLabel: string;
}) {
  const href = lawyer.slug
    ? locale === "ar"
      ? `/team/${lawyer.slug}`
      : `/en/team/${lawyer.slug}`
    : null;

  return (
    <div className="group h-full border border-charcoal-900/10 bg-ivory-50">
      <div className="relative aspect-[4/4] overflow-hidden bg-charcoal-800">
        {lawyer.photo ? (
          <Image
            src={lawyer.photo}
            alt={lawyer.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-7xl font-bold text-brass-500/30">
              {lawyer.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-7">
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">
          {lawyer.name}
        </h2>
        {lawyer.title && (
          <p className="mt-1 text-sm font-medium tracking-wide text-brass-600">
            {lawyer.title}
          </p>
        )}
        {lawyer.bio && (
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-charcoal-600">
            {lawyer.bio}
          </p>
        )}
        {lawyer.specialties.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold tracking-wider text-charcoal-600/70 uppercase">
              {specialtiesLabel}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {lawyer.specialties.map((s) => (
                <li
                  key={s}
                  className="border border-brass-500/30 bg-brass-500/5 px-3 py-1 text-xs text-brass-600"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {href && (
          <Link
            href={href}
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brass-600 uppercase transition-colors hover:text-brass-500"
          >
            {viewProfileLabel}
            <span aria-hidden>←</span>
          </Link>
        )}
      </div>
    </div>
  );
}
