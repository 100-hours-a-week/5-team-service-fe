"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { UpdateMeetingParticipationRequest, UpdateMeetingParticipationResponse } from "./types";

export default async function updateMeetingParticipation({
  meetingId,
  joinRequestId,
  status,
}: UpdateMeetingParticipationRequest): Promise<UpdateMeetingParticipationResponse> {
  const requestUrl = `/meetings/${meetingId}/participations/${joinRequestId}`;

  return apiFetch<UpdateMeetingParticipationResponse>(requestUrl, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
