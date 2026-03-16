import { serverApiFetch } from "@/shared/api/serverApiFetch";
import type { GetMeetingReviewsServerParams, MeetingReviewListResponse } from "../model/types";

export default function getMeetingReviewsServer({
  meetingId,
  size = 10,
  cursorId,
  requestInit,
}: GetMeetingReviewsServerParams) {
  const cursorParam = cursorId ? `&cursorId=${cursorId}` : "";
  const requestUrl = `/reviews/meetings/${meetingId}?size=${size}${cursorParam}`;
  return serverApiFetch<MeetingReviewListResponse>(requestUrl, {
    method: "GET",
    ...requestInit,
  });
}
