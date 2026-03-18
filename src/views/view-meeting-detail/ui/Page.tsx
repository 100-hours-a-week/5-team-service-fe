"use client";

import MeetingDetail from "@/features/view-meeting-detail/ui/MeetingDetail";
import type { GetMeetingDetailResponse } from "@/features/view-meeting-detail/model/types";
import type { MeetingReviewListResponse } from "@/features/view-meeting-review-list/model/types";
import PageHeader from "@/components/layout/PageHeader";
import { useRouter } from "next/navigation";
import { PolicyOption } from "@/entities/policy/model/types";

type MeetingDetailPageProps = {
  meetingId: number;
  initialData?: GetMeetingDetailResponse;
  initialGenres?: PolicyOption[];
  initialReviewPreview?: MeetingReviewListResponse | null;
};

export default function MeetingDetailPage({
  meetingId,
  initialData,
  initialGenres,
  initialReviewPreview,
}: MeetingDetailPageProps) {
  const router = useRouter();
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex h-dvh min-h-0 flex-1 flex-col overflow-hidden">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="모임 상세" onBack={handleBack} />
      </div>
      <MeetingDetail
        meetingId={meetingId}
        initialData={initialData}
        initialGenres={initialGenres}
        initialReviewPreview={initialReviewPreview}
      />
    </div>
  );
}
