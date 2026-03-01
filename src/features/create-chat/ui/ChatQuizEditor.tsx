"use client";

import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CreateChatFormValues } from "../model/types";
import { QUIZ_CHOICE_COUNT } from "../model/config";
import TextField from "@/shared/ui/form/TextField";
import QuizChoiceField from "@/shared/ui/form/QuizChoiceField";
import AiQuizGuideModal from "./AiQuizGuideModal";
import requestQuizRecommendation from "../api/request-quiz-recommendation";
import { useCreateChatStore } from "../model/store";

export default function ChatQuizEditor() {
  const { setValue, control, getValues } = useFormContext<CreateChatFormValues>();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const selectedBook = useCreateChatStore((s) => s.selectedBook);
  const setCreateChatDraftValues = useCreateChatStore((s) => s.setAll);

  const choices = useWatch({ control, name: "quiz.choices" });
  const correctChoiceNumber = useWatch({ control, name: "quiz.correctChoiceNumber" });
  const isRecommendDisabled = useMemo(
    () => !selectedBook || isLoadingRecommendation,
    [selectedBook, isLoadingRecommendation],
  );

  const handleApplyRecommendation = async () => {
    if (!selectedBook) return;

    setIsLoadingRecommendation(true);
    try {
      const response = await requestQuizRecommendation({
        author: selectedBook.authors,
        title: selectedBook.title,
      });

      setValue("quiz.question", response.question, { shouldDirty: true, shouldValidate: true });

      const sortedChoices = [...response.choices].sort((a, b) => a.choiceNumber - b.choiceNumber);
      sortedChoices.slice(0, QUIZ_CHOICE_COUNT).forEach((choice, index) => {
        setValue(`quiz.choices.${index}.choiceNumber`, choice.choiceNumber, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue(`quiz.choices.${index}.text`, choice.choiceText, {
          shouldDirty: true,
          shouldValidate: true,
        });
      });

      setValue("quiz.correctChoiceNumber", response.correctChoiceNumber, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setCreateChatDraftValues(getValues());
      setIsGuideOpen(false);
    } catch {
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  return (
    <div>
      <TextField
        name="quiz.question"
        label="입장 퀴즈"
        helperText="입장을 하기 위해 풀어야 할 퀴즈를 만들어주세요."
        placeholder="Q. 질문을 입력해주세요."
        maxLength={50}
        isFixed={false}
      />

      <div className="space-y-1 rounded-lg border border-gray-200 bg-white px-5 py-2 pb-4">
        {Array.from({ length: QUIZ_CHOICE_COUNT }).map((_, index) => {
          const choiceNumber = choices?.[index]?.choiceNumber ?? index + 1;
          const checked = correctChoiceNumber === choiceNumber;

          return (
            <QuizChoiceField
              key={choiceNumber}
              index={index}
              choiceNumber={choiceNumber}
              checked={checked}
              showDivider={index < QUIZ_CHOICE_COUNT - 1}
              onSelectCorrect={(nextChoiceNumber) =>
                setValue("quiz.correctChoiceNumber", nextChoiceNumber, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setIsGuideOpen(true)}
        disabled={isRecommendDisabled}
        className="mt-3 h-11 w-full rounded-xl border border-primary text-sm font-semibold text-primary disabled:opacity-50"
      >
        AI 퀴즈 추천 받기
      </button>

      <AiQuizGuideModal
        isOpen={isGuideOpen}
        isLoading={isLoadingRecommendation}
        onClose={() => {
          if (!isLoadingRecommendation) setIsGuideOpen(false);
        }}
        onConfirm={() => void handleApplyRecommendation()}
      />
    </div>
  );
}
