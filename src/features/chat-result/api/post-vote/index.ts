import { apiFetch } from "@/lib/api/apiFetch";
import type { PostVoteRequest } from "./types";

export default async function postVote({ roomId, choice }: PostVoteRequest) {
  return apiFetch<null>(`/chat-rooms/${roomId}/vote`, {
    method: "POST",
    body: JSON.stringify({ choice }),
  });
}
