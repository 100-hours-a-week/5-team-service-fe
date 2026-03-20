type MeetingRoundInfo = {
  roundNo: number;
  date: string;
  book: {
    title: string;
    authors: string;
    publisher: string;
    thumbnailUrl: string;
    publishedAt: string;
  };
};

export type GetMeetingDetailResponse = {
  meeting: {
    meetingId: number;
    createdAt: string;
    status: "RECRUITING" | "FINISHED" | "CANCELED";
    meetingImagePath: string;
    isBookmarked?: boolean;
    title: string;
    description: string;
    readingGenreId: number;
    capacity: number;
    currentCount: number;
    recruitmentDeadline: string;
    roundCount: number;
    time: {
      startTime: string;
      endTime: string;
    };
    leader: {
      nickname: string;
      profileImagePath: string;
      intro: string;
      averageRating: number;
      leaderMeetingCount: number;
    };
  };
  rounds: MeetingRoundInfo[];
};
