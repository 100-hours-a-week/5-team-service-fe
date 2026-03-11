import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useReadingGenresQuery } from "@/entities/policy/api/useReadingGenresQuery";
import { useBookmarkedMeetingsInfiniteQuery } from "./useBookmarkedMeetingsInfiniteQuery";
import {
  clearBookmarkedMeetingListRestore,
  getBookmarkedMeetingListRestore,
  saveBookmarkedMeetingListRestore,
} from "../lib/bookmarkedMeetingListRestore";

const ITEMS_PER_PAGE = 4;

export const useBookmarkedMeetings = () => {
  const { genres } = useReadingGenresQuery();
  const genreMap = useMemo(() => new Map(genres?.map((genre) => [genre.id, genre.name])), [genres]);

  const restore = useMemo(() => getBookmarkedMeetingListRestore(), []);
  const pageSize = restore?.size ?? ITEMS_PER_PAGE;
  const [restoreCompleted, setRestoreCompleted] = useState(() => !restore);

  const { meetings, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useBookmarkedMeetingsInfiniteQuery({ size: pageSize });

  useEffect(() => {
    if (!restore || restoreCompleted || isLoading) return;
    if (meetings.length <= restore.clickedIndex) return;

    requestAnimationFrame(() => {
      const scroller = document.getElementById("app-scroll");
      if (scroller) scroller.scrollTo({ top: restore.anchorY, behavior: "auto" });
      clearBookmarkedMeetingListRestore();
      setRestoreCompleted(true);
    });
  }, [restore, restoreCompleted, isLoading, meetings.length]);

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

  const onClickMeeting = (index: number) => {
    const scroller = document.getElementById("app-scroll");
    const anchorY = scroller ? scroller.scrollTop : 0;
    saveBookmarkedMeetingListRestore({ clickedIndex: index, anchorY, size: pageSize });
  };

  const showInitSkeleton = isLoading && meetings.length === 0;
  const showNextSkeleton = isFetchingNextPage;

  return {
    meetings,
    isError,
    genreMap,
    sentinelRef,
    onClickMeeting,
    showInitSkeleton,
    showNextSkeleton,
  };
};
