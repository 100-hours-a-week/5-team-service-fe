import type { InfiniteData } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import getMeetingReviewsServer from "@/features/view-meeting-review-list/api/getMeetingReviewsServer";
import type { MeetingReviewListResponse } from "@/features/view-meeting-review-list/model/types";
import ViewMeetingReviewListPage from "@/views/view-meeting-review-list/ui/Page";

export const revalidate = 300;

export default async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId: meetingIdParam } = await params;
  const meetingId = Number(meetingIdParam);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  let initialData: InfiniteData<MeetingReviewListResponse, number | undefined> | undefined;

  try {
    const initialPage = await getMeetingReviewsServer({
      meetingId,
      size: 10,
      requestInit: {
        cache: "force-cache",
        next: { revalidate },
      },
    });

    initialData = {
      pages: [initialPage],
      pageParams: [undefined],
    };
  } catch {
    initialData = undefined;
  }

  return <ViewMeetingReviewListPage meetingId={meetingId} initialData={initialData} />;
}
