import { apiFetch } from "@/lib/api/apiFetch";
import { GetMeetingBookmarkResponse } from "../model/types";

export default function getMeetingBookmark({
  meetingId,
}: {
  meetingId: number;
}): Promise<GetMeetingBookmarkResponse> {
  const requestUrl = `/meetings/${meetingId}/bookmarks`;
  return apiFetch<GetMeetingBookmarkResponse>(requestUrl, {
    method: "GET",
  });
}
