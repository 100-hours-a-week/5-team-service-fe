"use client";

import { FormProvider } from "react-hook-form";
import { useCreateChat } from "../model/useCreateChat";
import CreateChatForm from "./CreateChatForm";
import { BottomSubmitButton } from "@/shared/ui/form/BottomSubmitButton";
import { useRouter } from "next/navigation";

import { CreateChatFormSteps } from "../model/types";
import { LAST_STEP, STEP_FIELDS } from "../model/config";
import { useCreateChatStore } from "../model/store";

export default function CreateChatFormProvider({ step }: CreateChatFormSteps) {
  const router = useRouter();
  const { createChatForm, handleSubmit } = useCreateChat();
  const setCreateChatFormDraftValues = useCreateChatStore((s) => s.setAll);
  const isLastStep = step === LAST_STEP;

  const goNext = async () => {
    const isValid = await createChatForm.trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (!isValid) return;
    setCreateChatFormDraftValues(createChatForm.getValues());
    router.push(`/chat/create/${step + 1}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-7 py-10">
      <FormProvider {...createChatForm}>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={isLastStep ? handleSubmit : (event) => event.preventDefault()}
        >
          <div className="min-h-0 flex-1 pb-5 overflow-y-auto no-scrollbar">
            <CreateChatForm step={step} />
          </div>
          <BottomSubmitButton
            submitLabel={isLastStep ? "생성하기" : "다음"}
            type={isLastStep ? "submit" : "button"}
            onClickSubmit={isLastStep ? undefined : goNext}
            variant="single"
          />
        </form>
      </FormProvider>
    </div>
  );
}
