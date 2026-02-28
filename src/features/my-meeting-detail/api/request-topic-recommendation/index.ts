"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { RequestTopicRecommendationRequest, RequestTopicRecommendationResponse } from "./types";

export default async function requestTopicRecommendation({
  meetingId,
  roundNo,
}: RequestTopicRecommendationRequest): Promise<RequestTopicRecommendationResponse> {
  const requestUrl = `/meetings/${meetingId}/rounds/${roundNo}/topic-recommendations`;
  return apiFetch<RequestTopicRecommendationResponse>(requestUrl, {
    method: "POST",
    timeoutMs: 70000,
  });
}
