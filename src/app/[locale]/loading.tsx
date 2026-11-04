/** Route-level loading state in the firm's visual identity. */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-ivory-50">
      <div className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border border-brass-500/25 border-t-brass-500 [animation-duration:1.4s]" />
        <span
          aria-hidden
          className="font-display text-2xl font-bold text-brass-600"
        >
          ك
        </span>
      </div>
      <p className="text-xs tracking-[0.3em] text-charcoal-600/60 uppercase">
        Makki Bashmeel
      </p>
    </div>
  );
}
