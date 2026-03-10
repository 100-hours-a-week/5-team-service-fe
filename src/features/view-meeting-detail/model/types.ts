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
      userId: number;
      nickname: string;
      profileImagePath: string;
      intro: string;
    };
  };
  rounds: {
    roundNo: number;
    date: string;
    book: {
      title: string;
      authors: string;
      publisher: string;
      thumbnailUrl: string;
      publishedAt: string;
    };
  }[];
  participantsPreview: {
    previewCount: number;
    profileImages: string[];
    myParticipationStatus: "NONE" | "PENDING" | "APPROVED" | "LEFT" | "REJECTED" | "KICKED";
  };
};

export type MeetingDetailResponse = GetMeetingDetailResponse;
