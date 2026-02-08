import { apiFetch } from "@/lib/api/apiFetch";
import { MeetingListResponse } from "../model/types";

export const fetchMeetings = ({ size = 6, cursorId }: { size?: number; cursorId?: number }) => {
  const cursorParam = cursorId ? `&cursorId=${cursorId}` : "";
  const url = `/meetings?size=${size}${cursorParam}`;
  return apiFetch<MeetingListResponse>(url, {});
};
