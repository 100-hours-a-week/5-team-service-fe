"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { KickMeetingMemberRequest } from "./types";

export default async function kickMeetingMember({ meetingId, memberId }: KickMeetingMemberRequest) {
  const requestUrl = `/meetings/${meetingId}/members/${memberId}`;
  return apiFetch<null>(requestUrl, {
    method: "DELETE",
  });
}
