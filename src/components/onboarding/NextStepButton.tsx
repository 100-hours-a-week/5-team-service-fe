"use client";

export type NextStepButtonProps = {
  currentStep: number;
  isSelected: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onSkip: () => void;
  showSkip?: boolean;
};

export default function NextStepButton({
  currentStep,
  isSelected,
  isLastStep,
  onNext,
  onSkip,
  showSkip = true,
}: NextStepButtonProps) {
  const entry = currentStep === 0;

  return (
    <div className="flex flex-col items-center gap-4" data-step={currentStep}>
      {isSelected ? (
        <button
          type="button"
          onClick={onNext}
          className={`inline-flex animate-fade-in-up items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition ${
            isLastStep
              ? "bg-primary-purple text-white"
              : "border border-2 border-primary-purple text-primary-purple"
          }`}
        >
          {entry ? "시작하기" : isLastStep ? "독토리 이용하러 가기" : "다음으로"}
        </button>
      ) : null}
      {showSkip ? (
        <button type="button" onClick={onSkip} className="text-caption text-gray-400">
          건너뛰기
        </button>
      ) : null}
    </div>
  );
}
