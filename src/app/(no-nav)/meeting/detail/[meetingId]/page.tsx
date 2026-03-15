import type { Metadata } from "next";
import { notFound } from "next/navigation";

import getMeetingDetailServer from "@/features/view-meeting-detail/api/getMeetingDetailServer";
import type { GetMeetingDetailResponse } from "@/features/view-meeting-detail/model/types";
import MeetingDetailPage from "@/views/view-meeting-detail/ui/Page";
import getReadingGenresServer from "@/entities/policy/api/getReadingGenresServer";
import getMeetingListServer from "@/features/view-meeting-list/api/getMeetingListServer";

export const revalidate = 300;
const STATIC_PARAM_PAGE_SIZE = 10;
const STATIC_PARAM_MAX_PAGES = 5;

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

export async function generateStaticParams() {
  const meetingIds: string[] = [];
  let cursorId: number | undefined;

  for (let page = 0; page < STATIC_PARAM_MAX_PAGES; page += 1) {
    const meetings = await getMeetingListServer({
      size: STATIC_PARAM_PAGE_SIZE,
      cursorId,
      requestInit: {
        cache: "force-cache",
        next: { revalidate },
        timeoutMs: 20000,
      },
    });

    if (meetings.items.length === 0) break;
    meetingIds.push(...meetings.items.map((meeting) => String(meeting.meetingId)));

    if (!meetings.pageInfo.hasNext || meetings.pageInfo.nextCursorId == null) break;
    cursorId = meetings.pageInfo.nextCursorId;
  }

  const params = [...new Set(meetingIds)].map((meetingId) => ({ meetingId }));
  console.info(`[meeting/detail] generateStaticParams count=${params.length}`);
  return params;
}

export default async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId: meetingIdParam } = await params;
  const meetingId = Number(meetingIdParam);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  let initialData: GetMeetingDetailResponse;
  let initialGenres: Awaited<ReturnType<typeof getReadingGenresServer>>;

  try {
    [initialData, initialGenres] = await Promise.all([
      getMeetingDetailServer(meetingId, revalidate) as Promise<GetMeetingDetailResponse>,
      getReadingGenresServer(revalidate),
    ]);
  } catch {
    notFound();
  }

  return (
    <MeetingDetailPage
      meetingId={meetingId}
      initialData={initialData}
      initialGenres={initialGenres}
    />
  );
}
