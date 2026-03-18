import { useEffect, useRef, useState } from "react";
import { PartyPopper } from "lucide-react";
import type { RoundBookReportListResponse } from "../../api/types";
import { formatKoreanMonthDayHourMinute } from "@/shared/lib/formatKoreanMonthDayHourMinute";
import { memberReportStatusClass, memberReportStatusLabel, ReportStatus } from "../../model/types";
import BookReportPokeModal from "./BookReportPokeModal";
import usePokeMember from "../../model/usePokeMember";

type MyMeetingReportManagementProps = {
  reportSummary: RoundBookReportListResponse | null;
  isLoading: boolean;
  isError: boolean;
  submitStatus: "IN_PROGRESS" | "NOT_YET" | "DEADLINE_PASSED";
  onOpenDetail: (reportId: number, roundId: number) => void;
  roundId: number;
};

export default function MyMeetingReportManagement({
  reportSummary,
  isLoading,
  isError,
  submitStatus,
  onOpenDetail,
  roundId,
}: MyMeetingReportManagementProps) {
  const [isPokeModalOpen, setIsPokeModalOpen] = useState(false);
  const [isPokeModalClosing, setIsPokeModalClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const {
    pokeMember,
    pokeAllMembers,
    pokingMemberIds,
    isPokingAll,
    pokeErrorMessage,
    clearPokeError,
  } = usePokeMember(roundId);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-500">
        제출 현황을 불러오는 중입니다.
      </div>
    );
  }

  if (isError || !reportSummary) {
    return (
      <div className="rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-500">
        제출 현황을 불러오지 못했어요.
      </div>
    );
  }

  const submittedCount = reportSummary.submittedCount ?? 0;
  const totalCount = reportSummary.totalCount ?? 0;
  const notSubmittedCount = Math.max(0, totalCount - submittedCount);
  const segmentsCount = Math.max(1, Math.min(totalCount || 1, 12));
  const submittedRatio = totalCount > 0 ? submittedCount / totalCount : 0;
  const submittedPercent = totalCount > 0 ? Math.round(submittedRatio * 100) : 0;
  const filledSegments = Math.round(segmentsCount * submittedRatio);
  const pokeableMembers = reportSummary.members
    .filter(
      (member) =>
        ((member.bookReport?.status ?? "NOT_SUBMITTED") as ReportStatus) === "NOT_SUBMITTED",
    )
    .map((member) => ({
      meetingMemberId: member.meetingMemberId,
      nickname: member.nickname,
    }));

  const handleOpenPokeModal = () => {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    clearPokeError();
    setIsPokeModalClosing(false);
    setIsPokeModalOpen(true);
  };

  const handleClosePokeModal = () => {
    clearPokeError();
    setIsPokeModalClosing(true);
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setIsPokeModalOpen(false);
      setIsPokeModalClosing(false);
      closeTimerRef.current = null;
    }, 200);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-3xl border border-gray-200 bg-gray-purple px-5 py-5">
        <div className="mb-10 flex gap-2">
          <h3 className="text-subheading text-gray-900">
            현재까지 <span className="text-primary !font-[700]">{submittedCount}</span>명이
            제출했어요!
          </h3>
        </div>

        {submitStatus === "IN_PROGRESS" ? (
          <p className="flex items-center gap-1 text-label text-primary">
            제출률 {submittedPercent}% 달성
            {submittedPercent === 100 ? <PartyPopper className="h-4 w-4" /> : null}
          </p>
        ) : submitStatus === "NOT_YET" ? (
          <p className="text-label text-gray-600">아직 제출 기한이 아니에요.</p>
        ) : (
          <p className="text-label text-gray-600">독후감 제출 기한이 지났어요.</p>
        )}

        <div className="flex h-3 items-center gap-1 overflow-hidden">
          {Array.from({ length: segmentsCount }).map((_, idx) => {
            const filled = idx < filledSegments;
            return (
              <span
                key={`report-segment-${idx}`}
                className={`h-full flex-1 -skew-x-[24deg] ${
                  filled ? "bg-primary" : "bg-indigo-100"
                }`}
              />
            );
          })}
        </div>

        <div className="flex w-full text-body-1 text-gray-800">
          <div className="flex flex-col justify-start">
            <span>제출 인원</span>
            <span className="font-semibold">
              <span className="text-subheading">{submittedCount}</span>명
            </span>
          </div>
          <div className="ml-auto flex flex-col justify-end text-right">
            <span>미제출 인원</span>
            <div className="mt-1 flex items-center justify-end gap-3">
              <span className="font-semibold">
                <span className="text-subheading">{notSubmittedCount}</span>명
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center">
          <h3 className="text-base font-semibold text-gray-900">독후감 제출 현황</h3>
          <button
            type="button"
            onClick={handleOpenPokeModal}
            disabled={pokeableMembers.length === 0}
            className="ml-auto border-b border-primary px-0.5 py-0.5 text-caption !font-[500] text-primary transition disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          >
            미제출 인원 콕 찌르기
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <div className="grid grid-cols-[1fr_1fr_1.4fr_0.7fr] gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-body-2 text-gray-900">
            <p className="text-center">이름</p>
            <p className="text-center">상태</p>
            <p className="text-center">제출 시간</p>
            <p className="text-center">제출률</p>
          </div>

          <div className="divide-y divide-gray-100 bg-white">
            {reportSummary.members.map((member) => {
              const status = (member.bookReport?.status ?? "NOT_SUBMITTED") as ReportStatus;
              const reportId = member.bookReport?.id ?? member.bookReport?.bookReportId ?? null;
              const canOpen =
                reportId != null &&
                status !== "NOT_SUBMITTED" &&
                status !== "NOT_YET_WRITABLE" &&
                status !== "DEADLINE_PASSED";

              return (
                <div
                  key={member.meetingMemberId}
                  onClick={() => {
                    if (!canOpen || reportId == null) return;
                    onOpenDetail(reportId, roundId);
                  }}
                  onKeyDown={(event) => {
                    if (!canOpen || reportId == null) return;
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    onOpenDetail(reportId, roundId);
                  }}
                  role={canOpen ? "button" : undefined}
                  tabIndex={canOpen ? 0 : undefined}
                  className={`grid w-full grid-cols-[1fr_1fr_1.4fr_0.7fr] items-center gap-2 px-4 py-4 text-center text-label ${
                    canOpen
                      ? "cursor-pointer transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      : "cursor-default"
                  }`}
                >
                  <p className="truncate !font-[600] text-gray-900">{member.nickname}</p>
                  <p className="flex justify-center">
                    <span
                      className={`inline-flex rounded-full px-4 py-1 text-caption ${memberReportStatusClass[status]}`}
                    >
                      {memberReportStatusLabel[status]}
                    </span>
                  </p>
                  <p className="truncate text-gray-700">
                    {formatKoreanMonthDayHourMinute(member.bookReport?.submittedAt ?? null)}
                  </p>
                  <p className="font-medium text-gray-900">{member.submissionRate}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BookReportPokeModal
        isOpen={isPokeModalOpen}
        isClosing={isPokeModalClosing}
        members={pokeableMembers}
        pokingMemberIds={pokingMemberIds}
        isPokingAll={isPokingAll}
        errorMessage={pokeErrorMessage}
        onClose={handleClosePokeModal}
        onPoke={pokeMember}
        onPokeAll={pokeAllMembers}
      />
    </div>
  );
}
