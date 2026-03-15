import { MeetingItem } from "@/entities/meeting/model/types";

export type MeetingListResponse = {
  items: MeetingItem[];
  pageInfo: {
    nextCursorId: number;
    hasNext: boolean;
    size: number;
  };
};

export type GetMeetingListServerParams = {
  size?: number;
  cursorId?: number;
  requestInit?: RequestInit & { timeoutMs?: number };
};

export type MeetingListRestore = {
  anchorY: number;
  clickedIndex: number;
  createdAt: number;
  size: number;
};
