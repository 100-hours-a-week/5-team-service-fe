"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { SaveRoundTopicsRequest, SaveRoundTopicsResponse } from "./types";

export default async function saveRoundTopics({
  roundId,
  topics,
}: SaveRoundTopicsRequest): Promise<SaveRoundTopicsResponse> {
  return apiFetch<SaveRoundTopicsResponse>(`/meeting-rounds/${roundId}/topics`, {
    method: "PUT",
    body: JSON.stringify({ topics }),
  });
}
