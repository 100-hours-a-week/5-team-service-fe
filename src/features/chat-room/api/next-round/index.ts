import { apiFetch } from "@/lib/api/apiFetch";
import { NextRoundRequest } from "./types";

export default async function nextRound({ roomId }: NextRoundRequest) {
  return apiFetch<null>(`/chat-rooms/${roomId}/next-round`, {
    method: "PATCH",
  });
}
