export type GetVoteResultRequest = {
  roomId: number;
};

export type VoteResultResponse = {
  agreeCount: number;
  disagreeCount: number;
  totalMemberCount: number;
  isClosed: boolean;
  myChoice: "AGREE" | "DISAGREE" | null;
};
