import { FormEvent } from "react";
import { Send } from "lucide-react";

type ChatRoomComposerProps = {
  text: string;
  isConnected: boolean;
  isDiscussionEnded: boolean;
  onChangeText: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ChatRoomComposer({
  text,
  isConnected,
  isDiscussionEnded,
  onChangeText,
  onSubmit,
}: ChatRoomComposerProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 border-t border-gray-200 p-4">
      <input
        value={text}
        onChange={(event) => onChangeText(event.target.value)}
        placeholder="메시지를 입력하세요"
        className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none"
      />
      <button
        type="submit"
        className="grid h-10 w-10 place-items-center rounded-full bg-primary p-0 text-white disabled:bg-gray-300"
        disabled={!text.trim() || !isConnected || isDiscussionEnded}
        aria-label="메시지 전송"
      >
        <Send size={17} className="block" />
      </button>
    </form>
  );
}
