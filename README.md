# Nibras Bank — a polyrepo micro-frontend mesh

**Nibras Bank** is a Gulf neobank built to demonstrate a **production-style micro-frontend
architecture** with **Next.js 16 Multi-Zones**. Each product is owned by a **separate squad in its
own repo**, deployed independently, and stitched into one domain — the "**each squad clones only
their own repo**" model (polyrepo).

> **Nibras Bank is a fictional bank** built for a developer demo. It is not a real financial
> institution and is not affiliated with any company of a similar name.

**▶ Live demo — the whole bank, composed live from 4 separate repos: https://nibras-bank-shell.vercel.app**

The dashboard runs a **live mesh monitor** that probes each squad's zone (status + latency), so the
micro-frontend composition is visible in real time — plus a balance card rendered remotely from the
Accounts repo. Each zone is a separate Vercel deployment; the shell stitches them with Multi-Zones.

This is the **shell** (platform team's repo) and the entry point.

## The five repos

| Repo | Squad | Owns | Runs on |
| --- | --- | --- | --- |
| **nibras-bank-shell** (this) | platform | `/*` (dashboard + composes zones) | :3000 |
| **[nibras-bank-accounts](https://github.com/hafisn07/nibras-bank-accounts)** | Accounts | `/accounts/*` | :3001 |
| **[nibras-bank-payments](https://github.com/hafisn07/nibras-bank-payments)** | Payments | `/payments/*` | :3002 |
| **[nibras-bank-cards](https://github.com/hafisn07/nibras-bank-cards)** | Cards | `/cards/*` | :3003 |
| **[nibras-bank-ui](https://github.com/hafisn07/nibras-bank-ui)** | platform | shared `@nibras/ui` | — |

A squad clones **one** repo (theirs). Add a product = add a repo + one rewrite here.

## Run the whole bank locally

Each repo is independent, so you clone the ones you need. To see the full composed bank, run the
shell + all three zones (each pulls `@nibras/ui` from GitHub automatically):

```bash
git clone https://github.com/hafisn07/nibras-bank-accounts && (cd nibras-bank-accounts && npm i && npm run dev)  # :3001
git clone https://github.com/hafisn07/nibras-bank-payments && (cd nibras-bank-payments && npm i && npm run dev)  # :3002
git clone https://github.com/hafisn07/nibras-bank-cards    && (cd nibras-bank-cards    && npm i && npm run dev)  # :3003
git clone https://github.com/hafisn07/nibras-bank-shell    && (cd nibras-bank-shell    && npm i && npm run dev)  # :3000
```

Open **http://localhost:3000** — the bank, composed from four separate repos. `/accounts` is served
by the accounts repo, `/payments` by payments, `/cards` by cards, and the dashboard embeds a live
balance fragment from the accounts repo (a remote component across repos).

## How shared code works without a monorepo

Every squad's repo depends on the design system: `"@nibras/ui": "github:hafisn07/nibras-bank-ui"`.
Here it's a **git dependency** so the example runs with zero registry setup. In a real org you'd
**publish `@nibras/ui` to npm / GitHub Packages** and depend by semver — then **Renovate** (config in
each repo) opens automatic PRs across every squad's repo when it changes. That's how you keep many
teams across many repos in sync **without** one monorepo. Squad-specific code just lives in that
squad's repo.

## Monorepo ↔ polyrepo mapping

```
  MONOREPO (one repo, folders)         POLYREPO (this — separate repos)
  ─────────────────────────            ─────────────────────────────────
  apps/shell/                    →     nibras-bank-shell     repo (platform)
  apps/accounts/                 →     nibras-bank-accounts  repo (Accounts squad)
  apps/payments/                 →     nibras-bank-payments  repo (Payments squad)
  apps/cards/                    →     nibras-bank-cards     repo (Cards squad)
  packages/ui/  (workspace pkg)  →     @nibras/ui            published/git package
```

The composition wiring (rewrites + `assetPrefix` + `<a>` cross-zone links) is **identical** either
way. A monorepo version of this same idea (plus an installable Claude skill) lives at
**[next-microfrontends](https://github.com/hafisn07/next-microfrontends)**.

## Deployed on Vercel (each zone independently)

Each app is its **own Vercel project** with its own domain — the independent-deploy story, live:

| App | Vercel URL |
| --- | --- |
| shell | https://nibras-bank-shell.vercel.app |
| accounts | https://nibras-bank-accounts.vercel.app |
| payments | https://nibras-bank-payments.vercel.app |
| cards | https://nibras-bank-cards.vercel.app |

The shell's `rewrites()` point at each zone's production URL via env vars (`ACCOUNTS_URL`,
`PAYMENTS_URL`, `CARDS_URL`) set on the shell project; the payments zone gets `HOST_URL` so its
Server Action trusts the shell origin. Because `rewrites()` bake at build time, redeploy the shell
whenever a zone URL changes. Vercel also has a first-party **Microfrontends** product
(`microfrontends.json` + `@vercel/microfrontends`) that automates this routing — this repo uses
framework-native Multi-Zones on purpose, so the example stays portable to any host.

## Rules that matter (Multi-Zones)

- The shell needs **three rewrites per zone**: the path, the `:path+` subtree, and the zone's
  `*-static` assets.
- Each zone sets its own `assetPrefix` (`/accounts-static`, etc.).
- **Cross-zone links use a plain `<a>`**, not `<Link>`.
- `rewrites()` destinations **bake at build time** for `next start`, so build each app with its env
  set in production (dev re-evaluates per request).
