import { uploadImageToS3 } from "@/shared/lib/uploadImageToS3";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { EditMeetingFormValues } from "./types";
import { EditMeetingRequest } from "@/entities/meeting/api/edit-meeting/types";
import editMeeting from "@/entities/meeting/api/edit-meeting";
import { FieldNamesMarkedBoolean } from "react-hook-form";

export function useEditMeeting() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = async ({
    values,
    meetingId,
    dirtyFields,
  }: {
    values: EditMeetingFormValues;
    meetingId: number;
    dirtyFields: FieldNamesMarkedBoolean<EditMeetingFormValues>;
  }) => {
    const meetingImageFile = values.meetingImageFile as File | undefined;
    const request: EditMeetingRequest = {};

    if (dirtyFields.meetingImageFile && meetingImageFile) {
      const { key } = await uploadImageToS3({ file: meetingImageFile, directory: "MEETING" });
      request.meetingImagePath = key;
    }

    if (dirtyFields.title) request.title = values.title;
    if (dirtyFields.description) request.description = values.description;
    if (dirtyFields.readingGenreId) request.readingGenreId = values.readingGenreId;
    if (dirtyFields.capacity) request.capacity = values.capacity;
    if (dirtyFields.leaderIntro) request.leaderIntro = values.leaderIntro;
    if (dirtyFields.leaderIntroSavePolicy)
      request.leaderIntroSavePolicy = values.leaderIntroSavePolicy;
    if (dirtyFields.recruitmentDeadline) request.recruitmentDeadline = values.recruitmentDeadline;

    if (Object.keys(request).length === 0) {
      router.push(`/my-meeting/${meetingId}`);
      return;
    }

    const { meetingId: EditedMeetingId } = await editMeeting({ request, meetingId });

    if (EditedMeetingId) {
      await queryClient.invalidateQueries({ queryKey: ["meetings"] });
      await queryClient.invalidateQueries({ queryKey: ["my-meeting"] });
    }

    router.push(`/my-meeting/${meetingId}`);
  };

  return { onSubmit };
}
