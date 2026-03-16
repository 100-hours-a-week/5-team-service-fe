import type { Metadata } from "next";
import { notFound } from "next/navigation";

import getMeetingDetailServer from "@/features/view-meeting-detail/api/getMeetingDetailServer";
import type { GetMeetingDetailResponse } from "@/features/view-meeting-detail/model/types";
import getMeetingReviewsServer from "@/features/view-meeting-review-list/api/getMeetingReviewsServer";
import type { MeetingReviewListResponse } from "@/features/view-meeting-review-list/model/types";
import MeetingDetailPage from "@/views/view-meeting-detail/ui/Page";
import getReadingGenresServer from "@/entities/policy/api/getReadingGenresServer";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}): Promise<Metadata> {
  const { meetingId: meetingIdParam } = await params;
  const meetingId = Number(meetingIdParam);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    return { title: "모임 상세" };
  }

  try {
    const detail = await getMeetingDetailServer(meetingId, revalidate);
    const { meeting } = detail;

    return {
      title: meeting.title,
      description: meeting.description,
      openGraph: {
        title: `${meeting.title} - 모임 상세`,
        description: meeting.description,
        type: "article",
        url: `/meeting/detail/${meetingId}`,
        images: meeting.meetingImagePath
          ? [{ url: meeting.meetingImagePath, alt: `${meeting.title} 대표 이미지` }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: meeting.title,
        description: meeting.description,
        images: meeting.meetingImagePath ? [meeting.meetingImagePath] : [],
      },
    };
  } catch {
    return { title: "모임 상세" };
  }
}

export default async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId: meetingIdParam } = await params;
  const meetingId = Number(meetingIdParam);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  let initialData: GetMeetingDetailResponse;
  let initialGenres: Awaited<ReturnType<typeof getReadingGenresServer>>;
  let initialReviewPreview: MeetingReviewListResponse | null = null;

  try {
    [initialData, initialGenres, initialReviewPreview] = await Promise.all([
      getMeetingDetailServer(meetingId, revalidate) as Promise<GetMeetingDetailResponse>,
      getReadingGenresServer(revalidate),
      getMeetingReviewsServer({
        meetingId,
        size: 4,
        requestInit: {
          cache: "force-cache",
          next: { revalidate },
        },
      }).catch(() => null),
    ]);
  } catch {
    notFound();
  }

  return (
    <MeetingDetailPage
      meetingId={meetingId}
      initialData={initialData}
      initialGenres={initialGenres}
      initialReviewPreview={initialReviewPreview}
    />
  );
}
