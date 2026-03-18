import { serverApiFetch } from "@/shared/api/serverApiFetch";
import type { GetMeetingListServerParams, MeetingListResponse } from "../model/types";

export default function getMeetingListServer({
  size = 10,
  cursorId,
  requestInit,
}: GetMeetingListServerParams) {
  const cursorParam = cursorId ? `&cursorId=${cursorId}` : "";
  const requestUrl = `/meetings?size=${size}${cursorParam}`;
  return serverApiFetch<MeetingListResponse>(requestUrl, {
    method: "GET",
    ...requestInit,
  });
}
