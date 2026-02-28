"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { GetMeetingParticipantsRequest, GetMeetingParticipantsResponse } from "./types";

export default async function getMeetingParticipants({
  meetingId,
  cursorId,
  size = 20,
}: GetMeetingParticipantsRequest): Promise<GetMeetingParticipantsResponse> {
  const cursorQuery = cursorId != null ? `&cursorId=${cursorId}` : "";
  const requestUrl = `/meetings/${meetingId}/participants?size=${size}${cursorQuery}`;
  return apiFetch<GetMeetingParticipantsResponse>(requestUrl, {
    method: "GET",
  });
}
