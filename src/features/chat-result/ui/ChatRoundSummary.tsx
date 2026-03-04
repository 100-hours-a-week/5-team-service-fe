import type { ChatSummaryRound } from "@/features/chat-result/api/get-chat-summary/types";

type ChatRountSummaryProps = {
  round: ChatSummaryRound;
};

export default function ChatRoundSummary({ round }: ChatRountSummaryProps) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3">
      <p className="text-body-emphasis font-semibold text-gray-700">{round.roundNumber}라운드</p>
      {round.summary ? (
        <div className="mt-2 space-y-3 text-sm text-gray-700">
          <div className="space-y-1">
            <p className="text-body-2 !font-[600] text-primary">핵심 쟁점</p>
            {round.summary.mainIssues.length > 0 ? (
              <ul className="list-disc space-y-1 pl-4">
                {round.summary.mainIssues.map((issue, idx) => (
                  <li key={`main-${round.roundNumber}-${idx}`}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">핵심 쟁점 요약이 없습니다.</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-body-2 font-semibold text-gray-800">찬성 입장</p>
            {round.summary.pro.length > 0 ? (
              <ul className="list-disc space-y-1 pl-4">
                {round.summary.pro.map((point, idx) => (
                  <li key={`pro-${round.roundNumber}-${idx}`}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">요약 내용이 없습니다.</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-body-2 font-semibold text-gray-800">반대 입장</p>
            {round.summary.con.length > 0 ? (
              <ul className="list-disc space-y-1 pl-4">
                {round.summary.con.map((point, idx) => (
                  <li key={`con-${round.roundNumber}-${idx}`}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">요약 내용이 없습니다.</p>
            )}
          </div>

          {round.summary.unresolvedIssues.length > 0 ? (
            <div className="space-y-1">
              <p className="text-body-2 font-semibold text-gray-800">미해결 쟁점</p>
              <ul className="list-disc space-y-1 pl-4">
                {round.summary.unresolvedIssues.map((issue, idx) => (
                  <li key={`unresolved-${round.roundNumber}-${idx}`}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-1 text-sm text-gray-500">요약이 아직 준비되지 않았습니다.</p>
      )}
    </div>
  );
}
