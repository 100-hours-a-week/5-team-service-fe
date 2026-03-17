"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FCMProvider from "@/components/alarm/FCMProvider";
import AuthInit from "./_providers/auth/AuthInit";
import AuthGate from "./_providers/auth/AuthGate";
import FullScreenSpinner from "@/shared/ui/FullScreenSpinner";
import useBehaviorLogBatch from "@/features/behavior-log/model/useBehaviorLogBatch";

const BEHAVIOR_LOG_BATCH_INTERVAL_MS = 1000 * 60;

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  useBehaviorLogBatch({ intervalMs: BEHAVIOR_LOG_BATCH_INTERVAL_MS });
  const disableAuthGate = pathname
    ? pathname === "/" || /^\/meeting\/detail\/[^/]+\/?$/.test(pathname)
    : false;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInit />
      <AuthGate
        fallback={disableAuthGate ? null : <FullScreenSpinner />}
        disabled={disableAuthGate}
      >
        <FCMProvider />
        {children}
      </AuthGate>
    </QueryClientProvider>
  );
}
