export type MeetingDetailForEditResponse = {
  meeting: {
    meetingId: number;
    meetingImagePath: string;
    title: string;
    description: string;
    readingGenreId: number;
    capacity: number;
    recruitmentDeadline: string;
    time: {
      startTime: string;
      endTime: string;
    };
    leader: {
      intro: string;
    };
  };
  rounds?: {
    roundNo: number;
    date: string;
    book: {
      isbn?: string;
      title: string;
      authors: string;
      publisher: string;
      thumbnailUrl: string;
      publishedAt: string;
    } | null;
  }[];
};
