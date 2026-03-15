import MainHeader from "@/components/layout/MainHeader";
import { MeetingList } from "@/features/view-meeting-list/ui/MeetingList";
import RecommendedMeetings from "@/components/meeting/RecommendedMeetings";
import type { InfiniteData } from "@tanstack/react-query";
import type { MeetingListResponse } from "@/features/view-meeting-list/model/types";
import getMeetingListServer from "@/features/view-meeting-list/api/getMeetingListServer";

const SSR_MEETING_LIST_PAGE_SIZE = 10;
const SSR_MEETING_LIST_MAX_PAGES = 5;

export default async function Page() {
  let initialMeetingListData: InfiniteData<MeetingListResponse, number | undefined> | undefined;

  try {
    const pages: MeetingListResponse[] = [];
    const pageParams: Array<number | undefined> = [];
    let cursorId: number | undefined;

    for (let page = 0; page < SSR_MEETING_LIST_MAX_PAGES; page += 1) {
      const pageParam = cursorId;
      const response = await getMeetingListServer({
        size: SSR_MEETING_LIST_PAGE_SIZE,
        cursorId: pageParam,
        requestInit: {
          method: "GET",
          cache: "no-store",
          timeoutMs: 20000,
        },
      });

      pages.push(response);
      pageParams.push(pageParam);

      if (!response.pageInfo.hasNext || response.pageInfo.nextCursorId == null) break;
      cursorId = response.pageInfo.nextCursorId;
    }

    initialMeetingListData = pages.length
      ? {
          pages,
          pageParams,
        }
      : undefined;
  } catch {
    initialMeetingListData = undefined;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-20 bg-white">
        <MainHeader hasUnread />
      </div>
      <div className="flex-1">
        <RecommendedMeetings />
        <MeetingList initialData={initialMeetingListData} />
      </div>
    </div>
  );
}
