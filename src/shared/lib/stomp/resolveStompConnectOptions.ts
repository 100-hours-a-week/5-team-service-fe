import { authStore } from "@/shared/store/authStore";
import { ConnectOptions } from "./types";

const normalize = (value: string) => value.replace(/\/+$/, "");

function resolveApiBaseUrl() {
  const chatBase = process.env.NEXT_PUBLIC_CHAT_BASE_URL;
  if (chatBase) {
    const normalizedChatBase = normalize(chatBase);
    return normalizedChatBase;
  }

  return null;
}

export function resolveStompConnectOptions(): ConnectOptions | null {
  // const apiBaseUrl = resolveApiBaseUrl();
  // if (!apiBaseUrl) return null;

  return {
    apiBaseUrl: "https://dev.doktori.kr",
    wsPath: "/ws/chat",
    getAccessToken: () => authStore.getAccessToken(),
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: true,
  };
}
