import { apiFetch } from "@/lib/api/apiFetch";
import type { GetMyReviewsRequest, MyReviewListResponse } from "../model/types";

export default function getMyReviews({
  size = 10,
  cursorId,
}: GetMyReviewsRequest): Promise<MyReviewListResponse> {
  const cursorParam = cursorId ? `&cursorId=${cursorId}` : "";
  const requestUrl = `/users/me/reviews?size=${size}${cursorParam}`;
  return apiFetch<MyReviewListResponse>(requestUrl, {
    method: "GET",
  });
}
