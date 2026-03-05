type TopicActionButtonsProps = {
  editable: boolean;
  isRecommending: boolean;
  isSaving: boolean;
  canSave: boolean;
  onClickRecommend: () => void;
  onClickSave: () => void;
};

export default function TopicActionButtons({
  editable,
  isRecommending,
  isSaving,
  canSave,
  onClickRecommend,
  onClickSave,
}: TopicActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={onClickRecommend}
        disabled={!editable || isRecommending || isSaving}
        className="h-11 rounded-xl border border-primary text-sm font-semibold text-primary disabled:opacity-50"
      >
        {isRecommending ? "추천 받는 중..." : "AI 주제 추천 받기"}
      </button>
      <button
        type="button"
        onClick={onClickSave}
        disabled={!canSave}
        className="h-11 rounded-xl bg-primary text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-500"
      >
        {isSaving ? "저장 중..." : "저장하기"}
      </button>
    </div>
  );
}
