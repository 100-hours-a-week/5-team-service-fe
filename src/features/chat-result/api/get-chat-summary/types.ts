export type GetChatSummaryRequest = {
  roomId: number;
};

export type ChatSummaryRound = {
  roundNumber: number;
  summary: {
    pro: string[];
    con: string[];
    mainIssues: string[];
    unresolvedIssues: string[];
  } | null;
};

export type GetChatSummaryResponse = {
  roomId: number;
  topic: string;
  rounds: ChatSummaryRound[];
};
