"use client";

import { useRouter } from "next/navigation";
import type { InfiniteData } from "@tanstack/react-query";
import PageHeader from "@/components/layout/PageHeader";
import MeetingReviewList from "@/features/view-meeting-review-list/ui/MeetingReviewList";
import type { MeetingReviewListResponse } from "@/features/view-meeting-review-list/model/types";

type ViewMeetingReviewListPageProps = {
  meetingId: number;
  initialData?: InfiniteData<MeetingReviewListResponse, number | undefined>;
};

export default function ViewMeetingReviewListPage({
  meetingId,
  initialData,
}: ViewMeetingReviewListPageProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader
          title="모임장 후기"
          onBack={() => router.push(`/meeting/detail/${meetingId}`)}
        />
      </div>
      <div className="flex-1">
        <MeetingReviewList meetingId={meetingId} initialData={initialData} />
      </div>
    </div>
  );
}
