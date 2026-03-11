import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";

import createMeetingBookmark from "../api/createMeetingBookmarks";
import deleteMeetingBookmark from "../api/deleteMeetingBookmark";
import type { GetMeetingDetailResponse } from "@/features/view-meeting-detail/model/types";
import type { MeetingListResponse } from "@/features/view-meeting-list/model/types";
import type { GetMeetingBookmarkResponse } from "../model/types";

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

function patchBookmarkedMeetingList(
  previous: InfiniteData<MeetingListResponse> | undefined,
  meetingId: number,
  nextBookmarked: boolean,
) {
  if (!previous) return previous;

  return {
    ...previous,
    pages: previous.pages.map((page) => ({
      ...page,
      items: page.items
        .map((item) =>
          item.meetingId === meetingId ? { ...item, isBookmarked: nextBookmarked } : item,
        )
        .filter((item) => item.isBookmarked !== false),
    })),
  };
}

function patchMeetingBookmark(
  previous: GetMeetingBookmarkResponse | undefined,
  nextBookmarked: boolean,
) {
  if (!previous) {
    return { isBookmarked: nextBookmarked };
  }
  return {
    ...previous,
    isBookmarked: nextBookmarked,
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
        queryClient.cancelQueries({ queryKey: ["meetingBookmark", meetingId] }),
        queryClient.cancelQueries({ queryKey: ["meetings"] }),
        queryClient.cancelQueries({ queryKey: ["bookmarkedMeetings"] }),
      ]);

      const previousMeetingDetail = queryClient.getQueryData<GetMeetingDetailResponse>([
        "meetingDetail",
        meetingId,
      ]);
      const previousMeetingBookmark = queryClient.getQueryData<GetMeetingBookmarkResponse>([
        "meetingBookmark",
        meetingId,
      ]);
      const previousMeetingsQueries = queryClient.getQueriesData<InfiniteData<MeetingListResponse>>(
        {
          queryKey: ["meetings"],
        },
      );
      const previousBookmarkedMeetingsQueries = queryClient.getQueriesData<
        InfiniteData<MeetingListResponse>
      >({
        queryKey: ["bookmarkedMeetings"],
      });

      queryClient.setQueryData<GetMeetingDetailResponse | undefined>(
        ["meetingDetail", meetingId],
        (old) => patchMeetingDetailBookmark(old, nextBookmarked),
      );

      queryClient.setQueriesData<InfiniteData<MeetingListResponse> | undefined>(
        { queryKey: ["meetings"] },
        (old) => patchMeetingListBookmark(old, meetingId, nextBookmarked),
      );
      queryClient.setQueriesData<InfiniteData<MeetingListResponse> | undefined>(
        { queryKey: ["bookmarkedMeetings"] },
        (old) => patchBookmarkedMeetingList(old, meetingId, nextBookmarked),
      );

      queryClient.setQueryData<GetMeetingBookmarkResponse | undefined>(
        ["meetingBookmark", meetingId],
        (old) => patchMeetingBookmark(old, nextBookmarked),
      );

      return {
        previousMeetingDetail,
        previousMeetingBookmark,
        previousMeetingsQueries,
        previousBookmarkedMeetingsQueries,
      };
    },
    onError: (_error, _nextBookmarked, context) => {
      if (!context) return;

      queryClient.setQueryData(["meetingDetail", meetingId], context.previousMeetingDetail);
      queryClient.setQueryData(["meetingBookmark", meetingId], context.previousMeetingBookmark);
      context.previousMeetingsQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context.previousBookmarkedMeetingsQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
  });

  const toggle = () => {
    mutation.mutate(!isBookmarked);
  };

  return { isPending: mutation.isPending, toggle };
}
