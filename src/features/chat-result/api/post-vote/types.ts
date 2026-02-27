export type VoteChoice = "AGREE" | "DISAGREE";

export type PostVoteRequest = {
  roomId: number;
  choice: VoteChoice;
};
