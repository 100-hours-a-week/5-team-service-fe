import { X } from "lucide-react";
import { Member } from "@/entities/chat/model/types";
import ChatDebateGuide from "./ChatDebateGuide";
import ChatRoomMembers from "./ChatRoomMemebers";

type ChatRoomInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentRound: number;
  isDiscussionEnded: boolean;
  agreeMembers: Member[];
  disagreeMembers: Member[];
};

export default function ChatRoomInfoModal({
  isOpen,
  onClose,
  currentRound,
  isDiscussionEnded,
  agreeMembers,
  disagreeMembers,
}: ChatRoomInfoModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="가이드 닫기"
        onClick={onClose}
        className={`absolute inset-0 transition-colors duration-200 ${
          isOpen ? "bg-black/40" : "bg-black/0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-200 ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
        <ChatDebateGuide currentRound={currentRound} isEnded={isDiscussionEnded} />
        <ChatRoomMembers agreeMembers={agreeMembers} disagreeMembers={disagreeMembers} />
      </div>
    </div>
  );
}
