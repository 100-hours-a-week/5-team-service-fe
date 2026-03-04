import { apiFetch } from "@/lib/api/apiFetch";
import { MeetingDetailForEditResponse } from "./types";

export async function getMeetingDetail(meetingId: number): Promise<MeetingDetailForEditResponse> {
  const requestUrl = `/meetings/${meetingId}`;
  return apiFetch<MeetingDetailForEditResponse>(requestUrl, {
    method: "GET",
  });
}
