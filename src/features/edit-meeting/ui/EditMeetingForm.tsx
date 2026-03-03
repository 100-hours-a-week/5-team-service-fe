import { useFormContext } from "react-hook-form";
import EditMeetingBasicInfoSection from "./EditMeetingBasicInfoSection";
import type { EditMeetingFormValues } from "../model/types";

type EditMeetingFormProps = {
  currentMemberCount: number;
  maxRecruitmentDeadlineDate?: Date;
};

export default function EditMeetingForm({
  currentMemberCount,
  maxRecruitmentDeadlineDate,
}: EditMeetingFormProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext<EditMeetingFormValues>();

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pb-26 pt-6">
        <EditMeetingBasicInfoSection
          currentMemberCount={currentMemberCount}
          maxRecruitmentDeadlineDate={maxRecruitmentDeadlineDate}
        />
      </div>
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[500px] -translate-x-1/2 border-t border-gray-200 bg-white px-7 py-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white disabled:opacity-40"
        >
          {isSubmitting ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}
