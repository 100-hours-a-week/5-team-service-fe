import { sessionStore } from "@/shared/lib/storage/seesionStorage";
import { ChatListRestore } from "../model/types";

const KEY = "chatList:restore";
const TTL_MS = 1000 * 60 * 30;

export const saveChatListRestore = (payload: Omit<ChatListRestore, "createdAt">) => {
  sessionStore.set(KEY, { ...payload, createdAt: Date.now() });
};

export const getChatListRestore = () => {
  const restoreData = sessionStore.get<ChatListRestore>(KEY);
  if (!restoreData) return null;
  if (Date.now() - restoreData.createdAt > TTL_MS) {
    sessionStore.remove(KEY);
    return null;
  }
  return restoreData;
};

export const clearChatListRestore = () => {
  sessionStore.remove(KEY);
};
