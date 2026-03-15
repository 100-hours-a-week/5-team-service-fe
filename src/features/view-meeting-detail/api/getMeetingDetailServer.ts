import { serverApiFetch } from "@/shared/api/serverApiFetch";
import { GetMeetingDetailResponse } from "../model/types";

export default function getMeetingDetailServer(
  meetingId: number,
  revalidate: number,
): Promise<GetMeetingDetailResponse> {
  const requestUrl = `/meetings/${meetingId}`;
  return serverApiFetch<GetMeetingDetailResponse>(requestUrl, {
    method: "GET",
    cache: "force-cache",
    next: { revalidate },
  });
}
