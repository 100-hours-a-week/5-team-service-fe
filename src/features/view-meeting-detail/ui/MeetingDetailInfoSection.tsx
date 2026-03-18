import { CalendarDaysIcon, ClockIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import formatKoreanDate from "@/lib/formatKoreanDate";
import { GetMeetingDetailResponse } from "../model/types";

type MeetingDetailInfoSectionProps = {
  sectionRef: (element: HTMLDivElement | null) => void;
  rounds: GetMeetingDetailResponse["rounds"];
  recruitmentDeadline: string;
  meetingWeekday: string;
  startTime: string;
};

export default function MeetingDetailInfoSection({
  sectionRef,
  rounds,
  recruitmentDeadline,
  meetingWeekday,
  startTime,
}: MeetingDetailInfoSectionProps) {
  const [hour = "00", minute = "00"] = startTime.split(":");
  const formattedStartTime = `${hour}시 ${minute}분`;

  return (
    <section
      ref={sectionRef}
      data-tab="info"
      className="scroll-mt-16 border-b-2 border-gray-100 px-5 py-10"
    >
      <h2 className="text-[18px] !font-[600] text-gray-900">모임 상세 안내</h2>

      <div className="mt-4 space-y-7">
        <article>
          <div className="flex items-center gap-3">
            <CalendarDaysIcon className="size-6 shrink-0 text-primary" aria-hidden="true" />
            <h3 className="text-body-emphasis">
              모임 일정: {meetingWeekday}요일 {formattedStartTime}
            </h3>
          </div>
          <div className="min-w-0 pl-9">
            <div className="mt-2 w-fit space-y-1.5 text-gray-900">
              {rounds.length > 0 ? (
                rounds.map((round) => (
                  <p
                    key={round.roundNo}
                    className="grid w-full grid-cols-[auto_1fr] gap-2 text-label text-gray-500 tabular-nums"
                  >
                    <span>{round.roundNo}회차:</span>
                    <span className="text-right">{formatKoreanDate(round.date)}</span>
                  </p>
                ))
              ) : (
                <p className="text-label text-gray-500">등록된 일정이 없습니다.</p>
              )}
            </div>
          </div>
        </article>

        <article>
          <div className="flex items-center gap-3">
            <ClockIcon className="size-6 shrink-0 text-primary" aria-hidden="true" />
            <h3 className="text-body-emphasis text-gray-900">
              모집 마감: {formatKoreanDate(recruitmentDeadline)}
            </h3>
          </div>
          <div className="min-w-0 pl-9">
            <p className="mt-1 text-label text-gray-500 !leading-7">
              모집 인원이 가득 차는 경우 조기 마감 될 수 있습니다.
            </p>
          </div>
        </article>

        <article>
          <div className="flex items-center gap-3">
            <PencilSquareIcon className="size-6 shrink-0 text-primary" aria-hidden="true" />
            <h3 className="text-body-emphasis text-gray-900">사전 과제: 독후감 최소 400자</h3>
          </div>
          <div className="min-w-0 pl-9">
            <p className="mt-1 text-label text-gray-500 !leading-7">
              더 풍부한 토론을 위해 모임 시작 전에 독후감을 제출받고 있어요. <br />
              작성해주신 독후감은 AI 검증을 통해 승인되거나 반려될 수 있습니다. <br />
              AI는 책과의 관련성, 내용의 충실성, 최소 작성 기준 충족 여부 등을 확인해요.
              <br />
              모두가 더 좋은 토론을 나누기 위한 과정이니, 반드시 참여 부탁드립니다!
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
