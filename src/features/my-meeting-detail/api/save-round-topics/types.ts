export type SaveRoundTopicsRequest = {
  roundId: number;
  topics: {
    topicNo: number;
    topic: string;
    source: "LEADER";
  }[];
};

export type SaveRoundTopicsResponse = {
  topics: {
    topicNo: number;
    topic: string;
    source: "LEADER" | "AI";
  }[];
};
