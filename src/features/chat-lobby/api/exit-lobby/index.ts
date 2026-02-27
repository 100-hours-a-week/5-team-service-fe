import { apiFetch } from "@/lib/api/apiFetch";
import { ExitLobbyRequest } from "./types";

export default async function exitLobby(request: ExitLobbyRequest) {
  const { roomId } = request;
  const requestUrl = `/chat-rooms/${roomId}/members/me`;
  return apiFetch(requestUrl, {
    method: "DELETE",
  });
}
