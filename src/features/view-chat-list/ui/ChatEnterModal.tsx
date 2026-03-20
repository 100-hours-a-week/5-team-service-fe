import ChatPositionModal from "./ChatPositionModal";
import ChatQuizModal from "./ChatQuizModal";

type JoinPosition = "AGREE" | "DISAGREE";
type ModalStep = "POSITION" | "QUIZ";
type ChatQuiz = {
  question: string;
  choices: { choiceNumber: number; choiceText: string }[];
  agreeCount: number;
  disagreeCount: number;
  maxPerPosition: number;
};

type ChatEnterModalProps = {
  isOpen: boolean;
  isClosing: boolean;
  currentStep: ModalStep;
  selectedPosition: JoinPosition | null;
  selectedChoiceNumber: number | null;
  isAgreeFull: boolean;
  isDisagreeFull: boolean;
  agreeRemain: number | null;
  disagreeRemain: number | null;
  agreeCount: number | null;
  disagreeCount: number | null;
  maxPerPosition: number | null;
  isLoadingQuiz: boolean;
  isEnteringLobby: boolean;
  canGoNext: boolean;
  joinErrorMessage: string | null;
  quiz: ChatQuiz | null;
  onClose: () => void;
  onSelectPosition: (position: JoinPosition) => void;
  onNext: () => void;
  onSelectChoice: (choiceNumber: number) => void;
  onPrev: () => void;
  onComplete: () => void;
};

export default function ChatEnterModal({
  isOpen,
  isClosing,
  currentStep,
  selectedPosition,
  selectedChoiceNumber,
  isAgreeFull,
  isDisagreeFull,
  agreeRemain,
  disagreeRemain,
  agreeCount,
  disagreeCount,
  maxPerPosition,
  isLoadingQuiz,
  isEnteringLobby,
  canGoNext,
  joinErrorMessage,
  quiz,
  onClose,
  onSelectPosition,
  onNext,
  onSelectChoice,
  onPrev,
  onComplete,
}: ChatEnterModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed bottom-0 left-1/2 top-0 z-[60] flex w-full max-w-[500px] -translate-x-1/2 items-end justify-center bg-black/30 px-4 pb-0 pt-4 ${
        isClosing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`w-full ${isClosing ? "animate-sheet-down" : "animate-sheet-up"}`}
      >
        {currentStep === "POSITION" ? (
          <ChatPositionModal
            selectedPosition={selectedPosition}
            isAgreeFull={isAgreeFull}
            isDisagreeFull={isDisagreeFull}
            agreeRemain={agreeRemain}
            disagreeRemain={disagreeRemain}
            agreeCount={agreeCount}
            disagreeCount={disagreeCount}
            maxPerPosition={maxPerPosition}
            isLoadingQuiz={isLoadingQuiz}
            isEnteringLobby={isEnteringLobby}
            canGoNext={canGoNext}
            joinErrorMessage={joinErrorMessage}
            onSelectPosition={onSelectPosition}
            onClose={onClose}
            onNext={onNext}
          />
        ) : (
          <ChatQuizModal
            quiz={quiz}
            selectedChoiceNumber={selectedChoiceNumber}
            isEnteringLobby={isEnteringLobby}
            joinErrorMessage={joinErrorMessage}
            onSelectChoice={onSelectChoice}
            onPrev={onPrev}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
}
