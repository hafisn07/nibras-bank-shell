"use client";

import { useEffect, useState } from "react";

type ZoneStatus = {
  key: string;
  label: string;
  path: string;
  host: string;
  ok: boolean;
  status: number;
  ms: number;
};

type Mesh = { zones: ZoneStatus[]; checkedAt: string };

const POLL_MS = 5000;

const PLACEHOLDER: ZoneStatus[] = [
  { key: "accounts", label: "Accounts", path: "/accounts", host: "nibras-bank-accounts.vercel.app", ok: false, status: 0, ms: 0 },
  { key: "payments", label: "Payments", path: "/payments", host: "nibras-bank-payments.vercel.app", ok: false, status: 0, ms: 0 },
  { key: "cards", label: "Cards", path: "/cards", host: "nibras-bank-cards.vercel.app", ok: false, status: 0, ms: 0 },
];

function CheckedAgo({ checkedAt }: { checkedAt?: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const label =
    checkedAt && now
      ? `checked ${Math.max(0, Math.round((now - new Date(checkedAt).getTime()) / 1000))}s ago`
      : "polling…";
  return (
    <span className="font-mono text-[11px] text-faint" style={{ animation: "nbBlink 3s infinite" }}>
      {label}
    </span>
  );
}

export function MeshMonitor() {
  const [mesh, setMesh] = useState<Mesh | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/mesh", { cache: "no-store" });
        const data = (await res.json()) as Mesh;
        if (!alive) return;
        setMesh(data);
        const ts = new Date(data.checkedAt).toLocaleTimeString("en-GB");
        const lines = data.zones.map((z) => `${ts} probe ${z.key} ${z.ok ? z.status : "ERR"} ${z.ms}ms`);
        setLog((prev) => [...lines, ...prev].slice(0, 8));
      } catch {
        // keep the last known state on a transient failure
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const pending = !mesh;
  const zones = mesh?.zones ?? PLACEHOLDER;
  const healthy = zones.filter((z) => z.ok).length;
  const allHealthy = !pending && healthy === zones.length;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[14px] border border-hair bg-white shadow-[0_18px_44px_-14px_rgba(5,46,27,.4)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 border-b border-line bg-[#F3F7F4] px-3.5 py-2.5 text-left"
      >
        <span className="size-[9px] rounded-full bg-[#D7DFD9]" />
        <span className="size-[9px] rounded-full bg-[#D7DFD9]" />
        <span className="size-[9px] rounded-full bg-[#D7DFD9]" />
        <span className="ml-1.5 font-mono text-[11px] font-medium text-muted">mesh — nibras-shell v2.4.1</span>
        <span
          className="ml-auto size-[9px] rounded-full"
          style={{ background: allHealthy ? "#059669" : pending ? "#C9D0CB" : "#D97706", animation: "nbPulse 2.4s infinite" }}
        />
      </button>

      {open ? (
        <div className="pb-3.5">
          <div className="px-4 pt-3.5">
            <div className="font-mono text-[11.5px] text-faint">Micro-frontend mesh · live-probing each zone</div>
            <div className="mt-2.5 font-mono text-[12px] text-ink">
              <span className="text-brand">$</span> nibras probe --all --interval 5s
              <span className="ml-1 inline-block h-3 w-[7px] translate-y-[2px] bg-brand" style={{ animation: "nbCursor 1.1s step-end infinite" }} />
            </div>
          </div>

          <div className="flex px-4 pt-3">
            <div className="relative ml-1 w-px self-stretch border-l border-dashed border-[#C9D6CE]">
              <span className="absolute -left-[3px] size-[5px] rounded-full bg-brand" style={{ animation: "nbProbe 3s linear infinite" }} />
            </div>
            <div className="flex flex-1 flex-col gap-2 pl-3">
              {zones.map((z, i) => (
                <div key={z.key} className="flex items-center gap-[7px] rounded-lg border border-[#EDF1EE] px-2.5 py-2">
                  <span
                    className="size-[7px] rounded-full"
                    style={{
                      background: pending ? "#C9D0CB" : z.ok ? "#059669" : "#DC2626",
                      animation: !pending && z.ok ? `nbPulse 2.4s ${i * 0.5}s infinite` : undefined,
                    }}
                  />
                  <span className="font-mono text-[11.5px] font-semibold text-ink">GET {z.path}</span>
                  <span className="font-mono text-[11px] font-semibold" style={{ color: pending ? "#9CA3AF" : z.ok ? "#059669" : "#DC2626" }}>
                    {pending ? "···" : z.ok ? z.status : "ERR"}
                  </span>
                  <span className="ml-auto font-mono text-[11px] font-medium text-brand-strong">
                    {pending ? "" : z.ok ? `${z.ms} ms` : "down"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-4 mt-3 border-t border-dashed border-line pt-2.5">
            <div className="font-mono text-[10px] uppercase tracking-[.08em] text-faint">live log</div>
            <div className="mt-1.5 flex h-[74px] flex-col gap-[5px] overflow-hidden">
              {(log.length ? log : ["connecting to mesh…"]).slice(0, 5).map((l, i) => (
                <div key={`${l}-${i}`} className="whitespace-nowrap font-mono text-[10.5px] text-muted">
                  {l}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-4 mt-1 flex items-center justify-between border-t border-line pt-3">
            <span className="font-mono text-[11px] font-medium" style={{ color: allHealthy ? "#047857" : "#B45309" }}>
              {pending ? "connecting…" : `${healthy}/${zones.length} zones healthy`}
            </span>
            <CheckedAgo checkedAt={mesh?.checkedAt} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
