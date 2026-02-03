"use client";

import { useEffect, useRef } from "react";

import { initMessaging, listenForeground } from "@/lib/firebase";
import { apiFetch } from "@/lib/api/apiFetch";
import { useAuthStore } from "@/stores/authStore";

type Unsubscribe = () => void;

export default function FCMProvider(): null {
  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);

  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const lastSentTokenRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);
  const storageKeyRef = useRef("fcm:pushToken");

  const readStoredToken = () => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(storageKeyRef.current);
    } catch {
      return null;
    }
  };

  const writeStoredToken = (token: string) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKeyRef.current, token);
    } catch {
      //Ignore
    }
  };

  const cleanupListener = () => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
  };

  useEffect(() => {
    if (!initialized) return;

    if (!accessToken) {
      cleanupListener();
      return;
    }

    let cancelled = false;

    const canUsePush = () => typeof window !== "undefined" && Notification.permission === "granted";

    const registerIfPossible = async () => {
      if (cancelled) return;
      if (!canUsePush()) {
        cleanupListener();
        return;
      }

      if (inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        if (lastSentTokenRef.current === null) {
          lastSentTokenRef.current = readStoredToken();
        }

        const response = await initMessaging({ requestPermission: false });
        if (!response || cancelled) return;

        const { messaging, token } = response;

        if (token && lastSentTokenRef.current !== token) {
          await apiFetch("/notifications/push-token", {
            method: "POST",
            body: JSON.stringify({ token, platform: "WEB" }),
          });
          lastSentTokenRef.current = token;
          writeStoredToken(token);
        }

        if (cancelled) return;

        cleanupListener();
        unsubscribeRef.current = listenForeground(messaging, () => {});
      } catch (e) {
        console.error("[FCMProvider] init/register failed:", e);
      } finally {
        inFlightRef.current = false;
      }
    };

    void registerIfPossible();

    const onFocus = () => void registerIfPossible();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void registerIfPossible();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      cleanupListener();
      inFlightRef.current = false;
    };
  }, [initialized, accessToken]);

  return null;
}
