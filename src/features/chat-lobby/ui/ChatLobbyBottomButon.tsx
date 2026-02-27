"use client";

type ChatLobbyBottomButonProps = {
  isHost: boolean;
  isLeaving: boolean;
  isStarting: boolean;
  onLeave: () => void;
  onStart: () => void;
};

export default function ChatLobbyBottomButon({
  isHost,
  isLeaving,
  isStarting,
  onLeave,
  onStart,
}: ChatLobbyBottomButonProps) {
  return (
    <div className={isHost ? "grid grid-cols-2 gap-3" : ""}>
      <button
        type="button"
        onClick={onLeave}
        disabled={isLeaving}
        className="h-12 w-full rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 disabled:opacity-50"
      >
        {isLeaving ? "나가는 중..." : "나가기"}
      </button>
      {isHost ? (
        <button
          type="button"
          onClick={() => {
            console.log("[chat-lobby:debug] start button clicked");
            onStart();
          }}
          disabled={isStarting}
          className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white disabled:opacity-50"
        >
          {isStarting ? "시작 중..." : "시작하기"}
        </button>
      ) : null}
    </div>
  );
}
