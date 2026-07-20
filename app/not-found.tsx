export default function NotFound() {
  return (
    <div className="nb-canvas relative flex flex-col items-center overflow-hidden px-10 py-[70px] text-center">
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-[260px] rounded-full"
        style={{ background: "repeating-radial-gradient(circle,rgba(5,150,105,.05) 0 1px,transparent 1px 18px)" }}
      />
      <div className="relative font-mono text-[72px] font-medium tracking-[-.03em] text-forest">
        4<span className="text-brand-mid">0</span>4
      </div>
      <div className="relative mt-2 text-[18px] font-semibold">This page drifted off the mesh</div>
      <div className="relative mt-1.5 max-w-[340px] text-[13.5px] leading-[1.6] text-muted">
        The zone you&apos;re looking for isn&apos;t mounted. Let&apos;s get you back to your dashboard.
      </div>
      <a
        href="/"
        className="relative mt-[22px] flex h-[46px] items-center rounded-[11px] bg-gradient-to-br from-brand-mid to-brand-strong px-6 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(5,102,73,.6)]"
      >
        ← Back to dashboard
      </a>
    </div>
  );
}
