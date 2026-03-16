import { sessionStore } from "@/shared/lib/storage/seesionStorage";
import type { MyReviewListRestore } from "../model/types";

const KEY = "myReviewList:restore";
const TTL_MS = 1000 * 60 * 30;

export function saveMyReviewListRestore(payload: Omit<MyReviewListRestore, "createdAt">) {
  sessionStore.set(KEY, { ...payload, createdAt: Date.now() });
}

export function getMyReviewListRestore() {
  const restoreData = sessionStore.get<MyReviewListRestore>(KEY);
  if (!restoreData) return null;
  if (Date.now() - restoreData.createdAt > TTL_MS) {
    sessionStore.remove(KEY);
    return null;
  }
  return restoreData;
}

export function clearMyReviewListRestore() {
  sessionStore.remove(KEY);
}
