import type { VoteChoice } from "@/features/chat-result/api/post-vote/types";

type ChatResultVoteSectionProps = {
  selectedChoice: VoteChoice | null;
  canVote: boolean;
  shouldShowResult: boolean;
  animatedAgreeCount: number;
  animatedDisagreeCount: number;
  remainingSeconds: number;
  isSubmitting: boolean;
  onSelectChoice: (choice: VoteChoice) => void;
  onSubmitVote: () => void;
};

export default function ChatResultVoteSection({
  selectedChoice,
  canVote,
  shouldShowResult,
  animatedAgreeCount,
  animatedDisagreeCount,
  remainingSeconds,
  isSubmitting,
  onSelectChoice,
  onSubmitVote,
}: ChatResultVoteSectionProps) {
  return (
    <div className="mt-8 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectChoice("AGREE")}
          disabled={!canVote}
          className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl border transition-colors ${
            selectedChoice === "AGREE"
              ? "border-primary-purple bg-white text-primary-purple"
              : "border-gray-200 bg-gray-purple text-gray-400"
          } disabled:opacity-50`}
        >
          <span className="text-body-emphasis">찬성</span>
          {shouldShowResult ? (
            <span className="text-body-emphasis text-gray-900">{animatedAgreeCount}표</span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => onSelectChoice("DISAGREE")}
          disabled={!canVote}
          className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl border transition-colors ${
            selectedChoice === "DISAGREE"
              ? "border-primary-purple bg-white text-primary-purple"
              : "border-gray-200 bg-gray-purple text-gray-400"
          } disabled:opacity-50`}
        >
          <span className="text-body-emphasis">반대</span>
          {shouldShowResult ? (
            <span className="text-body-emphasis text-gray-900">{animatedDisagreeCount}표</span>
          ) : null}
        </button>
      </div>
      {remainingSeconds > 0 ? (
        <button
          type="button"
          onClick={onSubmitVote}
          disabled={!selectedChoice || !canVote || isSubmitting}
          className="mt-3 w-full rounded-lg bg-primary py-3 text-body-2 text-white disabled:bg-primary disabled:text-gray-300"
        >
          {isSubmitting ? "투표 중..." : "투표하기"}
        </button>
      ) : null}
    </div>
  );
}
