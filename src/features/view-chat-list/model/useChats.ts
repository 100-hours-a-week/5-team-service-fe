"use client";

import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import useChatsInfiniteQuery from "./useChatsInfiniteQuery";
import {
  clearChatListRestore,
  getChatListRestore,
  saveChatListRestore,
} from "../lib/chatListRestore";

const ITEMS_PER_PAGE = 6;

export default function useChats() {
  const router = useRouter();
  const restore = useMemo(() => getChatListRestore(), []);
  const pageSize = restore?.size ?? ITEMS_PER_PAGE;
  const [restoreCompleted, setRestoreCompleted] = useState(() => !restore);

  const { chats, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useChatsInfiniteQuery({ size: pageSize });

  useEffect(() => {
    if (!restore || restoreCompleted || isLoading) return;
    if (chats.length <= restore.clickedIndex) return;

    requestAnimationFrame(() => {
      const scroller = document.getElementById("app-scroll");
      if (scroller) scroller.scrollTo({ top: restore.anchorY, behavior: "auto" });
      clearChatListRestore();
      setRestoreCompleted(true);
    });
  }, [restore, restoreCompleted, isLoading, chats.length]);

  const { ref: sentinelRef, inView } = useInView({
    root: null,
    threshold: 0,
    rootMargin: "200px 0px",
    skip: !hasNextPage,
  });

  useEffect(() => {
    if (!inView || isLoading || !hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [inView, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onClickChat = (index: number, roomId: number, queryString?: string) => {
    const scroller = document.getElementById("app-scroll");
    const anchorY = scroller ? scroller.scrollTop : 0;
    saveChatListRestore({ clickedIndex: index, anchorY, size: pageSize });
    const suffix = queryString ? `?${queryString}` : "";
    router.push(`/chat/${roomId}/lobby${suffix}`);
  };

  const showInitSkeleton = isLoading && chats.length === 0;
  const showNextSkeleton = isFetchingNextPage;

  return {
    chats,
    isLoading,
    isError,
    hasNextPage,
    sentinelRef,
    onClickChat,
    showInitSkeleton,
    showNextSkeleton,
  };
}
