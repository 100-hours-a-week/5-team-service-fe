"use client";

import { useEffect, useRef, useState } from "react";
import { TOAST_DURATION_MS } from "./toastMessageType";

const TOAST_EXIT_MS = 250;

export default function useToastMessage() {
  const [toastMessage, setToastMessage] = useState("");
  const [phase, setPhase] = useState<"ENTER" | "EXIT">("ENTER");
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current == null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const clearToast = () => {
    clearTimer();
    setToastMessage("");
    setPhase("ENTER");
  };

  const showToast = (message: string) => {
    clearTimer();

    setToastMessage(message);
    setPhase("ENTER");

    const exitStartMs = Math.max(0, TOAST_DURATION_MS - TOAST_EXIT_MS);

    timerRef.current = window.setTimeout(() => {
      setPhase("EXIT");
      timerRef.current = null;
    }, exitStartMs);
  };

  const handleExitAnimationEnd = () => {
    if (phase !== "EXIT") return;
    setToastMessage("");
    setPhase("ENTER");
  };

  useEffect(() => clearTimer, []);

  return { toastMessage, phase, showToast, clearToast, handleExitAnimationEnd };
}
