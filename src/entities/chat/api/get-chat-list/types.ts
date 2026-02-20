import { Chat } from "../../model/types";

export type GetChatListRequest = {
  size?: number;
  cursorId?: number;
};

export type GetChatListResponse = {
  items: Chat[];
  pageInfo: {
    nextCursorId: number | null;
    hasNext: boolean;
    size: number;
  };
};
