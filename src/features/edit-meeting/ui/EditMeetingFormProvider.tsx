"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEditMeeting } from "../model/useEditMeeting";
import { editMeetingDefaultValues, EditMeetingFormValues } from "../model/types";
import { EditMeetingSchema } from "../model/schema";
import EditMeetingForm from "./EditMeetingForm";
import { getMeetingDetail } from "@/entities/meeting/api/get-meeting-detail";
import { MeetingDetailForEditResponse } from "@/entities/meeting/api/get-meeting-detail/types";
import getMyMeetingDetail from "@/features/my-meeting-detail/api/get-my-meeting-detail";
import type { GetMyMeetingDetailResponse } from "@/features/my-meeting-detail/api/get-my-meeting-detail/types";

type MyMeetingDetailCache = {
  meetingId: number;
  meetingImagePath: string;
  title: string;
  capacity: number;
  currentMemberCount?: number;
};

const getLatestDate = (dateStrings: string[]): Date | undefined => {
  let latest: Date | undefined;

  dateStrings.forEach((value) => {
    if (!value) return;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return;
    if (!latest || parsed.getTime() > latest.getTime()) {
      latest = parsed;
    }
  });

  if (!latest) return undefined;
  latest.setHours(0, 0, 0, 0);
  return latest;
};

const mapDetailToFormValues = (
  detail: MeetingDetailForEditResponse,
  fallback?: MyMeetingDetailCache | GetMyMeetingDetailResponse,
): EditMeetingFormValues => {
  const { meeting } = detail;

  return {
    ...editMeetingDefaultValues,
    meetingImagePath: meeting.meetingImagePath ?? fallback?.meetingImagePath ?? "",
    title: meeting.title ?? fallback?.title ?? "",
    description: meeting.description ?? "",
    readingGenreId: meeting.readingGenreId ?? editMeetingDefaultValues.readingGenreId,
    capacity: meeting.capacity ?? fallback?.capacity ?? editMeetingDefaultValues.capacity,
    leaderIntro: meeting.leader?.intro ?? "",
    leaderIntroSavePolicy: editMeetingDefaultValues.leaderIntroSavePolicy,
    recruitmentDeadline: meeting.recruitmentDeadline ?? "",
  };
};

export const EditMeetingFormProvider = ({ meetingId }: { meetingId: number }) => {
  const queryClient = useQueryClient();

  const editMeetingForm = useForm<EditMeetingFormValues>({
    resolver: zodResolver(EditMeetingSchema),
    defaultValues: editMeetingDefaultValues,
    mode: "onChange",
  });

  const cachedMeetingDetail = queryClient.getQueryData<MeetingDetailForEditResponse>([
    "meetingDetail",
    meetingId,
  ]);
  const cachedMyMeetingDetail = queryClient.getQueryData<MyMeetingDetailCache>([
    "myMeetingDetail",
    meetingId,
  ]);

  const { data } = useQuery({
    queryKey: ["meetingDetail", meetingId],
    queryFn: () => getMeetingDetail(meetingId),
    enabled: Boolean(meetingId),
    initialData: cachedMeetingDetail,
    staleTime: 1000 * 60 * 5,
  });

  const { data: myMeetingDetail } = useQuery({
    queryKey: ["myMeetingDetail", meetingId],
    queryFn: () => getMyMeetingDetail({ meetingId }),
    enabled: Boolean(meetingId),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!data) {
      if (cachedMyMeetingDetail) {
        editMeetingForm.reset({
          ...editMeetingDefaultValues,
          meetingImagePath: cachedMyMeetingDetail.meetingImagePath,
          title: cachedMyMeetingDetail.title,
          capacity: cachedMyMeetingDetail.capacity,
        });
      }
      return;
    }

    editMeetingForm.reset(mapDetailToFormValues(data, myMeetingDetail ?? cachedMyMeetingDetail));
  }, [data, myMeetingDetail, cachedMyMeetingDetail, editMeetingForm]);

  const { onSubmit } = useEditMeeting();

  const currentMemberCount = Math.max(
    0,
    myMeetingDetail?.currentMemberCount ?? cachedMyMeetingDetail?.currentMemberCount ?? 0,
  );
  const maxRecruitmentDeadlineDate = useMemo(() => {
    const datesFromEditDetail = (data?.rounds ?? []).map((round) => round.date);
    const datesFromMyDetail = (myMeetingDetail?.rounds ?? []).map((round) => round.meetingDate);
    return getLatestDate([...datesFromEditDetail, ...datesFromMyDetail]);
  }, [data?.rounds, myMeetingDetail?.rounds]);

  return (
    <FormProvider {...editMeetingForm}>
      <form
        className="h-full w-full overflow-hidden"
        onSubmit={editMeetingForm.handleSubmit(async (values: EditMeetingFormValues) => {
          await onSubmit({ values, meetingId, dirtyFields: editMeetingForm.formState.dirtyFields });
        })}
      >
        <EditMeetingForm
          currentMemberCount={currentMemberCount}
          maxRecruitmentDeadlineDate={maxRecruitmentDeadlineDate}
        />
      </form>
    </FormProvider>
  );
};
