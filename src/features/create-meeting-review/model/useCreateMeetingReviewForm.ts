"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import getReviewCandidateMembers from "../api/getReviewCandidateMembers";
import createMeetingRoundReview from "../api/createMeetingRoundReview";
import uploadReviewImages from "../lib/uploadReviewImages";
import { CreateMeetingReviewSchema } from "./schema";
import { createMeetingReviewDefaultValues, type CreateMeetingReviewFormValues } from "./types";
import {
  clearMeetingIdForReviewRoute,
  getMeetingIdForReviewRoute,
} from "@/shared/lib/storage/reviewRouteContext";

type UseCreateMeetingReviewFormParams = {
  roundId: number;
  meetingId?: number | null;
};

export default function useCreateMeetingReviewForm({
  roundId,
  meetingId,
}: UseCreateMeetingReviewFormParams) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reviewForm = useForm<CreateMeetingReviewFormValues>({
    resolver: zodResolver(CreateMeetingReviewSchema),
    defaultValues: createMeetingReviewDefaultValues,
    mode: "onChange",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const imagePreviewUrlsRef = useRef<string[]>([]);

  const meetingRating = useWatch({
    control: reviewForm.control,
    name: "meetingRating",
    defaultValue: createMeetingReviewDefaultValues.meetingRating,
  });
  const leaderRating = useWatch({
    control: reviewForm.control,
    name: "leaderRating",
    defaultValue: createMeetingReviewDefaultValues.leaderRating,
  });
  const bestMemberId = useWatch({
    control: reviewForm.control,
    name: "bestMemberId",
    defaultValue: createMeetingReviewDefaultValues.bestMemberId,
  });
  const images = useWatch({
    control: reviewForm.control,
    name: "images",
    defaultValue: createMeetingReviewDefaultValues.images,
  });

  const errors = reviewForm.formState.errors;
  const meetingRatingError =
    typeof errors.meetingRating?.message === "string" ? errors.meetingRating.message : "";
  const leaderRatingError =
    typeof errors.leaderRating?.message === "string" ? errors.leaderRating.message : "";
  const bestMemberError =
    typeof errors.bestMemberId?.message === "string" ? errors.bestMemberId.message : "";
  const imagesError = typeof errors.images?.message === "string" ? errors.images.message : "";

  const resolvedMeetingId = useMemo(() => {
    if (meetingId && Number.isFinite(meetingId)) return meetingId;
    if (!Number.isFinite(roundId) || roundId <= 0) return null;
    return getMeetingIdForReviewRoute(roundId);
  }, [meetingId, roundId]);

  const {
    data: membersResponse,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useQuery({
    queryKey: ["reviewCandidateMembers", resolvedMeetingId, roundId],
    queryFn: () =>
      getReviewCandidateMembers({ meetingId: Number(resolvedMeetingId), meetingRoundId: roundId }),
    enabled: Boolean(resolvedMeetingId) && Number.isFinite(roundId),
    retry: 0,
  });

  const createReviewMutation = useMutation({
    mutationFn: async (values: CreateMeetingReviewFormValues) => {
      setSubmitError(null);

      if (values.bestMemberId <= 0) {
        throw new Error("베스트 모임원을 선택해주세요.");
      }

      const imageKeys = await uploadReviewImages(values.images);

      await createMeetingRoundReview({
        meetingRoundId: roundId,
        request: {
          meetingRating: values.meetingRating,
          leaderRating: values.leaderRating,
          content: values.content.trim(),
          bestMemberId: values.bestMemberId,
          imageKeys,
        },
      });
    },
    onSuccess: async () => {
      if (resolvedMeetingId) {
        await queryClient.invalidateQueries({ queryKey: ["myMeetingDetail", resolvedMeetingId] });
      }
      clearMeetingIdForReviewRoute(roundId);
      router.replace(resolvedMeetingId ? `/my-meeting/${resolvedMeetingId}` : "/my-meeting");
    },
    onError: (error) => {
      setSubmitError((error as Error).message || "후기 생성에 실패했습니다.");
    },
  });

  useEffect(() => {
    imagePreviewUrlsRef.current = imagePreviewUrls;
  }, [imagePreviewUrls]);

  useEffect(() => {
    return () => {
      imagePreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleSetMeetingRating = (value: number) => {
    reviewForm.setValue("meetingRating", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSetLeaderRating = (value: number) => {
    reviewForm.setValue("leaderRating", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSetBestMemberId = (memberId: number) => {
    reviewForm.setValue("bestMemberId", memberId, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleAppendImages = (selected: File[]) => {
    const existing = reviewForm.getValues("images");
    const remaining = 5 - existing.length;
    if (remaining <= 0) {
      return;
    }

    const newImages = selected.slice(0, remaining);
    const next = [...existing, ...newImages];
    reviewForm.setValue("images", next, { shouldDirty: true, shouldValidate: true });
    const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    reviewForm.setValue("images", next, { shouldDirty: true, shouldValidate: true });
    setImagePreviewUrls((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target);
      return prev.filter((_, i) => i !== index);
    });
  };

  const isInvalidRound = !Number.isFinite(roundId) || roundId <= 0;
  const isMissingMeetingId = !isInvalidRound && !resolvedMeetingId;
  const members = membersResponse?.members ?? [];
  const canSubmit = reviewForm.formState.isValid && !createReviewMutation.isPending;

  return {
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
    isSubmitting: createReviewMutation.isPending,
    leaderRating,
    leaderRatingError,
    meetingRating,
    meetingRatingError,
    members,
    reviewForm,
    submitError,
    submitReview: reviewForm.handleSubmit((values) => createReviewMutation.mutate(values)),
  };
}
