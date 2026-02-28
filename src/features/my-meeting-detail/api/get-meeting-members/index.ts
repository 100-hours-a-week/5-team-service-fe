"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { GetMeetingMembersRequest, GetMeetingMembersResponse } from "./types";

export default async function getMeetingMembers({
  meetingId,
}: GetMeetingMembersRequest): Promise<GetMeetingMembersResponse> {
  const requestUrl = `/meetings/${meetingId}/members`;
  return apiFetch<GetMeetingMembersResponse>(requestUrl, {
    method: "GET",
  });
}
