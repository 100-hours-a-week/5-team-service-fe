export type Position = "AGREE" | "DISAGREE";

export type ChatLobbyMemberRole = "HOST" | "PARTICIPANT";

export type ChatLobbyMember = {
  nickname: string;
  profileImageUrl: string | null;
  position: Position;
  role: ChatLobbyMemberRole;
};

export type ChatLobbyInfo = {
  roomId: number;
  agreeCount: number;
  disagreeCount: number;
  maxPerPosition: number;
  members: ChatLobbyMember[];
};

export type ChatLobbyStartResponse = {
  roomId?: number;
};

