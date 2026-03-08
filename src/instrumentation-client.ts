import * as Sentry from "@sentry/nextjs";

function getCookie(name: string) {
  if (typeof document === "undefined") return "";

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return value ? decodeURIComponent(value.split("=")[1]) : "";
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV,

  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1,
  enableLogs: true,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  sendDefaultPii: true,
});

Sentry.setTag("delivery_path", getCookie("delivery_path") || "unknown");
Sentry.setTag("host", typeof window !== "undefined" ? window.location.host : "unknown");

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
