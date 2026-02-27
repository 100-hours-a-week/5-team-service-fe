import { apiFetch } from "@/lib/api/apiFetch";
import { GetChatLobbyInfoRequest, GetChatLobbyInfoResponse } from "./types";

export default async function getChatLobbyInfo({
  roomId,
}: GetChatLobbyInfoRequest): Promise<GetChatLobbyInfoResponse> {
  const requestUrl = `/chat-rooms/${roomId}/waiting-room`;
  return apiFetch<GetChatLobbyInfoResponse>(requestUrl, {
    method: "GET",
  });
}
