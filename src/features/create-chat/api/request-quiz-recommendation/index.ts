"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { RequestQuizRecommendationRequest, RequestQuizRecommendationResponse } from "./types";

export default async function requestQuizRecommendation(
  request: RequestQuizRecommendationRequest,
): Promise<RequestQuizRecommendationResponse> {
  return apiFetch<RequestQuizRecommendationResponse>("/chat-rooms/quiz-recommendations", {
    method: "POST",
    body: JSON.stringify(request),
    timeoutMs: 70000,
  });
}
