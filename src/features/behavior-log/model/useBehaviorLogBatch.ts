"use client";

import { useEffect, useRef } from "react";
import { flushBehaviorLogs } from "./behaviorLogStore";

type UseBehaviorLogBatchParams = {
  intervalMs?: number;
};

const KEEPALIVE_FLUSH_DEDUP_MS = 1000;

export default function useBehaviorLogBatch({
  intervalMs = 1000 * 60 * 5,
}: UseBehaviorLogBatchParams = {}) {
  const lastKeepaliveFlushAtRef = useRef(0);

  useEffect(() => {
    void flushBehaviorLogs();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void flushBehaviorLogs();
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [intervalMs]);

  useEffect(() => {
    const requestKeepaliveFlush = () => {
      const now = Date.now();
      if (now - lastKeepaliveFlushAtRef.current < KEEPALIVE_FLUSH_DEDUP_MS) return;
      lastKeepaliveFlushAtRef.current = now;
      void flushBehaviorLogs({ keepalive: true });
    };

    const handlePageHide = () => {
      requestKeepaliveFlush();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        requestKeepaliveFlush();
      }
    };

    const handleOnline = () => {
      void flushBehaviorLogs();
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
