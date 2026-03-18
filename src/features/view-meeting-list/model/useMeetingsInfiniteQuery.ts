"use client";

import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { MeetingListResponse } from "./types";

import { getMeetingListRestore } from "../lib/meetingListRestore";
import { useEffect, useMemo, useState } from "react";
import getMeetingList from "../api/getMeetingList";

export const useMeetingsInfiniteQuery = (params: {
  size: number;
  initialData?: InfiniteData<MeetingListResponse, number | undefined>;
}) => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["meetings", { size: params.size }] as const, [params.size]);
  const restore = useMemo(() => getMeetingListRestore(), []);
  const [prefetchDone, setPrefetchDone] = useState(() => !restore);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldRefetch = sessionStorage.getItem("meetingList:forceRefetch") === "1";
    if (!shouldRefetch) return;
    sessionStorage.removeItem("meetingList:forceRefetch");
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
        const response = await getMeetingList({ size: params.size, cursorId: pageParam });
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
      queryKey: queryKey,
      queryFn: ({ pageParam }) => getMeetingList({ size: params.size, cursorId: pageParam }),
      initialData: params.initialData,
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
      data?.pages.flatMap((page) =>
        page.items.map((item) =>
          typeof item.readingGenreId === "number"
            ? item
            : {
                ...item,
                readingGenreId: Number(item.readingGenreId),
              },
        ),
      ) ?? [];

    const unique = new Map<number, (typeof meetingsList)[number]>();
    for (const item of meetingsList) {
      if (!unique.has(item.meetingId)) unique.set(item.meetingId, item);
    }

    return Array.from(unique.values());
  }, [data?.pages]);

  return { meetings, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage };
};
