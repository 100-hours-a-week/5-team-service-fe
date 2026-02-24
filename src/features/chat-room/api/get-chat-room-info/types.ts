import { Member } from "@/entities/chat/model/types";

export type GetChatRoomInfoRequest = {
  roomId: number;
};

export type GetChatRoomInfoResponse = {
  topic: string;
  agreeMembers: Member[];
  disagreeMembers: Member[];
  currentCount: number;
  startedAt: string;
};
