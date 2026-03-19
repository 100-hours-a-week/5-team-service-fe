export type ChatListRestore = {
  anchorY: number;
  clickedIndex: number;
  createdAt: number;
  size: number;
};

type ChatPoisition = "AGREE" | "DISAGREE";

export type GetChatRoomQuizRequest = {
  roomId: number;
};

type QuizChoice = {
  choiceNumber: number;
  choiceText: string;
};

export type GetChatRoomQuizResponse = {
  question: string;
  choices: QuizChoice[];
  agreeCount: number;
  disagreeCount: number;
  maxPerPosition: number;
};

export type ParticipateChatRoomRequest = {
  roomId: number;
  position: ChatPoisition;
  quizAnswer: number;
};

export type ChatLobbyMember = {
  nickname: string;
  profileImageUrl: string;
  position: ChatPoisition;
};

export type ParticipateChatRoomResponse = {
  roomId: number;
  agreeCount: number;
  disagreeCount: number;
  maxPerPosition: number;
  members: ChatLobbyMember[];
};
