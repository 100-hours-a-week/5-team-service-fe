import { useEffect, useMemo, useState } from "react";
import { useMeetingsInfiniteQuery } from "./useMeetingsInfiniteQuery";
import { useReadingGenresQuery } from "@/entities/policy/api/useReadingGenresQuery";
import {
  clearMeetingListRestore,
  getMeetingListRestore,
  saveMeetingListRestore,
} from "../lib/meetingListRestore";
import { useInView } from "react-intersection-observer";

const ITEMS_PER_PAGE = 6;

export const useMeetings = () => {
  const { genres } = useReadingGenresQuery();
  const genreMap = useMemo(() => new Map(genres?.map((genre) => [genre.id, genre.name])), [genres]);

  const restore = useMemo(() => getMeetingListRestore(), []);
  const pageSize = restore?.size ?? ITEMS_PER_PAGE;
  const [restoreCompleted, setRestoreCompleted] = useState(() => !restore);

  const { meetings, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useMeetingsInfiniteQuery({ size: pageSize });

  useEffect(() => {
    if (!restore || restoreCompleted || isLoading) return;
    if (meetings.length <= restore.clickedIndex) return;

    requestAnimationFrame(() => {
      const scroller = document.getElementById("app-scroll");
      if (scroller) scroller.scrollTo({ top: restore.anchorY, behavior: "auto" });
      clearMeetingListRestore();
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
    saveMeetingListRestore({ clickedIndex: index, anchorY: anchorY, size: pageSize });
  };

  const showInitSkeleton = isLoading && meetings.length === 0;
  const showNextSkeleton = isFetchingNextPage;

  return {
    meetings,
    isLoading,
    isError,
    hasNextPage,
    genreMap,
    sentinelRef,
    onClickMeeting,
    showInitSkeleton,
    showNextSkeleton,
  };
};
