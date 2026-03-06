"use client";

import TopicInputs from "./TopicInputs";
import TopicActionButtons from "./TopicActionButtons";
import TopicStatusMessage from "./TopicStatusMessage";
import TopicGuideModal from "./TopicGuideModal";
import { useRecommendMeetingTopic } from "../model/useRecommendMeetingTopic";
import { RecommendMeetingTopicProps } from "../model/types";
import { BadgeCheck } from "lucide-react";

export default function RecommendMeetingTopicSection({
  meetingId,
  roundId,
  roundNo,
  initialTopics,
  editable,
}: RecommendMeetingTopicProps) {
  const {
    topics,
    isSubmitted,
    isGuideModalOpen,
    isRecommending,
    isSaving,
    remainingAiCount,
    recommendMessage,
    canSave,
    setIsGuideModalOpen,
    handleChangeTopic,
    handleOpenRecommendModal,
    handleConfirmRecommend,
    handleSaveTopics,
  } = useRecommendMeetingTopic({
    meetingId,
    roundId,
    roundNo,
    initialTopics,
    editable,
  });

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-1">
        <h2 className="text-base font-semibold text-gray-900">주제 선정하기</h2>
        {isSubmitted ? <BadgeCheck className="w-5.5 h-5.5 text-gray-purple fill-primary" /> : null}
        {remainingAiCount !== null ? (
          <p className="ml-auto text-right text-caption text-gray-500">
            오늘 남은 AI 추천 횟수: {remainingAiCount}회
          </p>
        ) : null}
      </div>
      <p className="text-xs text-gray-500">모임 시작 전 반드시 주제를 등록해주세요!</p>

      <TopicInputs topics={topics} editable={editable} onChangeTopic={handleChangeTopic} />
      <TopicActionButtons
        editable={editable}
        isRecommending={isRecommending}
        isSaving={isSaving}
        canSave={canSave}
        onClickRecommend={handleOpenRecommendModal}
        onClickSave={() => void handleSaveTopics()}
      />
      <TopicStatusMessage isRecommending={isRecommending} recommendMessage={recommendMessage} />

      <TopicGuideModal
        isOpen={isGuideModalOpen}
        isLoading={isRecommending}
        onClose={() => setIsGuideModalOpen(false)}
        onConfirm={() => void handleConfirmRecommend()}
      />
    </section>
  );
}
