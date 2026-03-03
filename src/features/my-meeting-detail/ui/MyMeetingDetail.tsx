"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import FullScreenSpinner from "@/shared/ui/FullScreenSpinner";
import { apiFetch } from "@/lib/api/apiFetch";
import getMyMeetingDetail from "../api/get-my-meeting-detail";
import getMeetingMembers from "../api/get-meeting-members";
import delegateMeetingLeader from "../api/delegate-meeting-leader";
import leaveMeeting from "../api/leave-meeting";
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

const LEAVE_ACTION_ERROR_MESSAGE = "요청 처리에 실패했어요. 잠시 후 다시 시도해 주세요.";

export default function MyMeetingDetail({ meetingId }: { meetingId: number }) {
  const router = useRouter();
  const [activeRoundNo, setActiveRoundNo] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"MEETING" | "REPORT" | "MEMBER">("MEETING");
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [delegateModalOpen, setDelegateModalOpen] = useState(false);
  const [delegateCandidates, setDelegateCandidates] = useState<JoinedMeetingMember[]>([]);
  const [leaveActionError, setLeaveActionError] = useState<string | null>(null);

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
              onOpenBookReport={() =>
                router.push(`/meeting-rounds/${activeRound.roundId}/book-report`)
              }
            />
          ) : resolvedTab === "REPORT" ? (
            <div key={`${activeRound.roundNo}-reports`} className="animate-fade-in-up">
              <MyMeetingReportManagement
                reportSummary={reportSummary ?? null}
                isLoading={isReportLoading}
                isError={isReportError}
                submitStatus={submitStatuByRound}
                roundId={activeRound.roundId}
                onOpenDetail={(reportId, roundId) =>
                  router.push(`/meeting-rounds/${roundId}/book-reports/${reportId}`)
                }
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
