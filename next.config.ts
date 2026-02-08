import { withSentryConfig } from "@sentry/nextjs";
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
      {
        protocol: "https",
        hostname: "doktori-dev-images.s3.ap-northeast-2.amazonaws.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "doktori-prod-images.s3.ap-northeast-2.amazonaws.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "doktori",
  project: "doktori-fe",

  silent: !process.env.CI,
  widenClientFileUpload: true,

  webpack: {
    automaticVercelMonitors: true,

    treeshake: {
      removeDebugLogging: true,
    },
  },
});
