"use client";

import initAuth from "@/shared/model/initAuth";
import { useAuthStore } from "@/shared/store/authStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthInit() {
  const pathname = usePathname();
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (initialized) return;
    initAuth(pathname ?? "");
  }, [initialized, pathname]);

  return null;
}
