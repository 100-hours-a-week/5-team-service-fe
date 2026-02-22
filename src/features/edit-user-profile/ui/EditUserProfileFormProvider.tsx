"use client";

import { FormProvider } from "react-hook-form";
import { useEditUserProfile } from "../model/useEditUserProfile";
import EditUserProfileForm from "./EditUserProfileForm";
import { BottomSubmitButton } from "@/shared/ui/form/BottomSubmitButton";
import Toast from "@/shared/ui/Toast";
import useToastMessage from "@/shared/lib/useToastMessage";
import { TOAST_MESSAGE_TYPE } from "@/shared/lib/toastMessageType";
import { useRouter } from "next/navigation";

export default function EditUserProfileFormProvider() {
  const { editUserProfileForm, handleSubmit, isLoading, isError } = useEditUserProfile();
  const { toastMessage, phase, showToast, handleExitAnimationEnd } = useToastMessage();

  const onSubmit = editUserProfileForm.handleSubmit(async () => {
    const result = await handleSubmit();
    showToast(TOAST_MESSAGE_TYPE.profile[result.type].message);
  });

  const router = useRouter();

  if (isLoading) return null;
  if (isError) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col px-7 py-10 relative">
      <FormProvider {...editUserProfileForm}>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
            <EditUserProfileForm />
          </div>
          <BottomSubmitButton
            variant="dual"
            onClickCancel={() => router.push("/my")}
            cancleLabel="닫기"
            submitLabel="저장하기"
          />
        </form>
      </FormProvider>
      <Toast message={toastMessage} phase={phase} onExitAnimationEnd={handleExitAnimationEnd} />
    </div>
  );
}
