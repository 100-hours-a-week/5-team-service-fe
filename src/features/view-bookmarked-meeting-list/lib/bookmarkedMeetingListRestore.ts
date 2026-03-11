import { sessionStore } from "@/shared/lib/storage/seesionStorage";
import type { BookmarkedMeetingListRestore } from "../model/types";

const KEY = "bookmarkedMeetingList:restore";
const TTL_MS = 1000 * 60 * 30;

export function saveBookmarkedMeetingListRestore(
  payload: Omit<BookmarkedMeetingListRestore, "createdAt">,
) {
  sessionStore.set(KEY, { ...payload, createdAt: Date.now() });
}

export function getBookmarkedMeetingListRestore() {
  const restoreData = sessionStore.get<BookmarkedMeetingListRestore>(KEY);
  if (!restoreData) return null;
  if (Date.now() - restoreData.createdAt > TTL_MS) {
    sessionStore.remove(KEY);
    return null;
  }
  return restoreData;
}

export function clearBookmarkedMeetingListRestore() {
  sessionStore.remove(KEY);
}
