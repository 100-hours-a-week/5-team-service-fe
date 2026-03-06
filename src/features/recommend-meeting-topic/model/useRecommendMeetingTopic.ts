"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { putExistingTopic } from "../lib/putExistingTopic";
import recommendMeetingTopic from "../api/recommendMeetingTopic";
import { isRecommendModalClosableError, mapRecommendError } from "./mapRecommendError";
import saveRoundTopics from "@/features/my-meeting-detail/api/save-round-topics";
import { RecommendMeetingTopicProps } from "./types";

export function useRecommendMeetingTopic({
  meetingId,
  roundId,
  roundNo,
  initialTopics,
  editable,
}: RecommendMeetingTopicProps) {
  const [topics, setTopics] = useState<string[]>(() => putExistingTopic(initialTopics));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [remainingAiCount, setRemainingAiCount] = useState<number | null>(null);
  const [recommendMessage, setRecommendMessage] = useState<string | null>(null);
  const [showInitialTopicNotice, setShowInitialTopicNotice] = useState(false);
  const didEvaluateInitialTopicsRef = useRef(false);

  useEffect(() => {
    if (!didEvaluateInitialTopicsRef.current && Array.isArray(initialTopics)) {
      setShowInitialTopicNotice(initialTopics.length === 0);
      didEvaluateInitialTopicsRef.current = true;
    }

    const normalized = putExistingTopic(initialTopics);
    setTopics(normalized);
    setIsSubmitted(normalized.every((topic) => topic.trim().length > 0));
  }, [initialTopics, roundId]);

  const canSave = useMemo(
    () => editable && topics.every((topic) => topic.trim().length > 0) && !isSaving,
    [editable, isSaving, topics],
  );

  const handleChangeTopic = (index: number, value: string) => {
    if (!editable) return;
    setTopics((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setIsSubmitted(false);
    setRecommendMessage(null);
  };

  const handleOpenRecommendModal = () => {
    if (!editable || isRecommending || isSaving) return;
    const hasEmptyTopic = topics.some((topic) => topic.trim().length === 0);
    if (!hasEmptyTopic) {
      setRecommendMessage("공란이 있는 경우만 AI 주제 추천이 가능합니다.");
      return;
    }
    setRecommendMessage(null);
    setIsGuideModalOpen(true);
  };

  const handleConfirmRecommend = async () => {
    const emptyIndex = topics.findIndex((topic) => topic.trim().length === 0);
    if (emptyIndex < 0) {
      setIsGuideModalOpen(false);
      setRecommendMessage("공란이 있는 경우만 AI 주제 추천이 가능합니다.");
      return;
    }

    setIsRecommending(true);
    setRecommendMessage(null);
    try {
      const response = await recommendMeetingTopic({ meetingId, roundNo });
      setTopics((prev) => {
        const next = [...prev];
        next[emptyIndex] = response.topic;
        return next;
      });
      setRemainingAiCount(response.remainingCount);
      setIsSubmitted(false);
      setRecommendMessage(null);
      setIsGuideModalOpen(false);
    } catch (error) {
      const errorCode = (error as { code?: string })?.code;
      setRecommendMessage(mapRecommendError(errorCode));
      if (isRecommendModalClosableError(errorCode)) {
        setIsGuideModalOpen(false);
      }
    } finally {
      setIsRecommending(false);
    }
  };

  const handleSaveTopics = async () => {
    if (!canSave) return;

    setIsSaving(true);
    try {
      const response = await saveRoundTopics({
        roundId,
        topics: topics.map((topic, index) => ({
          topicNo: index + 1,
          topic: topic.trim(),
          source: "LEADER",
        })),
      });
      setTopics(
        response.topics
          .sort((a, b) => a.topicNo - b.topicNo)
          .map((item) => item.topic)
          .slice(0, 3),
      );
      setIsSubmitted(true);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    topics,
    isSubmitted,
    isGuideModalOpen,
    isRecommending,
    isSaving,
    remainingAiCount,
    recommendMessage,
    showInitialTopicNotice,
    canSave,
    setIsGuideModalOpen,
    handleChangeTopic,
    handleOpenRecommendModal,
    handleConfirmRecommend,
    handleSaveTopics,
  };
}
