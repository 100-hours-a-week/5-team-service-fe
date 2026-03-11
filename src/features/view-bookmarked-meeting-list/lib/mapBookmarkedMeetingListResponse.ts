import { MeetingListResponse } from "@/entities/meeting/model/types";
import type { GetBookmarkedMeetingListResponse } from "../model/types";

export default function mapBookmarkedMeetingListResponse(
  response: GetBookmarkedMeetingListResponse,
): MeetingListResponse {
  return {
    items: response.items.map((item) => ({
      ...item,
      readingGenreId: Number(item.readingGenreId ?? 0),
      remainingDays: Number(item.remainingDays ?? 0),
      isBookmarked: true,
    })),
    pageInfo: response.pageInfo,
  };
}
