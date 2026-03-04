"use client";

import PageHeader from "@/components/layout/PageHeader";
import { EditMeetingFormProvider } from "@/features/edit-meeting/ui/EditMeetingFormProvider";

export default function EditMeetingPage({ meetingId }: { meetingId: number }) {
  return (
    <div className="relative flex h-dvh min-h-0 flex-col overflow-hidden">
      <div className="fixed left-1/2 top-0 z-30 w-full max-w-[500px] -translate-x-1/2 bg-white">
        <PageHeader title="나의 모임 수정" />
      </div>
      <div className="flex min-h-0 w-full flex-1 pt-16">
        <EditMeetingFormProvider meetingId={meetingId} />
      </div>
    </div>
  );
}
