import { sessionStore } from "./seesionStorage";

const KEY = "meetingReview:routeContextByRound";
const TTL_MS = 1000 * 60 * 30;

type ReviewRouteContextMap = Record<string, { meetingId: number; createdAt: number }>;

export function saveMeetingIdForReviewRoute({
  roundId,
  meetingId,
}: {
  roundId: number;
  meetingId: number;
}) {
  const stored = sessionStore.get<ReviewRouteContextMap>(KEY) ?? {};
  stored[String(roundId)] = {
    meetingId,
    createdAt: Date.now(),
  };
  sessionStore.set(KEY, stored);
}

export function getMeetingIdForReviewRoute(roundId: number): number | null {
  const stored = sessionStore.get<ReviewRouteContextMap>(KEY);
  if (!stored) return null;

  const entry = stored[String(roundId)];
  if (!entry) return null;

  if (Date.now() - entry.createdAt > TTL_MS) {
    delete stored[String(roundId)];
    sessionStore.set(KEY, stored);
    return null;
  }

  return entry.meetingId;
}

export function clearMeetingIdForReviewRoute(roundId: number) {
  const stored = sessionStore.get<ReviewRouteContextMap>(KEY);
  if (!stored) return;
  delete stored[String(roundId)];
  sessionStore.set(KEY, stored);
}
