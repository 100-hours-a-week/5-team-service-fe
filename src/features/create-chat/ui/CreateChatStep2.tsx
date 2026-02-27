import OptionSelectField from "@/shared/ui/form/OptionSelectField";
import ChatQuizEditor from "./ChatQuizEditor";
import { CAPACITY_OPTIONS, POSITION_OPTIONS } from "../model/config";

export default function CreateChatStep2() {
  return (
    <>
      <ChatQuizEditor />
      <OptionSelectField name="capacity" label="토론 정원" options={CAPACITY_OPTIONS} columns={3} />
      <OptionSelectField
        name="position"
        label="찬반 입장 선택"
        options={POSITION_OPTIONS}
        columns={2}
      />
    </>
  );
}
