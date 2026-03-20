import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DELIVERY_PATH_COOKIE = "delivery_path";
const ENABLE_FRONTEND_ACCESS_LOGS = process.env.ENABLE_FRONTEND_ACCESS_LOGS === "true";
const HEALTH_CHECK_PATH = "/health";

function resolveDeliveryPath(req: NextRequest) {
  const via = req.headers.get("via") ?? "";
  const cfId = req.headers.get("x-amz-cf-id") ?? "";

  return via.toLowerCase().includes("cloudfront") || cfId ? "cloudfront" : "direct-origin";
}

function logFrontendRequest(req: NextRequest, deliveryPath: string) {
  const forwardedFor = req.headers.get("x-forwarded-for") ?? "-";
  const referer = req.headers.get("referer") ?? "-";
  const userAgent = req.headers.get("user-agent") ?? "-";
  const host = req.headers.get("host") ?? "-";
  const url = `${req.nextUrl.pathname}${req.nextUrl.search}`;

  console.log(
    `[frontend-access] ${req.method} ${url} host=${host} ip=${forwardedFor} delivery=${deliveryPath} referer=${referer} ua=${userAgent}`,
  );
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === HEALTH_CHECK_PATH) {
    return NextResponse.json(
      { status: "ok", timestamp: new Date().toISOString(), source: "middleware" },
      { status: 200 },
    );
  }

  const deliveryPath = resolveDeliveryPath(req);
  const res = NextResponse.next();

  if (ENABLE_FRONTEND_ACCESS_LOGS) {
    logFrontendRequest(req, deliveryPath);
  }

  res.cookies.set(DELIVERY_PATH_COOKIE, deliveryPath, {
    path: "/",
    sameSite: "lax",
    secure: true,
  });

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
