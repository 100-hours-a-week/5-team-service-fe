type ChatRoomHostActionsProps = {
  canGoNextRound: boolean;
  isAdvancingRound: boolean;
  onNextRound: () => void;
  canEndChat: boolean;
  isEndingChat: boolean;
  onEndChat: () => void;
};

export default function ChatRoomHostActions({
  canGoNextRound,
  isAdvancingRound,
  onNextRound,
  canEndChat,
  isEndingChat,
  onEndChat,
}: ChatRoomHostActionsProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-2">
      <div className="text-label !font-[600] text-primary">방장 기능</div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          disabled
          className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-caption text-gray-700 disabled:opacity-50"
        >
          방장용 가이드
        </button>
        <button
          type="button"
          onClick={onNextRound}
          disabled={!canGoNextRound || isAdvancingRound}
          className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-caption text-gray-700 disabled:opacity-50"
        >
          {isAdvancingRound ? "전환 중..." : "다음 라운드"}
        </button>
        <button
          type="button"
          onClick={onEndChat}
          disabled={!canEndChat || isEndingChat}
          className="h-9 rounded-lg bg-primary px-3 text-caption text-white disabled:opacity-50"
        >
          {isEndingChat ? "종료 중..." : "채팅 종료"}
        </button>
      </div>
    </div>
  );
}
