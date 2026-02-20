"use client";

import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getChatListRestore } from "../lib/chatListRestore";
import { GetChatListResponse } from "@/entities/chat/api/get-chat-list/types";
import { getChatList } from "@/entities/chat/api/get-chat-list";

export default function useChatsInfiniteQuery(params: { size: number }) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["chats", { size: params.size }] as const, [params.size]);
  const restore = useMemo(() => getChatListRestore(), []);
  const [prefetchDone, setPrefetchDone] = useState(() => !restore);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldRefetch = sessionStorage.getItem("chatList:forceRefetch") === "1";
    if (!shouldRefetch) return;
    sessionStorage.removeItem("chatList:forceRefetch");
    queryClient.invalidateQueries({ queryKey });
    queryClient.refetchQueries({ queryKey });
  }, [queryClient, queryKey]);

  useEffect(() => {
    let cancelled = false;

    const prefetchForRestore = async () => {
      if (!restore || prefetchDone) return;

      const existing = queryClient.getQueryData<InfiniteData<GetChatListResponse>>(queryKey);
      if (existing?.pages?.length) {
        if (!cancelled) setPrefetchDone(true);
        return;
      }

      const pagesToPrefetch = Math.ceil((restore.clickedIndex + 1) / params.size);

      const pages: GetChatListResponse[] = [];
      const pageParams: Array<number | undefined> = [];
      let cursorId: number | undefined = undefined;

      for (let i = 0; i < pagesToPrefetch; i++) {
        const pageParam = cursorId;
        const response = await getChatList({ size: params.size, cursorId: pageParam });
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
      GetChatListResponse,
      Error,
      InfiniteData<GetChatListResponse>,
      typeof queryKey,
      number | undefined
    >({
      queryKey: queryKey,
      queryFn: ({ pageParam }) => getChatList({ size: params.size, cursorId: pageParam }),
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

  const chats = useMemo(() => {
    const chatList =
      data?.pages.flatMap((page) =>
        page.items.map((item) => ({
          ...item,
        })),
      ) ?? [];

    const unique = new Map<number, (typeof chatList)[number]>();
    for (const item of chatList) {
      if (!unique.has(item.roomId)) unique.set(item.roomId, item);
    }

    return Array.from(unique.values());
  }, [data?.pages]);

  return { chats, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage };
}
