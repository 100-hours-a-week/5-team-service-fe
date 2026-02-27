import { apiFetch } from "@/lib/api/apiFetch";
import type { GetVoteResultRequest, VoteResultResponse } from "./types";

export default async function getVoteResult({
  roomId,
}: GetVoteResultRequest): Promise<VoteResultResponse> {
  return apiFetch<VoteResultResponse>(`/chat-rooms/${roomId}/vote`, {
    method: "GET",
  });
}
