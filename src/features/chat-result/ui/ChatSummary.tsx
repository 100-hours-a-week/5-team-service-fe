import { GetChatSummaryResponse } from "../api/get-chat-summary/types";
import ChatRoundSummary from "./ChatRoundSummary";

type ChatSummaryProps = {
  isLoadingSummary: boolean;
  summary: GetChatSummaryResponse | null;
};

export default function ChatSummary({ isLoadingSummary, summary }: ChatSummaryProps) {
  return (
    <section className="mt-4 rounded-2xl border border-gray-200 bg-white px-4 py-3">
      {isLoadingSummary ? (
        <p className="mt-2 text-base text-gray-500">요약을 불러오는 중입니다...</p>
      ) : summary ? (
        <div className="mt-2 space-y-3">
          {summary.rounds.map((round) => (
            <ChatRoundSummary key={round.roundNumber} round={round} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-base text-gray-500">요약 정보를 불러오지 못했습니다.</p>
      )}
    </section>
  );
}
