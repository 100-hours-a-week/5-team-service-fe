"use client";

import { useEffect, useMemo, useState } from "react";
import requestTopicRecommendation from "../../api/request-topic-recommendation";
import saveRoundTopics from "../../api/save-round-topics";
import AiTopicGuideModal from "./AiTopicGuideModal";

type MeetingTopicSelectionProps = {
  meetingId: number;
  roundId: number;
  roundNo: number;
  initialTopics?: { topicNo: number; topic: string }[];
  editable: boolean;
};

function normalizeTopics(initialTopics?: { topicNo: number; topic: string }[]) {
  const seed = ["", "", ""];
  if (!initialTopics) return seed;

  initialTopics.forEach((item) => {
    const index = item.topicNo - 1;
    if (index >= 0 && index < 3) {
      seed[index] = item.topic ?? "";
    }
  });

  return seed;
}

export default function MeetingTopicSelection({
  meetingId,
  roundId,
  roundNo,
  initialTopics,
  editable,
}: MeetingTopicSelectionProps) {
  const [topics, setTopics] = useState<string[]>(() => normalizeTopics(initialTopics));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [remainingAiCount, setRemainingAiCount] = useState<number | null>(null);

  useEffect(() => {
    const normalized = normalizeTopics(initialTopics);
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
  };

  const handleConfirmRecommend = async () => {
    const emptyIndex = topics.findIndex((topic) => topic.trim().length === 0);
    if (emptyIndex < 0) {
      setIsGuideModalOpen(false);
      return;
    }

    setIsRecommending(true);
    try {
      const response = await requestTopicRecommendation({ meetingId, roundNo });
      setTopics((prev) => {
        const next = [...prev];
        next[emptyIndex] = response.topic;
        return next;
      });
      setRemainingAiCount(response.remainingCount);
      setIsSubmitted(false);
      setIsGuideModalOpen(false);
    } catch {
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
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900">주제 선정하기</h2>
        <span
          className={`rounded-full px-2 py-1 text-micro ${
            isSubmitted ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600"
          }`}
        >
          {isSubmitted ? "제출" : "미제출"}
        </span>
        {remainingAiCount !== null ? (
          <p className="ml-auto text-right text-caption text-gray-500">
            오늘 남은 AI 추천 횟수: {remainingAiCount}회
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        {[0, 1, 2].map((index) => (
          <div
            key={`meeting-topic-${index}`}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3"
          >
            <label className="flex items-center gap-2 text-label text-gray-900">
              <span>{index + 1}.</span>
              <input
                value={topics[index] ?? ""}
                onChange={(event) => handleChangeTopic(index, event.target.value)}
                placeholder={`주제 ${index + 1}`}
                disabled={!editable}
                className="w-full bg-transparent text-label outline-none disabled:text-gray-500"
              />
            </label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setIsGuideModalOpen(true)}
          disabled={!editable || isRecommending || isSaving}
          className="h-11 rounded-xl border border-primary text-sm font-semibold text-primary disabled:opacity-50"
        >
          {isRecommending ? "추천 받는 중..." : "AI 주제 추천 받기"}
        </button>
        <button
          type="button"
          onClick={() => void handleSaveTopics()}
          disabled={!canSave}
          className="h-11 rounded-xl bg-primary text-sm font-semibold text-white disabled:bg-gray-300"
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      {isRecommending ? (
        <p className="text-caption text-gray-500">
          생성 중에도 화면을 닫을 수 있어요. 완료되면 입력란이 자동으로 채워집니다.
        </p>
      ) : null}

      <AiTopicGuideModal
        isOpen={isGuideModalOpen}
        isLoading={isRecommending}
        onClose={() => setIsGuideModalOpen(false)}
        onConfirm={() => void handleConfirmRecommend()}
      />
    </section>
  );
}
