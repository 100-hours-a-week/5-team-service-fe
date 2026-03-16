"use client";

import { useEffect, useMemo, useState } from "react";
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import getMeetingReviews from "../api/getMeetingReviews";
import { getMeetingReviewListRestore } from "../lib/meetingReviewListRestore";
import type { MeetingReviewListResponse } from "./types";

type UseMeetingReviewsInfiniteQueryParams = {
  meetingId: number;
  size: number;
  initialData?: InfiniteData<MeetingReviewListResponse, number | undefined>;
};

export default function useMeetingReviewsInfiniteQuery({
  meetingId,
  size,
  initialData,
}: UseMeetingReviewsInfiniteQueryParams) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["meetingReviews", meetingId, { size }] as const,
    [meetingId, size],
  );
  const restore = useMemo(() => getMeetingReviewListRestore(meetingId), [meetingId]);
  const [prefetchDone, setPrefetchDone] = useState(() => !restore);

  useEffect(() => {
    let cancelled = false;

    const prefetchForRestore = async () => {
      if (!restore || prefetchDone) return;

      const existing =
        queryClient.getQueryData<InfiniteData<MeetingReviewListResponse, number | undefined>>(
          queryKey,
        );
      const pages = existing?.pages ? [...existing.pages] : [];
      const pageParams = existing?.pageParams ? [...existing.pageParams] : [];
      let loadedCount = pages.flatMap((page) => page.items ?? []).length;

      if (loadedCount >= restore.loadedCount) {
        if (!cancelled) setPrefetchDone(true);
        return;
      }

      let cursorId =
        pages.length && pages[pages.length - 1]?.pageInfo.hasNext
          ? pages[pages.length - 1]?.pageInfo.nextCursorId
          : undefined;

      while (loadedCount < restore.loadedCount) {
        if (pages.length && cursorId == null) break;

        const pageParam = pages.length ? cursorId : undefined;
        const response = await getMeetingReviews({ meetingId, size, cursorId: pageParam });
        pages.push(response);
        pageParams.push(pageParam);
        loadedCount += response.items?.length ?? 0;

        if (!response.pageInfo.hasNext || response.pageInfo.nextCursorId == null) {
          cursorId = undefined;
          break;
        }

        cursorId = response.pageInfo.nextCursorId;
      }

      queryClient.setQueryData(queryKey, { pages, pageParams });
      if (!cancelled) setPrefetchDone(true);
    };

    void prefetchForRestore();

    return () => {
      cancelled = true;
    };
  }, [restore, prefetchDone, meetingId, size, queryClient, queryKey]);

  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<
      MeetingReviewListResponse,
      Error,
      InfiniteData<MeetingReviewListResponse>,
      typeof queryKey,
      number | undefined
    >({
      queryKey,
      queryFn: ({ pageParam }) => getMeetingReviews({ meetingId, size, cursorId: pageParam }),
      initialData,
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

  const reviews = useMemo(() => {
    const items = data?.pages.flatMap((page) => page.items ?? []) ?? [];
    const unique = new Map<number, (typeof items)[number]>();
    for (const item of items) {
      if (!unique.has(item.reviewId)) unique.set(item.reviewId, item);
    }
    return Array.from(unique.values());
  }, [data?.pages]);

  return { reviews, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage };
}
