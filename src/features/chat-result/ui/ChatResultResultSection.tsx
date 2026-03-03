import type { CSSProperties } from "react";
import type { VoteResultResponse } from "@/features/chat-result/api/get-vote-result/types";

type ChatResultResultSectionProps = {
  shouldShowResult: boolean;
  isLoadingResult: boolean;
  displayResult: VoteResultResponse | null;
  resultSummary: string;
  resultWinner: "AGREE" | "DISAGREE" | "DRAW" | null;
};

export default function ChatResultResultSection({
  shouldShowResult,
  isLoadingResult,
  displayResult,
  resultSummary,
  resultWinner,
}: ChatResultResultSectionProps) {
  if (!shouldShowResult) return null;

  if (isLoadingResult) {
    return <p className="mt-6 text-body-2 text-gray-500">결과를 불러오는 중입니다...</p>;
  }

  if (!displayResult) {
    return <p className="mt-6 text-body-2 text-gray-500">결과를 확인할 수 없습니다.</p>;
  }

  return (
    <div className="relative mt-10 p-4 mb-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2, 3, 4].map((index) => {
          const colorClass =
            index % 3 === 0
              ? "bg-primary"
              : index % 3 === 1
                ? "bg-primary-light-1"
                : "bg-primary-purple-1";
          const leftStyle = {
            left: "18%",
            top: "52%",
            animationDelay: `${index * 90}ms`,
            "--dx": `${-30 - index * 12}px`,
            "--dy": `${-8 + (index % 2) * 8}px`,
          } as CSSProperties;
          const rightStyle = {
            left: "82%",
            top: "52%",
            animationDelay: `${index * 90}ms`,
            "--dx": `${30 + index * 12}px`,
            "--dy": `${-8 + (index % 2) * 8}px`,
          } as CSSProperties;

          return (
            <div key={`confetti-pair-${index}`}>
              <span className={`confetti-dot ${colorClass}`} style={leftStyle} />
              <span className={`confetti-dot ${colorClass}`} style={rightStyle} />
            </div>
          );
        })}
      </div>
      <p
        className="relative animate-fade-in-up text-center text-subheading leading-tight text-gray-900"
        style={{ animationDelay: "120ms", animationFillMode: "both" }}
      >
        {resultSummary}
      </p>
      <p
        className="relative animate-fade-in-up text-center text-heading leading-tight text-gray-900"
        style={{ animationDelay: "220ms", animationFillMode: "both" }}
      >
        {resultWinner === "DRAW" ? (
          <>
            <span className="text-primary">무승부</span>
            <span>입니다.</span>
          </>
        ) : (
          <>
            <span className="text-primary">{resultWinner === "AGREE" ? "찬성" : "반대"}</span>
            <span>{resultWinner === "AGREE" ? "이 " : "가 "}</span>
            <span>승리했습니다 !!</span>
          </>
        )}
      </p>
    </div>
  );
}
