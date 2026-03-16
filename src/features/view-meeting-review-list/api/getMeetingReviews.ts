import { apiFetch } from "@/lib/api/apiFetch";
import type { GetMeetingReviewsParams, MeetingReviewListResponse } from "../model/types";

export default function getMeetingReviews({
  meetingId,
  size = 10,
  cursorId,
}: GetMeetingReviewsParams): Promise<MeetingReviewListResponse> {
  const cursorParam = cursorId ? `&cursorId=${cursorId}` : "";
  const requestUrl = `/reviews/meetings/${meetingId}?size=${size}${cursorParam}`;
  return apiFetch<MeetingReviewListResponse>(requestUrl, {
    method: "GET",
  });
}
