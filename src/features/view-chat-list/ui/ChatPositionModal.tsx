import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

type JoinPosition = "AGREE" | "DISAGREE";

type ChatPositionModalProps = {
  selectedPosition: JoinPosition | null;
  isAgreeFull: boolean;
  isDisagreeFull: boolean;
  agreeRemain: number | null;
  disagreeRemain: number | null;
  agreeCount: number | null;
  disagreeCount: number | null;
  maxPerPosition: number | null;
  isLoadingQuiz: boolean;
  isEnteringLobby: boolean;
  canGoNext: boolean;
  joinErrorMessage: string | null;
  onSelectPosition: (position: JoinPosition) => void;
  onClose: () => void;
  onNext: () => void;
};

export default function ChatPositionModal({
  selectedPosition,
  isAgreeFull,
  isDisagreeFull,
  agreeRemain,
  disagreeRemain,
  agreeCount,
  disagreeCount,
  maxPerPosition,
  isLoadingQuiz,
  isEnteringLobby,
  canGoNext,
  onSelectPosition,
  onClose,
  onNext,
}: ChatPositionModalProps) {
  return (
    <div className="w-full rounded-t-2xl bg-white p-5">
      <p className="text-body-emphasis text-gray-900">찬반 입장을 선택해주세요.</p>
      <p className="mt-1 text-label !font-[400] text-gray-500">
        잔여석이 없는 입장의 경우 선택할 수 없습니다.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectPosition("AGREE")}
          disabled={isAgreeFull || isLoadingQuiz}
          className={`flex h-20 w-full flex-col items-center justify-center gap-1 rounded-2xl border transition-colors ${
            selectedPosition === "AGREE"
              ? "border-primary bg-gray-purple text-primary"
              : "border-gray-300 text-gray-400"
          } disabled:cursor-not-allowed disabled:opacity-45`}
        >
          <div className="flex flex-row gap-2 justify-center items-center">
            <ThumbsUpIcon />
            <span className="text-body-emphasis !font-[700] font-semibold">찬성</span>
          </div>
          <span className="text-caption">
            {agreeCount !== null && maxPerPosition !== null
              ? `잔여석: ${Math.max(0, maxPerPosition - agreeCount)}자리`
              : agreeRemain !== null
                ? `잔여석: ${Math.max(0, agreeRemain)}자리`
                : ""}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onSelectPosition("DISAGREE")}
          disabled={isDisagreeFull || isLoadingQuiz}
          className={`flex h-20 w-full flex-col items-center justify-center gap-1 rounded-2xl border transition-colors ${
            selectedPosition === "DISAGREE"
              ? "border-primary bg-gray-purple text-primary"
              : "border-gray-300 text-gray-400"
          } disabled:cursor-not-allowed disabled:opacity-45`}
        >
          <div className="flex flex-row gap-2 justify-center items-center">
            <ThumbsDownIcon />
            <span className="text-body-emphasis !font-[700] font-semibold">반대</span>
          </div>
          <span className="text-caption">
            {disagreeCount !== null && maxPerPosition !== null
              ? `잔여석: ${Math.max(0, maxPerPosition - disagreeCount)}자리`
              : disagreeRemain !== null
                ? `잔여석: ${Math.max(0, disagreeRemain)}자리`
                : ""}
          </span>
        </button>
      </div>
      {isLoadingQuiz ? (
        <p className="mt-3 text-sm text-gray-500">입장 정보를 불러오는 중...</p>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isEnteringLobby}
          className="h-11 rounded-xl border border-gray-300 text-sm font-semibold text-gray-blue"
        >
          취소
        </button>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={onNext}
          className="h-11 rounded-xl bg-primary text-sm font-semibold text-white disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
