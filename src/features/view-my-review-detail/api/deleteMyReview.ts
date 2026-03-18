import { apiFetch } from "@/lib/api/apiFetch";

export default function deleteMyReview({ reviewId }: { reviewId: number }) {
  const requestUrl = `/reviews/${reviewId}`;
  return apiFetch<null>(requestUrl, {
    method: "DELETE",
  });
}
