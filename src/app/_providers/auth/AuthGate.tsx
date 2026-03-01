import { useAuthStore } from "@/shared/store/authStore";
import { ReactNode } from "react";

export default function AuthGate({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const initialized = useAuthStore((s) => s.initialized);
  if (!initialized) return <>{fallback}</>;
  return <>{children}</>;
}
