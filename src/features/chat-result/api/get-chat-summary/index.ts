import { apiFetch } from "@/lib/api/apiFetch";
import type { GetChatSummaryRequest, GetChatSummaryResponse } from "./types";

export default async function getChatSummary({
  roomId,
}: GetChatSummaryRequest): Promise<GetChatSummaryResponse> {
  const requestUrl = `/chat-rooms/${roomId}/summary`;
  return apiFetch<GetChatSummaryResponse>(requestUrl, {
    method: "GET",
  });
}
