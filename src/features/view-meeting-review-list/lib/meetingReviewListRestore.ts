import { sessionStore } from "@/shared/lib/storage/seesionStorage";
import type { MeetingReviewListRestore } from "../model/types";

const KEY_PREFIX = "meetingReviewList:restore:";
const TTL_MS = 1000 * 60 * 30;

function getKey(meetingId: number) {
  return `${KEY_PREFIX}${meetingId}`;
}

export function saveMeetingReviewListRestore(
  meetingId: number,
  payload: Omit<MeetingReviewListRestore, "createdAt">,
) {
  sessionStore.set(getKey(meetingId), { ...payload, createdAt: Date.now() });
}

export function getMeetingReviewListRestore(meetingId: number) {
  const restoreData = sessionStore.get<MeetingReviewListRestore>(getKey(meetingId));
  if (!restoreData) return null;
  if (Date.now() - restoreData.createdAt > TTL_MS) {
    sessionStore.remove(getKey(meetingId));
    return null;
  }
  return restoreData;
}

export function clearMeetingReviewListRestore(meetingId: number) {
  sessionStore.remove(getKey(meetingId));
}
