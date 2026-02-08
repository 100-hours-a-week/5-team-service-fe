"use client";

import Image from "next/image";
import Link from "next/link";
import { MeetingItem } from "@/entities/meeting/model/types";
import { BookOpenIcon, ClockIcon } from "@heroicons/react/24/solid";

export const MeetingCard = ({
  meeting,
  genreName,
  onClick,
}: {
  meeting: MeetingItem;
  genreName?: string;
  onClick?: () => void;
}) => {
  const {
    meetingId,
    meetingImagePath,
    title,
    leaderNickname,
    capacity,
    currentMemberCount,
    remainingDays,
  } = meeting;

  return (
    <Link
      href={`/meeting/detail/${meetingId}`}
      className="flex flex-col h-[330px] rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
      aria-label={`${title} 모임 상세 보기`}
      onClickCapture={onClick}
    >
      <div className="relative h-32 w-full overflow-hidden rounded-t-3xl bg-gray-200">
        <Image
          src={meetingImagePath}
          fill
          sizes="100vw"
          alt="모임 이미지"
          className="object-cover"
        />
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
};
