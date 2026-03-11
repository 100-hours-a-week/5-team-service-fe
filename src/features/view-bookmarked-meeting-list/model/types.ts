import type { MeetingItem } from "@/entities/meeting/model/types";

export type GetBookmarkedMeetingListRequest = {
  size?: number;
  cursorId?: number;
};

export type GetBookmarkedMeetingListResponse = {
  items: MeetingItem[];
  pageInfo: {
    nextCursorId: number;
    hasNext: boolean;
    size: number;
  };
};

export type BookmarkedMeetingListRestore = {
  anchorY: number;
  clickedIndex: number;
  createdAt: number;
  size: number;
};
