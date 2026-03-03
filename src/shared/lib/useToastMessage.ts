"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TOAST_DURATION_MS } from "./toastMessageType";

const TOAST_EXIT_MS = 250;

export default function useToastMessage() {
  const [toastMessage, setToastMessage] = useState("");
  const [phase, setPhase] = useState<"ENTER" | "EXIT">("ENTER");
  const timerRef = useRef<number | null>(null);
  const exitFallbackTimerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current == null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const clearExitFallbackTimer = useCallback(() => {
    if (exitFallbackTimerRef.current == null) return;
    window.clearTimeout(exitFallbackTimerRef.current);
    exitFallbackTimerRef.current = null;
  }, []);

  const clearToast = useCallback(() => {
    clearTimer();
    clearExitFallbackTimer();
    setToastMessage("");
    setPhase("ENTER");
  }, [clearExitFallbackTimer, clearTimer]);

  const showToast = useCallback(
    (message: string, durationMs: number = TOAST_DURATION_MS) => {
      clearTimer();

      setToastMessage(message);
      setPhase("ENTER");

      const exitStartMs = Math.max(0, durationMs - TOAST_EXIT_MS);

      timerRef.current = window.setTimeout(() => {
        setPhase("EXIT");
        timerRef.current = null;
        clearExitFallbackTimer();
        exitFallbackTimerRef.current = window.setTimeout(() => {
          setToastMessage("");
          setPhase("ENTER");
          exitFallbackTimerRef.current = null;
        }, TOAST_EXIT_MS + 80);
      }, exitStartMs);
    },
    [clearExitFallbackTimer, clearTimer],
  );

  const handleExitAnimationEnd = useCallback(() => {
    if (phase !== "EXIT") return;
    clearExitFallbackTimer();
    setToastMessage("");
    setPhase("ENTER");
  }, [clearExitFallbackTimer, phase]);

  useEffect(
    () => () => {
      clearTimer();
      clearExitFallbackTimer();
    },
    [clearExitFallbackTimer, clearTimer],
  );

  return { toastMessage, phase, showToast, clearToast, handleExitAnimationEnd };
}
