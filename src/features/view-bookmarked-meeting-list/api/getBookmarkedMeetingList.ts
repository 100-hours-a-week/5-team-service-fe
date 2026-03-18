import { apiFetch } from "@/lib/api/apiFetch";
import type {
  GetBookmarkedMeetingListRequest,
  GetBookmarkedMeetingListResponse,
} from "../model/types";
import mapBookmarkedMeetingListResponse from "../lib/mapBookmarkedMeetingListResponse";
import { MeetingListResponse } from "@/entities/meeting/model/types";

export default function getBookmarkedMeetingList(
  request: GetBookmarkedMeetingListRequest,
): Promise<MeetingListResponse> {
  const { size = 6, cursorId } = request;
  const cursorParam = cursorId ? `&cursorId=${cursorId}` : "";
  const requestUrl = `/users/me/bookmarks/meetings?size=${size}${cursorParam}`;
  return apiFetch<GetBookmarkedMeetingListResponse>(requestUrl, {
    method: "GET",
  }).then(mapBookmarkedMeetingListResponse);
}
