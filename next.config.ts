import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    // Backend accepts images up to 10 MiB; multipart needs a small overhead.
    serverActions: {
      bodySizeLimit: "11mb",
    },
  },
};

export default nextConfig;
