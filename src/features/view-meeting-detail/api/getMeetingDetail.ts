import { apiFetch } from "@/lib/api/apiFetch";
import type { GetMeetingDetailResponse } from "../model/types";

export default function getMeetingDetail(meetingId: number): Promise<GetMeetingDetailResponse> {
  const requestUrl = `/meetings/${meetingId}`;
  return apiFetch<GetMeetingDetailResponse>(requestUrl, {
    method: "GET",
  });
}
