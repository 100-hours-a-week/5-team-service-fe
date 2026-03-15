import { useQuery } from "@tanstack/react-query";

import { useReadingGenresQuery } from "@/entities/policy/api/useReadingGenresQuery";
import type { PolicyOption } from "@/entities/policy/model/types";
import { useUserProfileQuery } from "@/entities/user/model/useUserProfileQuery";
import getMeetingBookmark from "@/features/bookmarks-meeting/api/getMeetingBookmark";
import type { GetMeetingBookmarkResponse } from "@/features/bookmarks-meeting/model/types";
import { authStore, useAuthStore } from "@/shared/store/authStore";
import getMeetingDetail from "../api/getMeetingDetail";
import type { GetMeetingDetailResponse } from "./types";
import {
  GetMeetingParticipationStatusResponse,
  MeetingParticipationStatus,
} from "@/features/meeting-participation-status/model/types";
import getMeetingParticipationStatus from "@/features/meeting-participation-status/api/getMeetingParticipationStatus";

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
  const { profile } = useUserProfileQuery();
  const accessToken = useAuthStore((state) => state.accessToken);
  const initialized = useAuthStore((state) => state.initialized);
  const canFetchPersonalized =
    initialized &&
    typeof accessToken === "string" &&
    accessToken.trim().length > 0 &&
    Boolean(profile);

  const {
    data,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery<GetMeetingDetailResponse>({
    queryKey: ["meetingDetail", meetingId],
    queryFn: () => getMeetingDetail(Number(meetingId)),
    enabled: Boolean(meetingId),
    initialData,
    staleTime: 1000 * 60,
  });

  const {
    data: bookmarkData,
    isLoading: isBookmarkLoading,
    isError: isBookmarkError,
  } = useQuery<GetMeetingBookmarkResponse>({
    queryKey: ["meetingBookmark", meetingId],
    queryFn: async () => {
      const token = authStore.getAccessToken();
      if (!token || token.trim().length === 0) {
        return { isBookmarked: false };
      }
      return getMeetingBookmark({ meetingId: Number(meetingId) });
    },
    enabled: Boolean(meetingId) && canFetchPersonalized,
    staleTime: 1000 * 60,
    retry: 0,
  });

  const {
    data: participationStatusData,
    isLoading: isParticipationLoading,
    isError: isParticipationError,
  } = useQuery<GetMeetingParticipationStatusResponse>({
    queryKey: ["meetingParticipationStatus", meetingId],
    queryFn: () => getMeetingParticipationStatus({ meetingId: Number(meetingId) }),
    enabled: Boolean(meetingId) && canFetchPersonalized,
    staleTime: 1000 * 60,
    retry: 0,
  });

  const isBookmarked = bookmarkData?.isBookmarked ?? false;
  const participationStatus: MeetingParticipationStatus =
    participationStatusData?.myParticipationStatus ?? "NONE";
  const participantProfileImages = participationStatusData?.profileImages ?? [];
  const participantTotalCount = participationStatusData?.totalCount;

  const isLoading =
    isDetailLoading ||
    (canFetchPersonalized && isParticipationLoading) ||
    (canFetchPersonalized && isBookmarkLoading);
  const isError =
    isDetailError ||
    (canFetchPersonalized && isParticipationError) ||
    (canFetchPersonalized && isBookmarkError);

  const readingGenreName =
    !data?.meeting.readingGenreId || !genres
      ? "기타"
      : (genres.find((genre) => genre.id === data.meeting.readingGenreId)?.name ?? "기타");

  return {
    data,
    isBookmarked,
    participationStatus,
    participantTotalCount,
    participantProfileImages,
    isLoading,
    isError,
    readingGenreName,
  };
}
