import {
  capacitySchema,
  contentSchema,
  dateStringSchema,
  optionaImageSchema,
  readingGenreIdSchema,
  textSchema,
} from "@/entities/meeting/model/schema";
import z from "zod";

export const EditMeetingSchema = z.object({
  meetingImageFile: optionaImageSchema,
  meetingImagePath: z.string(),
  title: textSchema,
  description: contentSchema,
  readingGenreId: readingGenreIdSchema,
  capacity: capacitySchema,
  leaderIntro: contentSchema,
  leaderIntroSavePolicy: z.boolean(),
  recruitmentDeadline: dateStringSchema,
});
