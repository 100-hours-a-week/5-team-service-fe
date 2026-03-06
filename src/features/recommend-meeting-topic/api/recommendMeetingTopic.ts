"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { RecommendMeetingTopicRequest, RecommendMeetingTopicResponse } from "./types";

export default async function recommendMeetingTopic({
  meetingId,
  roundNo,
}: RecommendMeetingTopicRequest): Promise<RecommendMeetingTopicResponse> {
  const requestUrl = `/meetings/${meetingId}/rounds/${roundNo}/topic-recommendations`;
  return apiFetch<RecommendMeetingTopicResponse>(requestUrl, {
    method: "POST",
    timeoutMs: 70000,
  });
}
