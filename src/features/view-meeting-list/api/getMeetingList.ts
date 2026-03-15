import { apiFetch } from "@/lib/api/apiFetch";
import type { GetMeetingListParams, MeetingListResponse } from "../model/types";

export default function getMeetingList({ size = 10, cursorId }: GetMeetingListParams) {
  const cursorParam = cursorId ? `&cursorId=${cursorId}` : "";
  const url = `/meetings?size=${size}${cursorParam}`;
  return apiFetch<MeetingListResponse>(url, {
    method: "GET",
  });
}
