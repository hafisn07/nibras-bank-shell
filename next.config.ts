import type { NextConfig } from "next";

// Per-zone origins: local ports in dev, deployed domains in prod
const ACCOUNTS_URL = process.env.ACCOUNTS_URL ?? "http://localhost:3001";
const PAYMENTS_URL = process.env.PAYMENTS_URL ?? "http://localhost:3002";
const CARDS_URL = process.env.CARDS_URL ?? "http://localhost:3003";
const HOST_URL = process.env.HOST_URL ?? "http://localhost:3000";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: { allowedOrigins: [new URL(HOST_URL).host] },
  },
  // Multi-Zones: proxy each squad's zone (3 rules each — page, subtree, assets).
  async rewrites() {
    return [
      { source: "/accounts", destination: `${ACCOUNTS_URL}/accounts` },
      { source: "/accounts/:path+", destination: `${ACCOUNTS_URL}/accounts/:path+` },
      { source: "/accounts-static/:path+", destination: `${ACCOUNTS_URL}/accounts-static/:path+` },
      { source: "/payments", destination: `${PAYMENTS_URL}/payments` },
      { source: "/payments/:path+", destination: `${PAYMENTS_URL}/payments/:path+` },
      { source: "/payments-static/:path+", destination: `${PAYMENTS_URL}/payments-static/:path+` },
      { source: "/cards", destination: `${CARDS_URL}/cards` },
      { source: "/cards/:path+", destination: `${CARDS_URL}/cards/:path+` },
      { source: "/cards-static/:path+", destination: `${CARDS_URL}/cards-static/:path+` },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
