"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FullScreenSpinner from "@/shared/ui/FullScreenSpinner";
import { apiFetch } from "@/lib/api/apiFetch";
import getMyMeetingDetail from "../api/get-my-meeting-detail";
import getMeetingMembers from "../api/get-meeting-members";
import delegateMeetingLeader from "../api/delegate-meeting-leader";
import leaveMeeting from "../api/leave-meeting";
import pokeBookReport from "../api/poke-book-report";
import {
  BookReportSubmitStatus,
  JoinedMeetingMember,
  RoundBookReportListResponse,
} from "../api/types";
import MyMeetingCoverImage from "./meeting-participation-tab/MyMeetingCoverImge";
import MyMeetingTitle from "./meeting-participation-tab/MyMeetingTitle";
import RoundSelector from "./meeting-participation-tab/RoundSelector";
import MyMeetingRoundActions from "./meeting-participation-tab/MyMeetingRoundActions";
import MyMeetingReportManagement from "./book-report-tab/MyMeetingReportManagement";
import MyMeetingTabBar from "./meeting-participation-tab/MyMeetingTabBar";
import MemberManagementTab from "./member-tab/MemberManagementTab";
import KickMemberConfirmModal from "./member-tab/KickMemberConfirmModal";
import LeaveLeaderDelegateModal from "./meeting-participation-tab/LeaveLeaderDelegateModal";
import { GetMyMeetingDetailResponse } from "../api/get-my-meeting-detail/types";
import resolveBookReportAction from "../model/resolveBookReportAction";
import resolveReviewAction from "../model/resolveReviewAction";
import { saveMeetingIdForReviewRoute } from "@/shared/lib/storage/reviewRouteContext";

const LEAVE_ACTION_ERROR_MESSAGE = "요청 처리에 실패했어요. 잠시 후 다시 시도해 주세요.";
const POKE_ERROR_MESSAGE = "콕 찌르기 알림을 보내지 못했어요.";

export default function MyMeetingDetail({ meetingId }: { meetingId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeRoundNo, setActiveRoundNo] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"MEETING" | "REPORT" | "MEMBER">("MEETING");
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [delegateModalOpen, setDelegateModalOpen] = useState(false);
  const [delegateCandidates, setDelegateCandidates] = useState<JoinedMeetingMember[]>([]);
  const [leaveActionError, setLeaveActionError] = useState<string | null>(null);
  const [pokingMemberIds, setPokingMemberIds] = useState<number[]>([]);
  const [isPokingAll, setIsPokingAll] = useState(false);
  const [pokeErrorMessage, setPokeErrorMessage] = useState<string | null>(null);

  const {
    data: meeting,
    isLoading,
    isError,
  } = useQuery<GetMyMeetingDetailResponse>({
    queryKey: ["myMeetingDetail", meetingId],
    queryFn: () => getMyMeetingDetail({ meetingId }),
  });

  const rounds = useMemo(() => meeting?.rounds ?? [], [meeting?.rounds]);
  const defaultRoundNo = useMemo(() => {
    const upcoming = rounds.filter((round) => round.dday >= 0);
    if (upcoming.length) {
      upcoming.sort((a, b) => a.dday - b.dday);
      return upcoming[0].roundNo;
    }
    return meeting?.currentRoundNo ?? rounds[0]?.roundNo ?? 1;
  }, [meeting?.currentRoundNo, rounds]);

  const resolvedRoundNo = activeRoundNo ?? defaultRoundNo;
  const activeRound = useMemo(
    () => rounds.find((round) => round.roundNo === resolvedRoundNo) ?? rounds[0],
    [resolvedRoundNo, rounds],
  );
  const isLeader = meeting?.myRole === "LEADER";
  const resolvedTab = isLeader ? activeTab : "MEETING";
  const submitStatuByRound = useMemo<BookReportSubmitStatus>(() => {
    if (!activeRound || !meeting) return "NOT_YET";

    const currentRoundNo = meeting.currentRoundNo ?? defaultRoundNo;
    if (activeRound.roundNo === currentRoundNo) return "IN_PROGRESS";
    if (activeRound.roundNo > currentRoundNo) return "NOT_YET";
    return "DEADLINE_PASSED";
  }, [activeRound, meeting, defaultRoundNo]);

  const {
    data: reportSummary,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useQuery<RoundBookReportListResponse>({
    queryKey: ["roundBookReports", activeRound?.roundId],
    queryFn: () =>
      apiFetch<RoundBookReportListResponse>(
        `/meeting-rounds/${activeRound?.roundId}/book-reports`,
        {},
      ),
    enabled: Boolean(isLeader && resolvedTab === "REPORT" && activeRound?.roundId),
  });

  const leaveMeetingMutation = useMutation({
    mutationFn: () => leaveMeeting({ meetingId }),
    onSuccess: () => {
      router.replace("/my-meeting");
    },
  });

  const delegateLeaderMutation = useMutation({
    mutationFn: ({ memberId }: { memberId: number }) =>
      delegateMeetingLeader({ meetingId, newLeaderMeetingMemberId: memberId }),
  });

  if (isLoading) {
    return <FullScreenSpinner transparent />;
  }

  if (!meeting || isError || !activeRound) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-6 text-sm text-gray-500">
        모임 조회에 실패했습니다.
      </div>
    );
  }

  const isReportTab = resolvedTab === "REPORT";
  const isMemberTab = resolvedTab === "MEMBER";

  const handleClickLeaveMeeting = async () => {
    setLeaveActionError(null);

    if (!isLeader) {
      setLeaveConfirmOpen(true);
      return;
    }

    try {
      const membersResponse = await getMeetingMembers({ meetingId });
      const otherMembers = (membersResponse.members ?? []).filter(
        (member) => member.nickname !== meeting.leaderInfo.nickname,
      );

      if (otherMembers.length === 0) {
        setLeaveConfirmOpen(true);
        return;
      }

      setDelegateCandidates(otherMembers);
      setDelegateModalOpen(true);
    } catch {
      setLeaveActionError(LEAVE_ACTION_ERROR_MESSAGE);
    }
  };

  const handleDelegateLeader = async (memberId: number) => {
    setLeaveActionError(null);
    try {
      await delegateLeaderMutation.mutateAsync({ memberId });
      setDelegateModalOpen(false);
      setLeaveConfirmOpen(true);
    } catch {
      setLeaveActionError(LEAVE_ACTION_ERROR_MESSAGE);
    }
  };

  const handleConfirmLeaveMeeting = async () => {
    setLeaveActionError(null);
    try {
      await leaveMeetingMutation.mutateAsync();
    } catch {
      setLeaveActionError(LEAVE_ACTION_ERROR_MESSAGE);
    }
  };

  const resolvePokeErrorMessage = (error: unknown, fallback: string) =>
    (error as { message?: string })?.message ?? fallback;

  const handlePokeBookReport = async (meetingMemberId: number) => {
    setPokeErrorMessage(null);
    setPokingMemberIds((prev) =>
      prev.includes(meetingMemberId) ? prev : [...prev, meetingMemberId],
    );

    try {
      await pokeBookReport({ roundId: activeRound.roundId, meetingMemberId });
      await queryClient.invalidateQueries({ queryKey: ["roundBookReports", activeRound.roundId] });
    } catch (error) {
      setPokeErrorMessage(resolvePokeErrorMessage(error, POKE_ERROR_MESSAGE));
    } finally {
      setPokingMemberIds((prev) => prev.filter((id) => id !== meetingMemberId));
    }
  };

  const handlePokeAllBookReports = async (meetingMemberIds: number[]) => {
    if (meetingMemberIds.length === 0) return;

    setPokeErrorMessage(null);
    setIsPokingAll(true);
    setPokingMemberIds((prev) => Array.from(new Set([...prev, ...meetingMemberIds])));

    try {
      const results = await Promise.allSettled(
        meetingMemberIds.map((meetingMemberId) =>
          pokeBookReport({ roundId: activeRound.roundId, meetingMemberId }),
        ),
      );
      const rejectedCount = results.filter((result) => result.status === "rejected").length;

      if (rejectedCount > 0) {
        const rejectedResult = results.find(
          (result): result is PromiseRejectedResult => result.status === "rejected",
        );
        setPokeErrorMessage(
          rejectedCount === meetingMemberIds.length
            ? resolvePokeErrorMessage(rejectedResult?.reason, POKE_ERROR_MESSAGE)
            : `${rejectedCount}명에게 콕 찌르기 알림을 보내지 못했어요.`,
        );
      }

      if (rejectedCount < meetingMemberIds.length) {
        await queryClient.invalidateQueries({
          queryKey: ["roundBookReports", activeRound.roundId],
        });
      }
    } finally {
      setPokingMemberIds((prev) => prev.filter((id) => !meetingMemberIds.includes(id)));
      setIsPokingAll(false);
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto">
        {isLeader ? <MyMeetingTabBar activeTab={activeTab} convertTab={setActiveTab} /> : null}

        <div className="space-y-6 px-6 pb-6 pt-2">
          {!isReportTab && !isMemberTab ? (
            <MyMeetingTitle
              title={meeting.title}
              readingGenreName={meeting.readingGenreName}
              leaderNickname={meeting.leaderInfo.nickname}
              leaderProfileImagePath={meeting.leaderInfo.profileImagePath}
              isLeader={isLeader}
              meetingDate={activeRound.meetingDate}
              isLeaving={leaveMeetingMutation.isPending}
              onEditMeeting={() => router.push(`/my-meeting/${meeting.meetingId}/edit`)}
              onLeaveMeeting={() => void handleClickLeaveMeeting()}
            />
          ) : null}

          {!isReportTab && !isMemberTab && leaveActionError ? (
            <p className="text-sm text-red-500">{leaveActionError}</p>
          ) : null}

          {!isReportTab && !isMemberTab ? (
            <div className="-mx-6">
              <MyMeetingCoverImage
                meetingImageUrl={meeting.meetingImagePath}
                alt={`${meeting.title} 대표 이미지`}
              />
            </div>
          ) : null}

          {!isMemberTab ? (
            <RoundSelector
              roundNo={activeRound.roundNo}
              meetingDate={activeRound.meetingDate}
              canPrev={resolvedRoundNo > 1}
              canNext={resolvedRoundNo < meeting.roundCount}
              onPrev={() =>
                setActiveRoundNo((prev) => Math.max(1, (prev ?? meeting.currentRoundNo) - 1))
              }
              onNext={() =>
                setActiveRoundNo((prev) =>
                  Math.min(meeting.roundCount, (prev ?? meeting.currentRoundNo) + 1),
                )
              }
            />
          ) : null}

          {resolvedTab === "MEETING" ? (
            <MyMeetingRoundActions
              meetingId={meeting.meetingId}
              round={activeRound}
              isLeader={isLeader}
              onJoinMeeting={(meetingLink) => window.open(meetingLink, "_blank")}
              onOpenBookReport={() => {
                const bookReportAction = resolveBookReportAction(activeRound);
                const bookReportId = activeRound.bookReport.id ?? null;

                if (bookReportAction.action === "VIEW" && bookReportId) {
                  router.push(
                    `/meeting-rounds/${activeRound.roundId}/book-reports/${bookReportId}`,
                  );
                  return;
                }

                if (bookReportAction.action !== "WRITE") {
                  return;
                }

                router.push(`/meeting-rounds/${activeRound.roundId}/book-report`);
              }}
              onOpenReview={() => {
                const reviewId = activeRound.review?.id ?? null;
                const reviewAction = resolveReviewAction(activeRound);

                if (reviewAction.action === "VIEW" && reviewId) {
                  router.push(`/my/reviews/${reviewId}`);
                  return;
                }

                if (reviewAction.action !== "WRITE") {
                  return;
                }

                saveMeetingIdForReviewRoute({
                  roundId: activeRound.roundId,
                  meetingId: meeting.meetingId,
                });
                router.push(`/meeting-rounds/${activeRound.roundId}/review`);
              }}
            />
          ) : resolvedTab === "REPORT" ? (
            <div key={`${activeRound.roundNo}-reports`} className="animate-fade-in-up">
              <MyMeetingReportManagement
                reportSummary={reportSummary ?? null}
                isLoading={isReportLoading}
                isError={isReportError}
                submitStatus={submitStatuByRound}
                roundId={activeRound.roundId}
                pokingMemberIds={pokingMemberIds}
                isPokingAll={isPokingAll}
                pokeErrorMessage={pokeErrorMessage}
                onOpenDetail={(reportId, roundId) =>
                  router.push(`/meeting-rounds/${roundId}/book-reports/${reportId}`)
                }
                onPoke={(meetingMemberId) => handlePokeBookReport(meetingMemberId)}
                onPokeAll={(meetingMemberIds) => handlePokeAllBookReports(meetingMemberIds)}
                onClearPokeError={() => setPokeErrorMessage(null)}
              />
            </div>
          ) : (
            <MemberManagementTab meetingId={meeting.meetingId} />
          )}
        </div>
      </div>

      <LeaveLeaderDelegateModal
        isOpen={delegateModalOpen}
        members={delegateCandidates}
        isDelegating={delegateLeaderMutation.isPending}
        onClose={() => {
          if (!delegateLeaderMutation.isPending) setDelegateModalOpen(false);
        }}
        onDelegate={(memberId) => void handleDelegateLeader(memberId)}
      />

      <KickMemberConfirmModal
        isOpen={leaveConfirmOpen}
        nickname={null}
        isLoading={leaveMeetingMutation.isPending}
        title="모임에서 탈퇴하시겠습니까?"
        description="탈퇴 후 다시 참여하려면 재신청이 필요합니다."
        onClose={() => {
          if (!leaveMeetingMutation.isPending) setLeaveConfirmOpen(false);
        }}
        onConfirm={() => void handleConfirmLeaveMeeting()}
      />
    </div>
  );
}
