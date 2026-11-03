import { Reveal } from "./Reveal";

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 pt-40 pb-20 lg:pt-48 lg:pb-24">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 118px, rgba(250,248,242,0.6) 119px, transparent 120px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(176,141,87,0.15),transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <h1 className="font-display text-4xl leading-tight font-bold text-balance text-ivory-50 sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ivory-100/70">
              {subtitle}
            </p>
          )}
          <span
            aria-hidden
            className="mt-8 block h-px w-24 bg-brass-500"
          />
        </Reveal>
      </div>
    </section>
  );
}
