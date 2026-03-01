"use client";

import { FieldErrors, useFormContext } from "react-hook-form";
import QuizChoiceInput from "../input/QuizChoiceInput";
import { CreateChatFormValues } from "@/features/create-chat/model/types";
import { getNameByPath } from "@/shared/lib/getNameByPath";

type QuizChoiceFieldProps = {
  index: number;
  choiceNumber: number;
  checked: boolean;
  showDivider?: boolean;
  onSelectCorrect: (choiceNumber: number) => void;
};

export default function QuizChoiceField({
  index,
  choiceNumber,
  checked,
  onSelectCorrect,
}: QuizChoiceFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateChatFormValues>();

  const choicePath = `quiz.choices.${index}.text` as const;
  const numberPath = `quiz.choices.${index}.choiceNumber` as const;
  const choiceError = getNameByPath<{ message?: unknown }>(errors as FieldErrors, choicePath);
  const choiceErrorMessage = typeof choiceError?.message === "string" ? choiceError.message : "";

  return (
    <>
      <QuizChoiceInput
        choiceNumber={choiceNumber}
        checked={checked}
        onSelectCorrect={onSelectCorrect}
        hiddenInputProps={register(numberPath, { valueAsNumber: true })}
        textInputProps={register(choicePath)}
        errorMessage={choiceErrorMessage}
      />
    </>
  );
}
