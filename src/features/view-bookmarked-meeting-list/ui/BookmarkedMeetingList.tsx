"use client";

import { Skeleton } from "@/entities/meeting/ui/MeetingCardSkeleton";
import { MeetingCard } from "@/entities/meeting/ui/MeetingCard";
import { useBookmarkedMeetings } from "../model/useBookmarkedMeetings";

export const BookmarkedMeetingList = () => {
  const {
    meetings,
    isError,
    genreMap,
    sentinelRef,
    onClickMeeting,
    showInitSkeleton,
    showNextSkeleton,
  } = useBookmarkedMeetings();

  return (
    <div className="my-3 px-6">
      <div className="flex flex-col gap-1">
        <p className="text-subheading">
          <span className="text-primary">관심</span> 독서 모임
        </p>
        <p className="text-label !font-[400] text-gray-400">
          나의 관심 모임 목록에서 빠르게 모임에 가입해요!
        </p>
      </div>

      <div className="mt-8 flex min-h-0 flex-1 flex-col">
        {isError ? (
          <div className="py-10 text-center text-sm text-gray-400">
            관심 모임을 불러오지 못했어요.
          </div>
        ) : null}

        {!isError && !showInitSkeleton && meetings.length === 0 ? (
          <div className="py-14 text-center text-body-2 text-gray-400">
            아직 관심 모임이 없어요.
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          {showInitSkeleton
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={`init-${i}`} />)
            : null}

          {meetings.map((meeting, index) => (
            <MeetingCard
              key={meeting.meetingId}
              meeting={meeting}
              genreName={genreMap.get(meeting.readingGenreId)}
              onClick={() => onClickMeeting(index)}
            />
          ))}

          {showNextSkeleton
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={`next-${i}`} />)
            : null}
        </div>

        <div ref={sentinelRef} />
      </div>
    </div>
  );
};
