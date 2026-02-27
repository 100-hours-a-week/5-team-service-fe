import { CreateChatFormSteps } from "../model/types";
import CreateChatStep1 from "./CreateChatStep1";
import CreateChatStep2 from "./CreateChatStep2";

export default function CreateChatForm({ step }: CreateChatFormSteps) {
  return (
    <div className="flex flex-col gap-7">
      {step === 1 ? <CreateChatStep1 /> : <CreateChatStep2 />}
    </div>
  );
}
