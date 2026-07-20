"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center bg-white px-10 py-14 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-[rgba(220,38,38,.08)] text-[26px] text-loss">
        !
      </div>
      <div className="mt-[18px] text-[17px] font-semibold">Something went off the mesh</div>
      <div className="mt-1.5 max-w-[300px] text-[13px] leading-[1.5] text-muted">
        This zone didn&apos;t respond. Your money is safe. This is a display issue.
      </div>
      <div className="mt-3.5 font-mono text-[11px] text-haze">mesh · display error</div>
      <div className="mt-5 flex gap-2.5">
        <button
          onClick={reset}
          className="flex h-11 items-center rounded-[10px] bg-gradient-to-br from-brand-mid to-brand-strong px-[22px] text-[13.5px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(5,102,73,.6)]"
        >
          Try again
        </button>
        <a
          href="/"
          className="flex h-11 items-center rounded-[10px] border border-line px-5 text-[13.5px] font-semibold text-forest"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
