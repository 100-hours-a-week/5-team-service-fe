import Image from "next/image";
import { HandThumbUpIcon, StarIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

type MeetingIntroSectionProps = {
  introRef: (element: HTMLDivElement | null) => void;
  leaderRef: (element: HTMLDivElement | null) => void;
  description: string;
  leaderNickname: string;
  leaderIntro: string;
  leaderRating: number;
  leaderMeetingCount: number;
  leaderProfileImagePath: string;
  reviewSection?: ReactNode;
};

export default function MeetingIntroSection({
  introRef,
  leaderRef,
  description,
  leaderNickname,
  leaderIntro,
  leaderRating,
  leaderMeetingCount,
  leaderProfileImagePath,
  reviewSection,
}: MeetingIntroSectionProps) {
  return (
    <section className="space-y-10 px-0 py-5">
      <div
        ref={introRef}
        data-tab="intro"
        className="space-y-3 scroll-mt-16 border-b-2 border-gray-100 px-5 pb-7"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] !font-[600] text-gray-900">우리는 이런 모임이에요!</h2>
        </div>
        <p className="whitespace-pre-line text-label leading-relaxed text-gray-700">
          {description}
        </p>
      </div>

      <div
        ref={leaderRef}
        data-tab="leader"
        className="scroll-mt-16 border-b-2 border-gray-100 px-5 pb-10"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] !font-[600] text-gray-900">모임장을 소개합니다! </h2>
        </div>
        <div className="mt-5 flex h-20 items-center gap-5">
          <div className="relative h-full w-20 shrink-0 overflow-hidden rounded-full bg-gray-200">
            {leaderProfileImagePath ? (
              <Image
                src={leaderProfileImagePath}
                alt={`${leaderNickname} 프로필`}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
            <h2 className="text-label text-gray-900">
              <span className="text-body-emphasis text-primary">{leaderNickname}</span> 님
            </h2>
            <div className="space-y-1 text-gray-900">
              <p className="flex items-center gap-2 text-label !font-[500]">
                <HandThumbUpIcon className="h-5 w-5 text-gray-700" />
                모임장 경력 {leaderMeetingCount}회
              </p>
              <p className="flex items-center gap-2 text-label !font-[500]">
                <StarIcon className="h-5 w-5 text-gray-700" />
                별점 평균 {leaderRating}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-7 whitespace-pre-line text-label leading-relaxed text-gray-800">
          {leaderIntro}
        </p>

        {reviewSection}
      </div>
    </section>
  );
}
