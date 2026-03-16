"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import {
  clearMeetingReviewListRestore,
  getMeetingReviewListRestore,
  saveMeetingReviewListRestore,
} from "../lib/meetingReviewListRestore";
import useMeetingReviewsInfiniteQuery from "./useMeetingReviewsInfiniteQuery";
import type { MeetingReviewListResponse } from "./types";

const ITEMS_PER_PAGE = 10;

type UseMeetingReviewsParams = {
  meetingId: number;
  initialData?: InfiniteData<MeetingReviewListResponse, number | undefined>;
};

export default function useMeetingReviews({ meetingId, initialData }: UseMeetingReviewsParams) {
  const restore = useMemo(() => getMeetingReviewListRestore(meetingId), [meetingId]);
  const pageSize = restore?.size ?? ITEMS_PER_PAGE;
  const [restoreCompleted, setRestoreCompleted] = useState(() => !restore);
  const queryInitialData = restore ? undefined : initialData;

  const { reviews, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useMeetingReviewsInfiniteQuery({ meetingId, size: pageSize, initialData: queryInitialData });

  const reviewsLengthRef = useRef(reviews.length);
  const pageSizeRef = useRef(pageSize);

  useEffect(() => {
    reviewsLengthRef.current = reviews.length;
  }, [reviews.length]);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  useEffect(() => {
    if (!restore || restoreCompleted || isLoading) return;
    if (reviews.length < restore.loadedCount) return;

    requestAnimationFrame(() => {
      const scroller = document.getElementById("app-scroll");
      if (scroller) scroller.scrollTo({ top: restore.anchorY, behavior: "auto" });
      clearMeetingReviewListRestore(meetingId);
      setRestoreCompleted(true);
    });
  }, [meetingId, restore, restoreCompleted, isLoading, reviews.length]);

  useEffect(() => {
    const saveRestore = () => {
      const scroller = document.getElementById("app-scroll");
      if (!scroller || reviewsLengthRef.current <= 0) return;
      saveMeetingReviewListRestore(meetingId, {
        anchorY: scroller.scrollTop,
        loadedCount: reviewsLengthRef.current,
        size: pageSizeRef.current,
      });
    };

    window.addEventListener("pagehide", saveRestore);
    return () => {
      window.removeEventListener("pagehide", saveRestore);
      saveRestore();
    };
  }, [meetingId]);

  const { ref: sentinelRef, inView } = useInView({
    root: null,
    threshold: 0,
    rootMargin: "200px 0px",
    skip: !hasNextPage,
  });

  useEffect(() => {
    if (!inView || isLoading || !hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  }, [inView, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const showInitSkeleton = isLoading && reviews.length === 0;
  const showNextSkeleton = isFetchingNextPage;

  return {
    reviews,
    isError,
    sentinelRef,
    showInitSkeleton,
    showNextSkeleton,
  };
}
