import { apiFetch } from "@/lib/api/apiFetch";
import { GetChatRoomInfoRequest, GetChatRoomInfoResponse } from "./types";

export default async function getChatRoomInfo(
  request: GetChatRoomInfoRequest,
): Promise<GetChatRoomInfoResponse> {
  const { roomId } = request;
  const requestUrl = `/chat-rooms/${roomId}`;
  return apiFetch<GetChatRoomInfoResponse>(requestUrl, {
    method: "GET",
  });
}
