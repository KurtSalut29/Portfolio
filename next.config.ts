import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home folder confuses root detection; pin it here.
  turbopack: { root: __dirname },
  // 75 is the default; 90 keeps gallery photos sharp.
  images: { qualities: [75, 90] },
  experimental: {
    // Tree-shake the big icon packages so only the icons we use ship.
    optimizePackageImports: ["@phosphor-icons/react", "simple-icons"],
  },
};

export default nextConfig;
