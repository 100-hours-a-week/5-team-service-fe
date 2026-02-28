import { BookOpenIcon, ClockIcon } from "@heroicons/react/24/solid";

type MyMeetingTitleProps = {
  title: string;
  readingGenreName: string;
  leaderNickname: string;
  leaderProfileImagePath: string;
  isLeader: boolean;
  meetingDate: string;
  isLeaving?: boolean;
  onLeaveMeeting?: () => void;
};

export default function MyMeetingTitle({
  title,
  readingGenreName,
  leaderNickname,
  leaderProfileImagePath,
  isLeader,
  meetingDate,
  isLeaving = false,
  onLeaveMeeting,
}: MyMeetingTitleProps) {
  const date = new Date(meetingDate);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

  return (
    <section className="space-y-4">
      <div className={`flex gap-2 ${!isLeader ? "mt-3" : ""}`}>
        <span className="text-label !font-[600] px-3 py-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[var(--color-primary-purple-3)] text-gray-900">
          <BookOpenIcon className="h-4 w-4 text-primary-purple" />
          {readingGenreName}
        </span>
        <span className="text-label !font-[600] px-3 py-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[var(--color-primary-purple-3)] text-gray-900">
          <ClockIcon className="h-4 w-4 text-primary-purple" />
          {weekday}요일
        </span>
      </div>
      <h1 className="text-subheading text-gray-900">{title}</h1>
      <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
            <img
              src={leaderProfileImagePath}
              alt="모임장 프로필 사진"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col">
            <span>모임장</span>
            <span className="font-label !font-[700] text-primary">{leaderNickname}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onLeaveMeeting}
          disabled={isLeaving}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-caption !font-[600] text-gray-700 disabled:opacity-50"
        >
          {isLeaving ? "처리 중..." : "모임 탈퇴"}
        </button>
      </div>
    </section>
  );
}
