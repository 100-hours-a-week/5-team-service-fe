import * as Sentry from "@sentry/nextjs";
import { applyRequestTagsToEvent } from "./src/shared/lib/sentry/applyRequestTagsToEvent";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV,

  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: true,
  beforeSend(event) {
    return applyRequestTagsToEvent(event);
  },
  beforeSendTransaction(event) {
    return applyRequestTagsToEvent(event);
  },
});
