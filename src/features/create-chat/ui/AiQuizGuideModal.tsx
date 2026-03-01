type AiQuizGuideModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function AiQuizGuideModal({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: AiQuizGuideModalProps) {
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
        <h2 className="text-center text-base font-semibold text-gray-900">AI 퀴즈 추천 받기</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>퀴즈 생성까지는 1분 이내의 시간이 소요됩니다.</li>
          <li>퀴즈 추천은 하루 최대 3회까지 가능합니다.</li>
        </ul>
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
