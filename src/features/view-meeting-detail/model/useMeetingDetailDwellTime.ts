"use client";

import { useEffect } from "react";
import { addMeetingDetailDwellTime } from "@/features/behavior-log/model/behaviorLogStore";

type UseMeetingDetailDwellTimeParams = {
  meetingId: number | null;
  enabled?: boolean;
};

export default function useMeetingDetailDwellTime({
  meetingId,
  enabled = true,
}: UseMeetingDetailDwellTimeParams) {
  useEffect(() => {
    if (!enabled || !meetingId) return;
    if (typeof document === "undefined" || typeof window === "undefined") return;

    const startedAt = Date.now();
    let hiddenStartedAt: number | null = null;
    let hiddenAccumulatedMs = 0;
    let finalized = false;

    const getDwellMs = () => {
      const now = Date.now();
      const hiddenNow = hiddenStartedAt ? now - hiddenStartedAt : 0;
      return Math.max(0, now - startedAt - hiddenAccumulatedMs - hiddenNow);
    };

    const finalize = () => {
      if (finalized) return;
      finalized = true;
      const dwellMs = getDwellMs();
      if (dwellMs > 0) {
        addMeetingDetailDwellTime(meetingId, dwellMs);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        hiddenStartedAt = Date.now();
        return;
      }

      if (hiddenStartedAt) {
        hiddenAccumulatedMs += Date.now() - hiddenStartedAt;
        hiddenStartedAt = null;
      }
    };

    const handlePageHide = () => {
      finalize();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      finalize();
    };
  }, [enabled, meetingId]);
}
