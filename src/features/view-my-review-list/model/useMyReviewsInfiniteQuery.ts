"use client";

import { useEffect, useMemo, useState } from "react";
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import getMyReviews from "../api/getMyReviews";
import { getMyReviewListRestore } from "../lib/myReviewListRestore";
import type { MyReviewListResponse } from "./types";

export default function useMyReviewsInfiniteQuery(params: { size: number }) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["myReviews", { size: params.size }] as const, [params.size]);
  const restore = useMemo(() => getMyReviewListRestore(), []);
  const [prefetchDone, setPrefetchDone] = useState(() => !restore);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldRefetch = sessionStorage.getItem("myReviewList:forceRefetch") === "1";
    if (!shouldRefetch) return;
    sessionStorage.removeItem("myReviewList:forceRefetch");
    queryClient.invalidateQueries({ queryKey });
    queryClient.refetchQueries({ queryKey });
  }, [queryClient, queryKey]);

  useEffect(() => {
    let cancelled = false;

    const prefetchForRestore = async () => {
      if (!restore || prefetchDone) return;

      const existing = queryClient.getQueryData<InfiniteData<MyReviewListResponse>>(queryKey);
      if (existing?.pages?.length) {
        if (!cancelled) setPrefetchDone(true);
        return;
      }

      const pagesToPrefetch = Math.ceil((restore.clickedIndex + 1) / params.size);
      const pages: MyReviewListResponse[] = [];
      const pageParams: Array<number | undefined> = [];
      let cursorId: number | undefined = undefined;

      for (let i = 0; i < pagesToPrefetch; i++) {
        const pageParam = cursorId;
        const response = await getMyReviews({ size: params.size, cursorId: pageParam });
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
      MyReviewListResponse,
      Error,
      InfiniteData<MyReviewListResponse>,
      typeof queryKey,
      number | undefined
    >({
      queryKey,
      queryFn: ({ pageParam }) => getMyReviews({ size: params.size, cursorId: pageParam }),
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
