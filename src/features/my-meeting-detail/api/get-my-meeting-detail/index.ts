"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { GetMyMeetingDetailReqeust, GetMyMeetingDetailResponse } from "./types";

export default async function getMyMeetingDetail({
  meetingId,
}: GetMyMeetingDetailReqeust): Promise<GetMyMeetingDetailResponse> {
  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    throw new Error("잘못된 meetingId 입니다. 나의 모임 조회에 실패했습니다.");
  }

  const requestUrl = `/users/me/meetings/${meetingId}`;
  return apiFetch<GetMyMeetingDetailResponse>(requestUrl, {
    method: "GET",
  });
}
