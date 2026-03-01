import { ChatLobbyMember } from "../../model/types";

export type GetChatLobbyInfoRequest = {
  roomId: number;
};

export type GetChatLobbyInfoResponse = {
  roomId: number;
  agreeCount: number;
  disagreeCount: number;
  maxPerPosition: number;
  members: ChatLobbyMember[];
};
