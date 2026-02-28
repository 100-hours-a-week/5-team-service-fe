"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { DelegateMeetingLeaderRequest, DelegateMeetingLeaderResponse } from "./types";

export default async function delegateMeetingLeader({
  meetingId,
  newLeaderMeetingMemberId,
}: DelegateMeetingLeaderRequest): Promise<DelegateMeetingLeaderResponse> {
  const requestUrl = `/meetings/${meetingId}/leader`;
  return apiFetch<DelegateMeetingLeaderResponse>(requestUrl, {
    method: "PATCH",
    body: JSON.stringify({ newLeaderMeetingMemberId }),
  });
}
