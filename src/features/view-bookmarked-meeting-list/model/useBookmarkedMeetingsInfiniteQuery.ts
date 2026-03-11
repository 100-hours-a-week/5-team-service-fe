"use client";

import { useEffect, useMemo, useState } from "react";
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getBookmarkedMeetingListRestore } from "../lib/bookmarkedMeetingListRestore";
import getBookmarkedMeetingList from "../api/getBookmarkedMeetingList";
import { MeetingListResponse } from "@/entities/meeting/model/types";

export const useBookmarkedMeetingsInfiniteQuery = (params: { size: number }) => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["bookmarkedMeetings", { size: params.size }] as const,
    [params.size],
  );
  const restore = useMemo(() => getBookmarkedMeetingListRestore(), []);
  const [prefetchDone, setPrefetchDone] = useState(() => !restore);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldRefetch = sessionStorage.getItem("bookmarkedMeetingList:forceRefetch") === "1";
    if (!shouldRefetch) return;
    sessionStorage.removeItem("bookmarkedMeetingList:forceRefetch");
    queryClient.invalidateQueries({ queryKey });
    queryClient.refetchQueries({ queryKey });
  }, [queryClient, queryKey]);

  useEffect(() => {
    let cancelled = false;

    const prefetchForRestore = async () => {
      if (!restore || prefetchDone) return;

      const existing = queryClient.getQueryData<InfiniteData<MeetingListResponse>>(queryKey);
      if (existing?.pages?.length) {
        if (!cancelled) setPrefetchDone(true);
        return;
      }

      const pagesToPrefetch = Math.ceil((restore.clickedIndex + 1) / params.size);

      const pages: MeetingListResponse[] = [];
      const pageParams: Array<number | undefined> = [];
      let cursorId: number | undefined = undefined;

      for (let i = 0; i < pagesToPrefetch; i++) {
        const pageParam = cursorId;
        const response = await getBookmarkedMeetingList({ size: params.size, cursorId: pageParam });
        pages.push(response);
        pageParams.push(pageParam);

        if (!response.pageInfo.hasNext || response.pageInfo.nextCursorId == null) break;
        cursorId = response.pageInfo.nextCursorId;
      }

      queryClient.setQueryData(queryKey, { pages, pageParams });
      if (!cancelled) setPrefetchDone(true);
    };

    prefetchForRestore();

    return () => {
      cancelled = true;
    };
  }, [restore, prefetchDone, params.size, queryClient, queryKey]);

  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<
      MeetingListResponse,
      Error,
      InfiniteData<MeetingListResponse>,
      typeof queryKey,
      number | undefined
    >({
      queryKey,
      queryFn: ({ pageParam }) =>
        getBookmarkedMeetingList({ size: params.size, cursorId: pageParam }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) =>
        lastPage.pageInfo.hasNext ? lastPage.pageInfo.nextCursorId : undefined,
      enabled: prefetchDone,
      staleTime: 1000 * 60 * 10,
      retry: 0,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  const meetings = useMemo(() => {
    const meetingsList =
      data?.pages.flatMap((page) => {
        const pageItems = Array.isArray(page?.items) ? page.items : [];
        return pageItems.map((item) =>
          typeof item.readingGenreId === "number"
            ? item
            : { ...item, readingGenreId: Number(item.readingGenreId) },
        );
      }) ?? [];

    const unique = new Map<number, (typeof meetingsList)[number]>();
    for (const item of meetingsList) {
      if (!unique.has(item.meetingId)) unique.set(item.meetingId, item);
    }

    return Array.from(unique.values());
  }, [data?.pages]);

  return { meetings, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage };
};
