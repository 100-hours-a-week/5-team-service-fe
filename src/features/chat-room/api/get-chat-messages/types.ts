import { ChatRoomMessageInbound } from "@/shared/lib/stomp/types";

export type GetChatMessageRequest = {
  roomId: number;
  size?: number;
  cursorId?: number;
};

export type GetChatMessageResponse = {
  messages: ChatRoomMessageInbound[];
};
