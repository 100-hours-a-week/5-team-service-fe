import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";

import createMeetingBookmark from "../api/createMeetingBookmarks";
import deleteMeetingBookmark from "../api/deleteMeetingBookmark";
import type { GetMeetingDetailResponse } from "@/features/view-meeting-detail/model/types";
import type { MeetingListResponse } from "@/features/view-meeting-list/model/types";

type UseToggleMeetingBookmarkParams = {
  meetingId: number;
  isBookmarked: boolean;
};

function patchMeetingDetailBookmark(
  previous: GetMeetingDetailResponse | undefined,
  nextBookmarked: boolean,
) {
  if (!previous) return previous;
  return {
    ...previous,
    meeting: {
      ...previous.meeting,
      isBookmarked: nextBookmarked,
    },
  };
}

function patchMeetingListBookmark(
  previous: InfiniteData<MeetingListResponse> | undefined,
  meetingId: number,
  nextBookmarked: boolean,
) {
  if (!previous) return previous;
  return {
    ...previous,
    pages: previous.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        item.meetingId === meetingId ? { ...item, isBookmarked: nextBookmarked } : item,
      ),
    })),
  };
}

export default function useToggleMeetingBookmark({
  meetingId,
  isBookmarked,
}: UseToggleMeetingBookmarkParams) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (nextBookmarked: boolean) => {
      if (nextBookmarked) {
        await createMeetingBookmark({ meetingId });
        return;
      }
      await deleteMeetingBookmark({ meetingId });
    },
    onMutate: async (nextBookmarked) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["meetingDetail", meetingId] }),
        queryClient.cancelQueries({ queryKey: ["meetings"] }),
      ]);

      const previousMeetingDetail = queryClient.getQueryData<GetMeetingDetailResponse>([
        "meetingDetail",
        meetingId,
      ]);
      const previousMeetingsQueries = queryClient.getQueriesData<InfiniteData<MeetingListResponse>>(
        {
          queryKey: ["meetings"],
        },
      );

      queryClient.setQueryData<GetMeetingDetailResponse | undefined>(
        ["meetingDetail", meetingId],
        (old) => patchMeetingDetailBookmark(old, nextBookmarked),
      );

      queryClient.setQueriesData<InfiniteData<MeetingListResponse> | undefined>(
        { queryKey: ["meetings"] },
        (old) => patchMeetingListBookmark(old, meetingId, nextBookmarked),
      );

      return { previousMeetingDetail, previousMeetingsQueries };
    },
    onError: (_error, _nextBookmarked, context) => {
      if (!context) return;

      queryClient.setQueryData(["meetingDetail", meetingId], context.previousMeetingDetail);
      context.previousMeetingsQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["meetingDetail", meetingId] });
    },
  });

  const toggle = () => {
    mutation.mutate(!isBookmarked);
  };

  return { isPending: mutation.isPending, toggle };
}
