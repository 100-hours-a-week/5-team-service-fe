import z from "zod";
import { CreateChatSchema } from "./schema";

export type CreateChatFormValues = z.infer<typeof CreateChatSchema>;

export type CreateChatFormSteps = {
  step: 1 | 2;
};

export const createChatDefaultValues: CreateChatFormValues = {
  topic: "",
  description: "",
  isbn: "",
  capacity: 2,
  position: "AGREE",
  quiz: {
    question: "",
    choices: [
      { choiceNumber: 1, text: "" },
      { choiceNumber: 2, text: "" },
      { choiceNumber: 3, text: "" },
      { choiceNumber: 4, text: "" },
    ],
    correctChoiceNumber: 1,
  },
};
