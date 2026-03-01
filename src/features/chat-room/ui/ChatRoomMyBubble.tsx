type ChatRoomMyBubbleProps = {
  textMessage: string | null;
  timeText: string;
};

export default function ChatRoomMyBubble({ textMessage, timeText }: ChatRoomMyBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="flex max-w-[78%] flex-col items-end gap-1">
        <div className="rounded-2xl rounded-br-none bg-primary px-3 py-2 text-gray-purple">
          <p className="text-label leading-5 break-words whitespace-pre-wrap">
            {textMessage ?? "메세지"}
          </p>
          <p className="mt-1 text-right text-micro text-gray-300">{timeText}</p>
        </div>
      </div>
    </div>
  );
}
