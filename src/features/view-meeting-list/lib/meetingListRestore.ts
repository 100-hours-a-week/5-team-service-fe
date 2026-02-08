import { sessionStore } from "@/shared/lib/storage/seesionStorage";
import { MeetingListRestore } from "../model/types";

const KEY = "meetingList:restore";
const TTL_MS = 1000 * 60 * 30;

export function saveMeetingListRestore(payload: Omit<MeetingListRestore, "createdAt">) {
  sessionStore.set(KEY, { ...payload, createdAt: Date.now() });
}

export function getMeetingListRestore() {
  const restoreData = sessionStore.get<MeetingListRestore>(KEY);
  if (!restoreData) return null;
  if (Date.now() - restoreData.createdAt > TTL_MS) {
    sessionStore.remove(KEY);
    return null;
  }
  return restoreData;
}

export function clearMeetingListRestore() {
  sessionStore.remove(KEY);
}
