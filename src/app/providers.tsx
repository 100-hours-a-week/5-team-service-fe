"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FCMProvider from "@/components/alarm/FCMProvider";
import AuthInit from "./_providers/auth/AuthInit";
import AuthGate from "./_providers/auth/AuthGate";
import FullScreenSpinner from "@/shared/ui/FullScreenSpinner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
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
