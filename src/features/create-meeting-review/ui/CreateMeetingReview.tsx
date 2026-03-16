"use client";

import { FormProvider } from "react-hook-form";
import TextAreaField from "@/shared/ui/form/TextAreaField";
import useCreateMeetingReviewForm from "../model/useCreateMeetingReviewForm";
import MeetingRatingField from "./MeetingRatingField";
import MeetingReviewImage from "./MeetingReviewImage";
import MeetingBestMemberSelection from "./MeetingBestMemberSelection";

type CreateMeetingReviewProps = {
  roundId: number;
  meetingId?: number | null;
};

export default function CreateMeetingReview({ roundId, meetingId }: CreateMeetingReviewProps) {
  const {
    bestMemberError,
    bestMemberId,
    canSubmit,
    handleAppendImages,
    handleRemoveImage,
    handleSetBestMemberId,
    handleSetLeaderRating,
    handleSetMeetingRating,
    images,
    imagePreviewUrls,
    imagesError,
    isInvalidRound,
    isMembersError,
    isMembersLoading,
    isMissingMeetingId,
    isSubmitting,
    leaderRating,
    leaderRatingError,
    meetingRating,
    meetingRatingError,
    members,
    reviewForm,
    submitError,
    submitReview,
  } = useCreateMeetingReviewForm({ roundId, meetingId });

  if (isInvalidRound) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-gray-500">
        유효하지 않은 회차입니다.
      </div>
    );
  }

  if (isMissingMeetingId) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-gray-500">
        모임 정보를 찾을 수 없어 후기 작성이 불가능합니다.
      </div>
    );
  }

  return (
    <FormProvider {...reviewForm}>
      <>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-8">
          <div className="space-y-8">
            <MeetingRatingField
              title="이번 모임은 어떠셨나요?"
              description="전체적인 모임 분위기와 만족도를 평가해 주세요."
              value={meetingRating}
              onChange={handleSetMeetingRating}
              errorMessage={meetingRatingError}
            />

            <MeetingRatingField
              title="모임장 진행은 어떠셨나요?"
              description="토론 진행 방식과 참여 유도를 기준으로 평가해 주세요."
              value={leaderRating}
              onChange={handleSetLeaderRating}
              errorMessage={leaderRatingError}
            />

            <MeetingBestMemberSelection
              members={members}
              selectedMemberId={bestMemberId}
              onSelectMember={handleSetBestMemberId}
              isLoading={isMembersLoading}
              isError={isMembersError}
              errorMessage={bestMemberError}
            />

            <TextAreaField
              name="content"
              label="모임 후기"
              placeholder="모임에 대한 전반적인 후기를 남겨주세요."
              maxLength={200}
            />

            <MeetingReviewImage
              images={images}
              imagePreviewUrls={imagePreviewUrls}
              onAppendImages={handleAppendImages}
              onRemoveImage={handleRemoveImage}
              errorMessage={imagesError}
            />

            {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
          </div>
        </div>

        <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
          <button
            type="button"
            onClick={submitReview}
            disabled={!canSubmit}
            className={`h-12 w-full rounded-xl text-sm font-semibold text-white ${
              canSubmit ? "bg-primary" : "bg-gray-200 text-gray-500"
            }`}
          >
            {isSubmitting ? "후기 저장 중..." : "후기 작성 완료"}
          </button>
        </div>
      </>
    </FormProvider>
  );
}
