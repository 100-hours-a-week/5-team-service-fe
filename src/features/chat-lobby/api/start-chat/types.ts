export type StartChatRequest = {
  roomId: number;
};

type Member = {
  nickname: string;
  profileImageUrl: string;
}

export type StartChatResponse = {
  topic: string;
  agreeMembers: Member[];
  disagreeMembers: Member[];
  currentCount: number;
  startedAt: string;
};
