import { apiFetch } from "@/lib/api/apiFetch";
import type { MyReviewDetailResponse } from "../model/types";

export default function getMyReviewDetail({ reviewId }: { reviewId: number }) {
  const requestUrl = `/users/me/reviews/${reviewId}`;
  return apiFetch<MyReviewDetailResponse>(requestUrl, {
    method: "GET",
  });
}
