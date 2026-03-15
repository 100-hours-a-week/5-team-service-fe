import { useAuthStore } from "@/shared/store/authStore";
import { ReactNode } from "react";

export default function AuthGate({
  children,
  fallback,
  disabled = false,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  disabled?: boolean;
}) {
  const initialized = useAuthStore((s) => s.initialized);
  if (disabled) return <>{children}</>;
  if (!initialized) return <>{fallback}</>;
  return <>{children}</>;
}
