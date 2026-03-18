import { apiFetch } from "@/lib/api/apiFetch";
import type {
  CreateMeetingRoundReviewRequest,
  CreateMeetingRoundReviewResponse,
} from "../model/types";

export default function createMeetingRoundReview({
  meetingRoundId,
  request,
}: {
  meetingRoundId: number;
  request: CreateMeetingRoundReviewRequest;
}) {
  const requestUrl = `/reviews/meeting-rounds/${meetingRoundId}`;
  return apiFetch<CreateMeetingRoundReviewResponse>(requestUrl, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
