import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useUserProfileQuery } from "@/entities/user/model/useUserProfileQuery";
import getMeetingMembers from "../../api/get-meeting-members";
import getMeetingParticipants from "../../api/get-meeting-participants";
import kickMeetingMember from "../../api/kick-meeting-member";
import updateMeetingParticipation from "../../api/update-meeting-participation";
import KickMemberConfirmModal from "./KickMemberConfirmModal";
import formatKoreanMonthDayHour from "@/shared/lib/formatKoreanMonthDayHour";

type MemberManagementTabProps = {
  meetingId: number;
};

export default function MemberManagementTab({ meetingId }: MemberManagementTabProps) {
  const queryClient = useQueryClient();
  const { profile } = useUserProfileQuery();
  const [kickTarget, setKickTarget] = useState<{ memberId: number; nickname: string } | null>(null);
  const [participationTarget, setParticipationTarget] = useState<{
    meetingMemberId: number;
    nickname: string;
    status: "APPROVED" | "REJECTED";
  } | null>(null);
  const [memberActionError, setMemberActionError] = useState<string | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["meetingMembers", meetingId],
    queryFn: () => getMeetingMembers({ meetingId }),
  });
  const {
    data: participantData,
    isLoading: isParticipantsLoading,
    isError: isParticipantsError,
  } = useQuery({
    queryKey: ["meetingParticipants", meetingId],
    queryFn: () => getMeetingParticipants({ meetingId }),
  });

  const kickMutation = useMutation({
    mutationFn: ({ memberId }: { memberId: number }) => kickMeetingMember({ meetingId, memberId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["meetingMembers", meetingId] });
      await queryClient.invalidateQueries({ queryKey: ["myMeetingDetail", meetingId] });
    },
  });

  const updateParticipationMutation = useMutation({
    mutationFn: ({
      joinRequestId,
      status,
    }: {
      joinRequestId: number;
      status: "APPROVED" | "REJECTED";
    }) => updateMeetingParticipation({ meetingId, joinRequestId, status }),
  });

  const members = useMemo(() => data?.members ?? [], [data?.members]);
  const pendingItems = useMemo(() => participantData?.members ?? [], [participantData?.members]);

  const handleConfirmKick = async () => {
    if (!kickTarget) return;

    setMemberActionError(null);
    try {
      await kickMutation.mutateAsync({ memberId: kickTarget.memberId });
      setKickTarget(null);
    } catch (error) {
      setMemberActionError((error as { message?: string })?.message ?? "강퇴 처리에 실패했어요.");
    }
  };

  const handleParticipation = async (joinRequestId: number, status: "APPROVED" | "REJECTED") => {
    setMemberActionError(null);
    setProcessingRequestId(joinRequestId);

    try {
      await updateParticipationMutation.mutateAsync({ joinRequestId, status });
      await queryClient.invalidateQueries({ queryKey: ["meetingParticipants", meetingId] });
      await queryClient.invalidateQueries({ queryKey: ["meetingMembers", meetingId] });
      await queryClient.invalidateQueries({ queryKey: ["myMeetingDetail", meetingId] });
      return true;
    } catch (error) {
      setMemberActionError((error as { message?: string })?.message ?? "요청 처리에 실패했어요.");
      return false;
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleConfirmParticipation = async () => {
    if (!participationTarget) return;

    const success = await handleParticipation(
      participationTarget.meetingMemberId,
      participationTarget.status,
    );
    if (success) setParticipationTarget(null);
  };

  return (
    <section className="relative space-y-8 animate-fade-in-up">
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">현재 모임원</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <div className="grid grid-cols-[1.2fr_1fr_72px] gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
            <p className="pl-4 text-left">이름</p>
            <p className="text-center">가입일</p>
            <p className="text-center">관리</p>
          </div>
          {isLoading ? (
            <p className="px-4 py-6 text-sm text-gray-500">모임원 목록을 불러오는 중입니다...</p>
          ) : isError ? (
            <p className="px-4 py-6 text-sm text-red-500">모임원 목록을 불러오지 못했어요.</p>
          ) : members.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500">현재 모임원이 없습니다.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {members.map((member) => (
                <div
                  key={member.meetingMemberId}
                  className="grid grid-cols-[1.2fr_1fr_72px] items-center gap-2 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center justify-start gap-2 pl-4">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                      {member.profileImagePath ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.profileImagePath}
                          alt={member.nickname}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <p className="truncate text-left text-sm !font-[600] text-gray-900">
                      {member.nickname}
                    </p>
                  </div>
                  <p className="text-center text-sm text-gray-700">
                    {formatKoreanMonthDayHour(member.joinedAt)}
                  </p>
                  {profile?.nickname === member.nickname ? (
                    <div className="h-8 w-8 justify-self-center" />
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setKickTarget({
                          memberId: member.meetingMemberId,
                          nickname: member.nickname,
                        })
                      }
                      disabled={
                        kickMutation.isPending && kickTarget?.memberId === member.meetingMemberId
                      }
                      className="flex h-8 w-8 items-center justify-center justify-self-center text-gray-500 disabled:opacity-50"
                      aria-label={`${member.nickname} 강퇴`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">신청 현황</h2>
        <div className="space-y-3">
          {isParticipantsLoading ? (
            <div className="rounded-2xl border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              신청 현황을 불러오는 중입니다...
            </div>
          ) : isParticipantsError ? (
            <div className="rounded-2xl border border-gray-200 px-4 py-8 text-center text-sm text-red-500">
              신청 현황을 불러오지 못했어요.
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              대기 중인 신청이 없습니다.
            </div>
          ) : (
            pendingItems.map((item) => (
              <div
                key={item.meetingMemberId}
                className="rounded-2xl border border-gray-200 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                      {item.profileImagePath ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.profileImagePath}
                          alt={item.nickname}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.nickname}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setParticipationTarget({
                          meetingMemberId: item.meetingMemberId,
                          nickname: item.nickname,
                          status: "REJECTED",
                        })
                      }
                      disabled={processingRequestId === item.meetingMemberId}
                      className="h-8 rounded-full border border-gray-300 px-3 text-caption !font-[600] text-gray-700 disabled:opacity-50"
                    >
                      거절
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setParticipationTarget({
                          meetingMemberId: item.meetingMemberId,
                          nickname: item.nickname,
                          status: "APPROVED",
                        })
                      }
                      disabled={processingRequestId === item.meetingMemberId}
                      className="h-8 rounded-full border border-primary px-3 text-caption !font-[600] text-primary disabled:opacity-50"
                    >
                      승인
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700">{item.memberIntro}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {memberActionError ? <p className="text-sm text-red-500">{memberActionError}</p> : null}

      <KickMemberConfirmModal
        isOpen={Boolean(kickTarget)}
        nickname={kickTarget?.nickname ?? null}
        isLoading={kickMutation.isPending}
        description="강퇴된 모임원도 다시 신청할 수 있습니다."
        onClose={() => setKickTarget(null)}
        onConfirm={() => void handleConfirmKick()}
      />
      <KickMemberConfirmModal
        isOpen={Boolean(participationTarget)}
        nickname={participationTarget?.nickname ?? null}
        isLoading={updateParticipationMutation.isPending}
        title={
          participationTarget
            ? participationTarget.status === "REJECTED"
              ? `${participationTarget.nickname}님의 가입을 거절하시겠습니까?`
              : `${participationTarget.nickname}님의 가입을 승인하시겠습니까?`
            : undefined
        }
        onClose={() => {
          if (!updateParticipationMutation.isPending) setParticipationTarget(null);
        }}
        onConfirm={() => void handleConfirmParticipation()}
      />
    </section>
  );
}
