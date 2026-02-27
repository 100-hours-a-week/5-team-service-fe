import { apiFetch } from "@/lib/api/apiFetch";
import { StartChatRequest, StartChatResponse } from "./types";

export default async function startChat(request: StartChatRequest): Promise<StartChatResponse> {
  const { roomId } = request;
  const requestUrl = `/chat-rooms/${roomId}`;
  return apiFetch(requestUrl, {
    method: "PATCH",
  });
}
