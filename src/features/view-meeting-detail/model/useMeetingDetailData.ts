import { useQuery } from "@tanstack/react-query";

import { useReadingGenresQuery } from "@/entities/policy/api/useReadingGenresQuery";
import type { PolicyOption } from "@/entities/policy/model/types";
import getMeetingDetail from "../api/getMeetingDetail";
import type { GetMeetingDetailResponse } from "./types";

type UseMeetingDetailDataParams = {
  meetingId: number | null;
  initialData?: GetMeetingDetailResponse;
  initialGenres?: PolicyOption[];
};

export default function useMeetingDetailData({
  meetingId,
  initialData,
  initialGenres,
}: UseMeetingDetailDataParams) {
  const { genres } = useReadingGenresQuery({ initialData: initialGenres });

  const { data, isLoading, isError } = useQuery<GetMeetingDetailResponse>({
    queryKey: ["meetingDetail", meetingId],
    queryFn: () => getMeetingDetail(Number(meetingId)),
    enabled: Boolean(meetingId),
    initialData,
    staleTime: 1000 * 60,
  });

  const readingGenreName =
    !data?.meeting.readingGenreId || !genres
      ? "기타"
      : (genres.find((genre) => genre.id === data.meeting.readingGenreId)?.name ?? "기타");

  return { data, isLoading, isError, readingGenreName };
}
