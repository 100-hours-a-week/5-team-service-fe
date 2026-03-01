import { Clock3 } from "lucide-react";
import formatRoundTimer from "../lib/formatRoundTimer";

type ChatRoomRoundBarProps = {
  currentRound: number;
  remainingRoundSeconds: number;
};

export default function ChatRoomRoundBar({
  currentRound,
  remainingRoundSeconds,
}: ChatRoomRoundBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3.5">
      <div className="flex items-center">
        <p className="text-body-2 !font-[600] text-gray-800">{currentRound}라운드</p>
      </div>
      <p className="flex items-center gap-1.5 text-body-2 !font-[600] text-gray-700">
        <Clock3 className="h-4 w-4" />
        <span>{formatRoundTimer(remainingRoundSeconds)}</span>
      </p>
    </div>
  );
}
