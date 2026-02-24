type ChatRoomOtherBubbleProps = {
  senderNickname: string;
  textMessage: string | null;
  timeText: string;
};

export default function ChatRoomOtherBubble({
  senderNickname,
  textMessage,
  timeText,
}: ChatRoomOtherBubbleProps) {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-[78%] flex-col items-start gap-1">
        <p className="px-1 text-[11px] font-semibold text-gray-600">{senderNickname}</p>
        <div className="rounded-2xl rounded-bl-none bg-gray-200 px-3 py-2 text-gray-900">
          <p className="text-label leading-5 break-words whitespace-pre-wrap">
            {textMessage ?? "메세지"}
          </p>
          <p className="mt-1 text-left text-micro text-gray-500">{timeText}</p>
        </div>
      </div>
    </div>
  );
}
