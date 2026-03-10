"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MeetingItem } from "@/entities/meeting/model/types";
import { BookOpenIcon, ClockIcon } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkOutlineIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import useToggleMeetingBookmark from "@/features/bookmarks-meeting/model/useToggleMeetingBookmark";

const MeetingCardImage = memo(function MeetingCardImage({
  meetingImagePath,
  title,
}: {
  meetingImagePath: string;
  title: string;
}) {
  return (
    <div className="relative h-32 w-full overflow-hidden rounded-t-3xl bg-gray-200">
      {meetingImagePath ? (
        <Image
          src={meetingImagePath}
          fill
          sizes="(max-width: 500px) calc((100vw - 4rem) / 2), 218px"
          alt={`${title} 모임 이미지`}
          className="object-cover"
        />
      ) : null}
    </div>
  );
});

type MeetingCardProps = {
  meeting: MeetingItem;
  genreName?: string;
  onClick?: () => void;
};

function MeetingCardBase({ meeting, genreName, onClick }: MeetingCardProps) {
  const {
    meetingId,
    meetingImagePath,
    isBookmarked = false,
    title,
    leaderNickname,
    capacity,
    currentMemberCount,
    remainingDays,
  } = meeting;

  const { isPending: isBookmarkPending, toggle: toggleBookmark } = useToggleMeetingBookmark({
    meetingId,
    isBookmarked,
  });

  return (
    <Link
      href={`/meeting/detail/${meetingId}`}
      className="flex flex-col h-[330px] rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
      aria-label={`${title} 모임 상세 보기`}
      onClickCapture={onClick}
    >
      <div className="relative">
        <MeetingCardImage meetingImagePath={meetingImagePath} title={title} />
        <button
          type="button"
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleBookmark();
          }}
          disabled={isBookmarkPending}
          className="absolute right-2 top-2 z-20 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isBookmarked ? (
            <BookmarkSolidIcon className="h-6 w-6 fill-primary stroke-white [stroke-width:1.8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]" />
          ) : (
            <BookmarkOutlineIcon className="h-6 w-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]" />
          )}
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col px-4 pb-6">
        <div>
          <p className="text-body-1 !font-[600] text-gray-900 line-clamp-2 overflow-hidden break-words">
            {title}
          </p>
          <div className="mt-2 flex flex-nowrap items-center gap-2 text-[11px] !font-[600] sm:text-caption">
            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[var(--color-primary-purple-3)] px-2.5 py-1 text-gray-900 sm:px-3">
              <BookOpenIcon className="h-4 w-4 text-[var(--color-primary-purple)]" />
              {genreName ?? "기타"}
            </span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[var(--color-primary-purple-3)] px-2.5 py-1 text-gray-900 sm:px-3">
              <ClockIcon className="h-4 w-4 text-[var(--color-primary-purple)]" />
              {remainingDays < 0 ? `D+${-remainingDays}` : `D-${remainingDays}`}
            </span>
          </div>
        </div>

        <div className="mt-auto space-y-1 text-body-2 text-gray-600">
          <p>
            모임장 <span className="!font-[600] !text-gray-900">{leaderNickname}</span>
          </p>
          <div className="flex items-center gap-2">
            <p className="min-w-0">
              모집현황{" "}
              <span className="!font-[600] !text-gray-900">
                {currentMemberCount}/{capacity}명
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const MeetingCard = memo(
  MeetingCardBase,
  (prev, next) => prev.meeting === next.meeting && prev.genreName === next.genreName,
);
