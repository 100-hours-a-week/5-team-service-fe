type AiTopicGuideModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function AiTopicGuideModal({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: AiTopicGuideModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-[500px] -translate-x-1/2">
        <button
          type="button"
          aria-label="모달 닫기"
          onClick={onClose}
          className={`absolute inset-0 transition-colors duration-200 ${
            isOpen ? "pointer-events-auto bg-black/40" : "pointer-events-none bg-black/0"
          }`}
        />
      </div>
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-[360px] rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-200 ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-95 opacity-0"
        }`}
      >
        <h2 className="text-center text-base font-semibold text-gray-900">AI 주제 추천 받기</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>AI 주제 추천은 제출된 독후감 기반으로 생성됩니다.</li>
          <li>제출된 독후감이 없을 시 추천이 불가능합니다.</li>
          <li>하루 총 15번의 횟수 제한이 있습니다.</li>
        </ul>
        {isLoading ? (
          <p className="mt-3 text-center text-caption text-gray-500">
            추천 생성 중입니다. 최대 1분 정도 소요될 수 있어요.
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 min-w-[96px] rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-10 min-w-[96px] rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isLoading ? "추천 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
