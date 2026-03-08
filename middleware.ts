import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DELIVERY_PATH_COOKIE = "delivery_path";

function resolveDeliveryPath(req: NextRequest) {
  const via = req.headers.get("via") ?? "";
  const cfId = req.headers.get("x-amz-cf-id") ?? "";

  return via.toLowerCase().includes("cloudfront") || cfId ? "cloudfront" : "direct-origin";
}

export function middleware(req: NextRequest) {
  const deliveryPath = resolveDeliveryPath(req);
  const res = NextResponse.next();

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
