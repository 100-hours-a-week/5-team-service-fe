import z from "zod";
import { EditMeetingSchema } from "./schema";

export type EditMeetingFormValues = z.infer<typeof EditMeetingSchema>;

export const editMeetingDefaultValues: EditMeetingFormValues = {
  meetingImageFile: undefined,
  meetingImagePath: "",
  title: "",
  description: "",
  readingGenreId: 1,
  capacity: 4,
  leaderIntro: "",
  leaderIntroSavePolicy: false,
  recruitmentDeadline: "",
};
