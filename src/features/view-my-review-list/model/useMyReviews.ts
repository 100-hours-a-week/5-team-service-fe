import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import useMyReviewsInfiniteQuery from "./useMyReviewsInfiniteQuery";
import {
  clearMyReviewListRestore,
  getMyReviewListRestore,
  saveMyReviewListRestore,
} from "../lib/myReviewListRestore";

const ITEMS_PER_PAGE = 10;

export default function useMyReviews() {
  const restore = useMemo(() => getMyReviewListRestore(), []);
  const pageSize = restore?.size ?? ITEMS_PER_PAGE;
  const [restoreCompleted, setRestoreCompleted] = useState(() => !restore);

  const { reviews, isLoading, isError, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useMyReviewsInfiniteQuery({ size: pageSize });

  useEffect(() => {
    if (!restore || restoreCompleted || isLoading) return;
    if (reviews.length <= restore.clickedIndex) return;

    requestAnimationFrame(() => {
      const scroller = document.getElementById("app-scroll");
      if (scroller) scroller.scrollTo({ top: restore.anchorY, behavior: "auto" });
      clearMyReviewListRestore();
      setRestoreCompleted(true);
    });
  }, [restore, restoreCompleted, isLoading, reviews.length]);

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

  const onClickReview = (index: number) => {
    const scroller = document.getElementById("app-scroll");
    const anchorY = scroller ? scroller.scrollTop : 0;
    saveMyReviewListRestore({ clickedIndex: index, anchorY, size: pageSize });
  };

  const showInitSkeleton = isLoading && reviews.length === 0;
  const showNextSkeleton = isFetchingNextPage;

  return {
    reviews,
    isError,
    sentinelRef,
    onClickReview,
    showInitSkeleton,
    showNextSkeleton,
  };
}
