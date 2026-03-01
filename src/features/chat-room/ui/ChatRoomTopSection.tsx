import { Info, LogOut } from "lucide-react";

type ChatRoomTopSectionProps = {
  isConnected: boolean;
  roomTitle: string;
  isLeaving: boolean;
  onOpenGuide: () => void;
  onOpenLeaveConfirm: () => void;
};

export default function ChatRoomTopSection({
  isConnected,
  roomTitle,
  isLeaving,
  onOpenGuide,
  onOpenLeaveConfirm,
}: ChatRoomTopSectionProps) {
  return (
    <section className="bg-[radial-gradient(34%_36%_at_92%_92%,rgba(173,162,255,0.32)_0%,rgba(173,162,255,0)_72%),linear-gradient(165deg,#7262FF_0%,#6149FF_38%,#5A43F2_72%,#513EDF_100%)] px-4 pb-12 pt-4 text-white">
      <div className="mt-3">
        <div className="flex justify-end gap-2 mt-3">
          <button
            type="button"
            aria-label="토론 진행 가이드 보기"
            onClick={onOpenGuide}
            className="flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-2 py-1 text-caption text-white"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="채팅방 나가기"
            onClick={onOpenLeaveConfirm}
            disabled={isLeaving}
            className="flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-2 py-1 text-caption text-white disabled:opacity-60"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="mb-2 flex items-center gap-2">
          {isConnected ? (
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
          )}
          <span className="text-caption !font-[500] text-white">오늘의 토론 주제</span>
        </div>
        <span className="mt-3 inline max-w-full break-words whitespace-normal bg-white px-3 leading-tight text-subheading !font-[600] text-primary [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
          {roomTitle}
        </span>
      </div>
    </section>
  );
}
