import { apiFetch } from "@/lib/api/apiFetch";
import { ExitChatRoomInfoRequest } from "./types";

export default async function exitChatRoom(request: ExitChatRoomInfoRequest) {
  const { roomId } = request;
  const requestUrl = `/chat-rooms/${roomId}/members/me`;
  return apiFetch(requestUrl, {
    method: "DELETE",
  });
}
