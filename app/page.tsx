import { Suspense } from "react";
import { NavBar } from "@nibras/ui";
import { nav } from "@/lib/nav";
import { MeshMonitor } from "./mesh-monitor";

const ACCOUNTS_URL = process.env.ACCOUNTS_URL ?? "http://localhost:3001";

function SearchPill() {
  return (
    <div className="hidden h-[34px] items-center gap-2 rounded-[9px] border border-[rgba(5,46,27,.1)] bg-white/60 px-3 sm:flex">
      <span className="size-3 rounded-full border-[1.5px] border-[#94A39A]" />
      <span className="text-[12px] text-mist">Search</span>
      <span className="rounded bg-[rgba(5,46,27,.05)] px-[5px] py-px font-mono text-[10px] text-haze">⌘K</span>
    </div>
  );
}

// Streamed cross-repo balance fragment from the accounts zone.
async function AccountsPanel() {
  let fragment =
    '<div style="padding:14px 0;font:400 12px var(--font-schibsted),sans-serif;color:#9CA3AF">Accounts zone offline — is nibras-bank-accounts running?</div>';
  let ok = false;
  try {
    const res = await fetch(`${ACCOUNTS_URL}/fragment`, { next: { revalidate: 60 } });
    if (res.ok) {
      fragment = await res.text();
      ok = true;
    }
  } catch {
    // accounts zone down — keep the fallback
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-hair bg-white shadow-[0_2px_8px_-2px_rgba(5,46,27,.08)]">
      <div className="flex items-center justify-between px-[22px] pb-3.5 pt-[18px]">
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold">Your accounts</span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-[9px] py-[3px] font-mono text-[10.5px]"
            style={{ color: ok ? "var(--color-gain)" : "#B45309", background: ok ? "rgba(5,150,105,.09)" : "rgba(217,119,6,.12)" }}
          >
            <span className="size-1.5 rounded-full" style={{ background: ok ? "var(--color-brand)" : "var(--color-warn)", animation: ok ? "nbPulse 2.4s infinite" : undefined }} />
            {ok ? "live" : "offline"}
          </span>
        </div>
        <a href="/accounts" className="text-[12.5px] font-medium text-brand-mid">
          View all →
        </a>
      </div>
      <div dangerouslySetInnerHTML={{ __html: fragment }} />
    </div>
  );
}

function AccountsPanelSkeleton() {
  const bar = { background: "linear-gradient(90deg,#E8ECE9 25%,#F3F6F4 37%,#E8ECE9 63%)", backgroundSize: "200% 100%" } as const;
  return (
    <div className="overflow-hidden rounded-[18px] border border-hair bg-white shadow-[0_2px_8px_-2px_rgba(5,46,27,.08)]">
      <div className="flex items-center justify-between px-[22px] pb-3.5 pt-[18px]">
        <span className="text-[15px] font-semibold">Your accounts</span>
        <span className="font-mono text-[10.5px] text-faint">loading…</span>
      </div>
      {[0, 0.15, 0.3].map((d, i) => (
        <div key={i} className="flex items-center gap-4 border-t border-line-soft px-[22px] py-[15px]">
          <div className="size-10 rounded-[11px]" style={{ ...bar, animation: `nbShimmer 1.4s linear ${d}s infinite` }} />
          <div className="flex-1">
            <div className="h-3 w-32 rounded" style={{ ...bar, animation: `nbShimmer 1.4s linear ${d}s infinite` }} />
            <div className="mt-2 h-2.5 w-20 rounded" style={{ ...bar, animation: `nbShimmer 1.4s linear ${d + 0.1}s infinite` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <NavBar links={nav} current="/" right={<SearchPill />} />

      <main className="nb-canvas">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 py-8 md:py-[34px] md:pb-[46px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="font-mono text-[12.5px] font-medium tracking-[.04em] text-brand-mid">
                SATURDAY · 19 JUL · 21:04
              </div>
              <h1 className="mt-1.5 text-[30px] font-semibold leading-[1.1] tracking-[-.025em]">
                Good evening, Omar
              </h1>
            </div>
            <div className="flex gap-2.5">
              <span className="inline-flex items-center rounded-[10px] border border-[rgba(5,46,27,.1)] bg-white px-[18px] py-2.5 text-[13px] font-semibold text-forest shadow-[0_1px_2px_rgba(5,46,27,.05)]">
                Request
              </span>
              <a
                href="/payments"
                className="inline-flex items-center rounded-[10px] bg-gradient-to-br from-brand-mid to-brand-strong px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(5,102,73,.7)]"
              >
                Send money
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.42fr_1fr]">
            <div className="nb-beacon relative flex min-h-[280px] flex-col overflow-hidden rounded-[22px] p-8 text-white md:p-9">
              <div className="nb-guilloche pointer-events-none absolute -right-[70px] -top-[90px] size-[340px] rounded-full opacity-70" />

              <div className="relative flex items-center gap-2">
                <span className="text-[12.5px] font-medium text-[rgba(214,240,228,.85)]">Total balance</span>
                <span className="rounded-full border border-[rgba(110,231,183,.25)] bg-[rgba(110,231,183,.14)] px-[9px] py-0.5 font-mono text-[10.5px] text-[#6EE7B7]">
                  3 accounts
                </span>
              </div>
              <div className="relative mt-3 font-mono text-[48px] font-medium leading-none tracking-[-.03em] tabular-nums">
                AED 60,952<span className="text-[rgba(214,240,228,.6)]">.30</span>
              </div>
              <div className="relative mt-3.5 flex items-center gap-2.5">
                <span className="inline-flex items-center gap-[5px] rounded-full bg-[#6EE7B7] px-[11px] py-1 font-mono text-[12px] text-forest">
                  ↑ +AED 3,210.40
                </span>
                <span className="text-[12.5px] text-[rgba(214,240,228,.7)]">+5.6% this month</span>
              </div>

              <div className="relative mt-auto pt-[22px]">
                <div className="mb-1.5 flex items-end justify-between">
                  <span className="font-mono text-[10.5px] tracking-[.06em] text-[rgba(214,240,228,.55)]">30-DAY FLOW</span>
                  <span className="text-[11px] text-[rgba(214,240,228,.6)]">
                    <span className="text-[#6EE7B7]">▲ in</span> · <span className="text-[#FCA5A5]">▼ out</span>
                  </span>
                </div>
                <svg viewBox="0 0 620 64" preserveAspectRatio="none" className="block h-14 w-full">
                  <defs>
                    <linearGradient id="cf3a" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#6EE7B7" stopOpacity=".42" />
                      <stop offset="1" stopColor="#6EE7B7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,44 C50,40 90,20 140,26 S230,50 280,38 S360,12 410,22 S500,46 540,30 S600,18 620,24 L620,64 L0,64 Z" fill="url(#cf3a)" />
                  <path
                    d="M0,44 C50,40 90,20 140,26 S230,50 280,38 S360,12 410,22 S500,46 540,30 S600,18 620,24"
                    fill="none"
                    stroke="#6EE7B7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="640"
                    style={{ animation: "nbDrawline 2.4s ease-out forwards" }}
                  />
                  <circle cx="620" cy="24" r="3.5" fill="#fff" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-[18px]">
              <div className="flex flex-1 items-center justify-center" style={{ perspective: 1000 }}>
                <div
                  className="nb-cardface relative h-[186px] w-[300px] overflow-hidden rounded-[16px] text-white"
                  style={{ boxShadow: "0 20px 40px -16px rgba(5,46,27,.7)" }}
                >
                  <div className="nb-weave pointer-events-none absolute inset-0" />
                  <div
                    className="pointer-events-none absolute -top-[30%] left-0 h-[160%] w-[44%]"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)", animation: "nbSweep 5.5s ease-in-out infinite" }}
                  />
                  <div className="relative flex h-full flex-col justify-between p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-semibold tracking-[-.01em]">Nibras</span>
                      <span className="rounded-[5px] border border-white/30 px-1.5 py-0.5 font-mono text-[10px] text-[rgba(214,240,228,.8)]">PLATINUM</span>
                    </div>
                    <div className="h-[27px] w-[38px] rounded-[5px]" style={{ background: "linear-gradient(135deg,#F0D48A,#C79B47)", boxShadow: "inset 0 1px 1px rgba(255,255,255,.5)" }} />
                    <div className="font-mono text-[16px] tracking-[.14em]">•••• •••• •••• 4021</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="font-mono text-[8px] tracking-[.1em] text-[rgba(214,240,228,.6)]">CARDHOLDER</div>
                        <div className="mt-px text-[12px] font-medium">Omar Haddad</div>
                      </div>
                      <div className="text-[13px] font-semibold italic text-[#E7F3EC]">VISA</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[14px] border border-hair bg-white p-4 shadow-[0_2px_6px_-2px_rgba(5,46,27,.08)]">
                  <div className="text-[11.5px] font-medium text-muted">Spent · month</div>
                  <div className="mt-1.5 font-mono text-[17px] font-semibold tracking-[-.02em] tabular-nums">AED 2,154.90</div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#EAF0EC]">
                    <div className="h-full rounded-full" style={{ width: "34%", background: "linear-gradient(90deg,#0B7A57,#34D399)" }} />
                  </div>
                </div>
                <div className="rounded-[14px] border border-hair bg-white p-4 shadow-[0_2px_6px_-2px_rgba(5,46,27,.08)]">
                  <div className="text-[11.5px] font-medium text-muted">Avail · credit</div>
                  <div className="mt-1.5 font-mono text-[17px] font-semibold tracking-[-.02em] tabular-nums">AED 18,579.50</div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#EAF0EC]">
                    <div className="h-full rounded-full" style={{ width: "74%", background: "linear-gradient(90deg,#0B7A57,#34D399)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Suspense fallback={<AccountsPanelSkeleton />}>
            <AccountsPanel />
          </Suspense>
        </div>
      </main>

      <MeshMonitor />
    </>
  );
}
