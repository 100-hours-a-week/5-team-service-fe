import { apiFetch } from "@/lib/api/apiFetch";
import type {
  GetReviewCandidateMembersParams,
  GetReviewCandidateMembersResponse,
} from "../model/types";

export default function getReviewCandidateMembers(params: GetReviewCandidateMembersParams) {
  const { meetingId, meetingRoundId } = params;
  const requestUrl = `/meetings/${meetingId}/rounds/${meetingRoundId}/members/others`;
  return apiFetch<GetReviewCandidateMembersResponse>(requestUrl, {
    method: "GET",
  });
}
