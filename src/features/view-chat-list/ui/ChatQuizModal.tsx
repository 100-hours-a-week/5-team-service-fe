type ChatQuiz = {
  question: string;
  choices: { choiceNumber: number; choiceText: string }[];
};

type ChatQuizModalProps = {
  quiz: ChatQuiz | null;
  selectedChoiceNumber: number | null;
  isEnteringLobby: boolean;
  joinErrorMessage: string | null;
  onSelectChoice: (choiceNumber: number) => void;
  onPrev: () => void;
  onComplete: () => void;
};

export default function ChatQuizModal({
  quiz,
  selectedChoiceNumber,
  isEnteringLobby,
  joinErrorMessage,
  onSelectChoice,
  onPrev,
  onComplete,
}: ChatQuizModalProps) {
  return (
    <div className="w-full rounded-t-2xl bg-white p-5">
      <p className="text-body-emphasis text-gray-900">
        {quiz?.question ?? "입장 퀴즈를 불러오지 못했어요."}
      </p>
      <p className="mt-1 text-label !font-[400] text-gray-500">
        정답인 경우에만 토론 대기실로 이동합니다.
      </p>
      <div className="mt-4 space-y-2">
        {(quiz?.choices ?? []).map((choice) => (
          <button
            key={choice.choiceNumber}
            type="button"
            onClick={() => onSelectChoice(choice.choiceNumber)}
            className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
              selectedChoiceNumber === choice.choiceNumber
                ? "border-primary bg-gray-purple text-primary !font-[600]"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {choice.choiceNumber}. {choice.choiceText}
          </button>
        ))}
      </div>
      {joinErrorMessage ? <p className="mt-3 text-label text-red-500">{joinErrorMessage}</p> : null}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isEnteringLobby}
          className="h-11 rounded-xl border border-gray-300 text-sm font-semibold text-gray-blue"
        >
          이전
        </button>
        <button
          type="button"
          disabled={!selectedChoiceNumber || isEnteringLobby || !quiz}
          onClick={onComplete}
          className="h-11 rounded-xl bg-primary text-sm font-semibold text-white disabled:opacity-50"
        >
          {isEnteringLobby ? "입장 중..." : "완료"}
        </button>
      </div>
    </div>
  );
}
