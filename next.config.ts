import type { NextConfig } from "next";

if (process.env.VERCEL && !process.env.API_URL) {
  throw new Error("Defina API_URL nas variáveis de ambiente do projeto na Vercel.");
}

const API_URL = (process.env.API_URL ?? "http://localhost:3333").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/:path*` }];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
