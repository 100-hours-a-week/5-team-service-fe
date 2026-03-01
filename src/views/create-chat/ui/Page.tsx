import PageHeader from "@/components/layout/PageHeader";
import { CreateChatFormSteps } from "@/features/create-chat/model/types";
import CreateChatFormProvider from "@/features/create-chat/ui/CreateChatFormProvider";

export default function CreateChatPage({ step }: CreateChatFormSteps) {
  return (
    <div className="flex h-dvh min-h-0 flex-col">
      <PageHeader title="채팅 토론방 생성" />
      <CreateChatFormProvider step={step} />
    </div>
  );
}
