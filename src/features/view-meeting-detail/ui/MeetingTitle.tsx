import Image from "next/image";
import { BookOpenIcon, ClockIcon } from "@heroicons/react/24/solid";
import MeetingShareButton from "./MeetingShareButton";

type MeetingTitleProps = {
  title: string;
  readingGenreName: string;
  meetingDate: string;
  leaderNickname: string;
  leaderProfileImagePath: string;
  onShare: () => void;
};

export default function MeetingTitle({
  title,
  readingGenreName,
  meetingDate,
  leaderNickname,
  leaderProfileImagePath,
  onShare,
}: MeetingTitleProps) {
  const date = new Date(meetingDate);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

  return (
    <section className="space-y-4 border-b border-gray-100 px-6 py-7">
      <div className="flex gap-2">
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[var(--color-primary-purple-3)] px-3 py-1 text-label !font-[600] text-gray-900">
          <BookOpenIcon className="h-4 w-4 text-primary-purple" />
          {readingGenreName}
        </span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[var(--color-primary-purple-3)] px-3 py-1 text-label !font-[600] text-gray-900">
          <ClockIcon className="h-4 w-4 text-primary-purple" />
          {weekday}요일
        </span>
      </div>

      <h1 className="text-subheading text-gray-900">{title}</h1>

      <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
            {leaderProfileImagePath ? (
              <Image
                src={leaderProfileImagePath}
                alt="모임장 프로필 사진"
                fill
                sizes="40px"
                className="object-cover object-center"
              />
            ) : null}
          </div>
          <div className="flex flex-col">
            <span>모임장</span>
            <span className="font-label !font-[700] text-primary">{leaderNickname}</span>
          </div>
        </div>

        <MeetingShareButton onClick={onShare} />
      </div>
    </section>
  );
}
