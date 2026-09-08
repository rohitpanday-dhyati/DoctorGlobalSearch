import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "https://doctor-global-search-backend-git-main-personal-5050.vercel.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
