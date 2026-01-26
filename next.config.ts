import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "search1.kakaocdn.net",
        pathname: "/thumb/**",
      },
      {
        protocol: "https",
        hostname: "t1.daumcdn.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "t1.daumcdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
