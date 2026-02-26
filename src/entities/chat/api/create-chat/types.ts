export type CreateChatRequest = {
  topic: string;
  description: string;
  isbn: string;
  capacity: number;
  position: string;
  quiz: {
    question: string;
    choices: {
      choiceNumber: number;
      text: string;
    }[];
    correctChoiceNumber: number;
  };
};

export type CreateChatResponse = {
  roomId: number;
};
