import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // AVIF first — typically 20-30% smaller than WebP at the same quality.
    // Next falls back to WebP, then the original, per the browser's Accept header.
    formats: ["image/avif", "image/webp"],
    // Cache optimised variants for a year; the filenames are content-addressed.
    minimumCacheTTL: 31_536_000,
  },

  experimental: {
    // Ships only the icons actually imported instead of the whole barrel file.
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default withNextIntl(nextConfig);
