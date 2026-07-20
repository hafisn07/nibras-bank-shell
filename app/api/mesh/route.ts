import { NextResponse } from "next/server";

// Live health/latency probe of each zone
export const dynamic = "force-dynamic";

const ZONES = [
  { key: "accounts", label: "Accounts", path: "/accounts", url: process.env.ACCOUNTS_URL ?? "http://localhost:3001" },
  { key: "payments", label: "Payments", path: "/payments", url: process.env.PAYMENTS_URL ?? "http://localhost:3002" },
  { key: "cards", label: "Cards", path: "/cards", url: process.env.CARDS_URL ?? "http://localhost:3003" },
] as const;

type Zone = (typeof ZONES)[number];

async function probe(zone: Zone) {
  const host = new URL(zone.url).host;
  const start = performance.now();
  try {
    const res = await fetch(`${zone.url}${zone.path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    return {
      key: zone.key,
      label: zone.label,
      path: zone.path,
      host,
      ok: res.ok,
      status: res.status,
      ms: Math.round(performance.now() - start),
    };
  } catch {
    return { key: zone.key, label: zone.label, path: zone.path, host, ok: false, status: 0, ms: Math.round(performance.now() - start) };
  }
}

export async function GET() {
  const zones = await Promise.all(ZONES.map(probe));
  return NextResponse.json(
    { zones, checkedAt: new Date().toISOString() },
    { headers: { "cache-control": "no-store" } },
  );
}
