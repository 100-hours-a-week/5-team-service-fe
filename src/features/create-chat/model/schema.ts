import {
  capacitySchema,
  isbnSchema,
  positionSchema,
  quizSchema,
  textSchema,
} from "@/entities/chat/model/schema";
import z from "zod";

export const CreateChatSchema = z.object({
  topic: textSchema(2, 50, "토론 주제"),
  description: textSchema(2, 50, "주제 설명"),
  isbn: isbnSchema,
  capacity: capacitySchema,
  position: positionSchema,
  quiz: quizSchema,
});
