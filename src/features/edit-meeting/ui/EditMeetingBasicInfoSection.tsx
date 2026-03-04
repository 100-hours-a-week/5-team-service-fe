"use client";

import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import DatePickerField from "@/shared/ui/form/DatePickerField";
import DropdownField from "@/shared/ui/form/DropdownField";
import ImageField from "@/shared/ui/form/ImageField";
import NumberStepperField from "@/shared/ui/form/NumberStepperField";
import TextAreaField from "@/shared/ui/form/TextAreaField";
import TextField from "@/shared/ui/form/TextField";
import { useReadingGenresQuery } from "@/entities/policy/api/useReadingGenresQuery";

type EditMeetingBasicInfoSectionProps = {
  currentMemberCount: number;
  maxRecruitmentDeadlineDate?: Date;
};

export default function EditMeetingBasicInfoSection({
  currentMemberCount,
  maxRecruitmentDeadlineDate,
}: EditMeetingBasicInfoSectionProps) {
  const { watch, setValue, register } = useFormContext();
  const capacityValue = watch("capacity") as number;
  const minCapacity = Math.max(3, currentMemberCount);

  const { genres } = useReadingGenresQuery();
  const genreOptions = useMemo(
    () => (genres ?? []).map((genre) => ({ value: genre.id, label: genre.name })),
    [genres],
  );
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  useEffect(() => {
    if (!Number.isFinite(capacityValue)) return;
    if (capacityValue >= minCapacity) return;
    setValue("capacity", minCapacity, { shouldDirty: true, shouldValidate: true });
  }, [capacityValue, minCapacity, setValue]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-base font-semibold text-gray-900">모임 대표 이미지</div>
        <ImageField
          urlName="meetingImagePath"
          fileName="meetingImageFile"
          label="모임 이미지"
          variant="rect"
        />
      </div>

      <TextField
        name="title"
        label="모임명"
        placeholder="모임명을 만들어주세요. (최소 2자, 최대 50자)"
        maxLength={50}
      />
      <TextAreaField
        name="description"
        label="모임 설명"
        placeholder={`모임에 대해 소개해주세요. 분위기, 진행 방식 등 어떤 정보라도 좋아요!\n(최소 2자, 최대 300자)`}
        maxLength={300}
      />
      <TextAreaField
        name="leaderIntro"
        label="모임장 소개"
        placeholder="모임원들에게 자신을 소개해보세요!"
        maxLength={300}
      />
      <label className="-mt-3 flex items-center gap-2 text-sm font-medium text-gray-600">
        <input
          type="checkbox"
          className="h-4 w-4 accent-primary rounded border-gray-300 text-primary focus:ring-primary"
          {...register("leaderIntroSavePolicy")}
        />
        이 모임장 소개글 계속 사용하기
      </label>
      <DropdownField
        name="readingGenreId"
        label="장르 선택"
        options={genreOptions}
        placeholder="장르를 선택해주세요."
      />
      <NumberStepperField name="capacity" label="모집 인원" unit="명" min={minCapacity} max={8} />
      <DatePickerField
        name="recruitmentDeadline"
        label="모집 마감일"
        minDate={today}
        maxDate={maxRecruitmentDeadlineDate}
      />
    </div>
  );
}
