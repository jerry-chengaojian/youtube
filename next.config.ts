import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "5mbgaz63fs3ziist.public.blob.vercel-storage.com",
        port: "", // Leave empty for default port
        pathname: "/**", // Allow all paths
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
