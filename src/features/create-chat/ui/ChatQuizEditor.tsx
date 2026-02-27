"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CreateChatFormValues } from "../model/types";
import { QUIZ_CHOICE_COUNT } from "../model/config";
import TextField from "@/shared/ui/form/TextField";
import QuizChoiceField from "@/shared/ui/form/QuizChoiceField";

export default function ChatQuizEditor() {
  const { setValue, control } = useFormContext<CreateChatFormValues>();

  const choices = useWatch({ control, name: "quiz.choices" });
  const correctChoiceNumber = useWatch({ control, name: "quiz.correctChoiceNumber" });

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
    </div>
  );
}
