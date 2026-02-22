import { textSchema, contentSchema, imageSchema } from "@/entities/user/model/schema";
import z from "zod";

export const EditUserProfileSchema = z.object({
  nickname: textSchema,
  leaderIntro: contentSchema,
  memberIntro: contentSchema,
  profileImageFile: imageSchema,
  profileImagePath: z.string(),
  profileImageKey: z.string(),
});
