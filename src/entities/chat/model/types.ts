export type Member = {
  nickname: string;
  profileImageUrl: string;
};

export type Chat = {
  roomId: number;
  topic: string;
  description: string;
  capacity: number;
  currentMemberCount: number;
  bookTitle: string;
  bookAuthors: string;
  bookThumbnailUrl: string;
};
