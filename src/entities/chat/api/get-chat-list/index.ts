import { apiFetch } from "@/lib/api/apiFetch";
import { GetChatListRequest, GetChatListResponse } from "./types";

export async function getChatList(request: GetChatListRequest): Promise<GetChatListResponse> {
  const { size = 6, cursorId } = request;
  const cursorParam = cursorId ? `&cursorId=${cursorId}` : "";
  const requestUrl = `/chat-rooms?size=${size}${cursorParam}`;
  return apiFetch<GetChatListResponse>(requestUrl, {
    method: "GET",
  });
}
