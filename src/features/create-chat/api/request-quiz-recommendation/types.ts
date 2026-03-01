export type RequestQuizRecommendationRequest = {
  author: string;
  title: string;
};

export type QuizRecommendationChoice = {
  choiceNumber: number;
  choiceText: string;
};

export type RequestQuizRecommendationResponse = {
  question: string;
  correctChoiceNumber: number;
  choices: QuizRecommendationChoice[];
};
