"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { Skeleton } from "@/entities/meeting/ui/MeetingCardSkeleton";
import { MeetingCard } from "@/entities/meeting/ui/MeetingCard";
import type { MeetingListResponse } from "../model/types";
import { useMeetings } from "../model/useMeetings";

export const MeetingList = ({
  initialData,
}: {
  initialData?: InfiniteData<MeetingListResponse, number | undefined>;
}) => {
  const {
    meetings,
    isError,
    genreMap,
    sentinelRef,
    onClickMeeting,
    onImpressionMeeting,
    showInitSkeleton,
    showNextSkeleton,
  } = useMeetings({ initialData });

  return (
    <div className="px-6 my-10">
      <div className="flex flex-col gap-1">
        <p className="text-subheading">전체 모임</p>
        <p className="text-label !font-[400] text-gray-400">취향에 맞는 모임을 탐색해보세요!</p>
      </div>
      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        {isError ? (
          <div className="py-10 text-center text-sm text-gray-400">모임을 불러오지 못했어요.</div>
        ) : null}
        <div className="grid grid-cols-2 gap-4">
          {showInitSkeleton
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={`init-${i}`} />)
            : null}
          {meetings.map((meeting, index) => (
            <MeetingCard
              key={meeting.meetingId}
              meeting={meeting}
              genreName={genreMap.get(meeting.readingGenreId)}
              onClick={() => onClickMeeting(index, meeting.meetingId)}
              onImpression={onImpressionMeeting}
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
