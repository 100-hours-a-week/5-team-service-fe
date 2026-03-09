import { Share } from "lucide-react";

type MeetingShareButtonProps = {
  onClick: () => void;
};

export default function MeetingShareButton({ onClick }: MeetingShareButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-2 text-caption !font-[600] text-gray-700"
    >
      <Share className="h-4 w-4 text-gray-700" />
      <span>공유하기</span>
    </button>
  );
}
