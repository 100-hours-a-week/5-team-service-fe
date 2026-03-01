import { apiFetch } from "@/lib/api/apiFetch";
import { GetChatMessageRequest, GetChatMessageResponse } from "./types";

export async function getChatMessage(
  request: GetChatMessageRequest,
): Promise<GetChatMessageResponse> {
  const { roomId, size = 20, cursorId } = request;
  const cursorParams = cursorId ? `&cursorId=${cursorId}` : "";
  const requestUrl = `/chat-rooms/${roomId}/messages?size=${size}${cursorParams}`;
  return apiFetch<GetChatMessageResponse>(requestUrl, {
    method: "GET",
  });
}
