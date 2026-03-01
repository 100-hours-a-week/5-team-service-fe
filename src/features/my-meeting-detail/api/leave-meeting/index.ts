"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { LeaveMeetingRequest } from "./types";

export default async function leaveMeeting({ meetingId }: LeaveMeetingRequest) {
  return apiFetch<null>(`/meetings/${meetingId}/members/me`, {
    method: "DELETE",
  });
}
