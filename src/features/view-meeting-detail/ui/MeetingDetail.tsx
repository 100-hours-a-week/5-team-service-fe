"use client";

import { useParams, useRouter } from "next/navigation";
import Modal from "@/shared/ui/Modal";
import useToggleMeetingBookmark from "@/features/bookmarks-meeting/model/useToggleMeetingBookmark";
import { getMeetingJoinAction } from "../model/actionConfig";
import { MEETING_DETAIL_MODAL_CONFIG } from "../model/modalConfig";
import type { GetMeetingDetailResponse } from "../model/types";
import useMeetingDetailData from "../model/useMeetingDetailData";
import useMeetingJoin from "../model/useMeetingJoin";
import useMeetingDetailTabs from "../model/useMeetingDetailTabs";
import type { MeetingReviewListResponse } from "@/features/view-meeting-review-list/model/types";
import MeetingReviewsPreviewSection from "@/features/view-meeting-review-list/ui/MeetingReviewsPreviewSection";
import MeetingBooksByRoundSection from "./MeetingBooksByRoundSection";
import MeetingDetailActionBar from "./MeetingDetailActionBar";
import MeetingCoverImage from "./MeetingCoverImage";
import MeetingDetailInfoSection from "./MeetingDetailInfoSection";
import MeetingDetailTabBar from "./MeetingDetailTabBar";
import MeetingIntroSection from "./MeetingIntroSection";
import MeetingMemberStatusSection from "./MeetingMemberStatusSection";
import MeetingTitle from "./MeetingTitle";
import FullScreenSpinner from "@/shared/ui/FullScreenSpinner";
import { PolicyOption } from "@/entities/policy/model/types";

type MeetingDetailProps = {
  meetingId?: number;
  initialData?: GetMeetingDetailResponse;
  initialGenres?: PolicyOption[];
  initialReviewPreview?: MeetingReviewListResponse | null;
};

export default function MeetingDetail({
  meetingId: meetingIdFromProps,
  initialData,
  initialGenres,
  initialReviewPreview,
}: MeetingDetailProps = {}) {
  const params = useParams<{ meetingId?: string }>();
  const meetingId = meetingIdFromProps ?? (params?.meetingId ? Number(params.meetingId) : null);
  const router = useRouter();

  const {
    data,
    isBookmarked,
    participationStatus,
    participantTotalCount,
    participantProfileImages,
    isLoading,
    isError,
    readingGenreName,
  } = useMeetingDetailData({ meetingId, initialData, initialGenres });

  const action = getMeetingJoinAction({
    meetingStatus: data?.meeting.status,
    participationStatus,
  });

  const { isJoining, modalType, isClosing, closeModal, handleJoin } = useMeetingJoin({
    meetingId,
    joinDisabled: action.disabled,
  });

  const { activeTab, scrollContainerRef, assignSectionRef, handleClickTab } = useMeetingDetailTabs({
    enabled: Boolean(data?.meeting.meetingId),
  });

  const { isPending: isBookmarkPending, toggle: toggleBookmark } = useToggleMeetingBookmark({
    meetingId: data?.meeting.meetingId ?? meetingId ?? 0,
    isBookmarked,
  });

  if (isLoading && !data) {
    return <FullScreenSpinner transparent />;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-gray-500">
        모임 정보를 불러오지 못했어요.
      </div>
    );
  }

  const { meeting, rounds } = data;

  const handleShare = async () => {
    const url =
      typeof window === "undefined" ? "" : `${window.location.origin}/meeting/detail/${meetingId}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: meeting.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("링크 공유에 실패했습니다.", error);
    }
  };

  const representativeMeetingDate = rounds[0]?.date ?? meeting.recruitmentDeadline;
  const meetingWeekday = ["일", "월", "화", "수", "목", "금", "토"][
    new Date(representativeMeetingDate).getDay()
  ];
  const modalConfig = modalType ? MEETING_DETAIL_MODAL_CONFIG[modalType] : null;

  const handleConfirmModal = () => {
    if (!modalConfig) return;
    if (modalConfig.action === "goLogin") {
      closeModal();
      router.push("/oauth");
      return;
    }
    closeModal();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div ref={scrollContainerRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <MeetingTitle
          title={meeting.title}
          readingGenreName={readingGenreName}
          meetingDate={representativeMeetingDate}
          leaderNickname={meeting.leader.nickname}
          leaderProfileImagePath={meeting.leader.profileImagePath}
          onShare={() => void handleShare()}
        />
        <MeetingCoverImage title={meeting.title} imagePath={meeting.meetingImagePath} />
        <MeetingDetailTabBar activeTab={activeTab} onClickTab={handleClickTab} />
        <MeetingIntroSection
          introRef={assignSectionRef("intro")}
          leaderRef={assignSectionRef("leader")}
          description={meeting.description}
          leaderNickname={meeting.leader.nickname}
          leaderIntro={meeting.leader.intro}
          leaderProfileImagePath={meeting.leader.profileImagePath}
          reviewSection={
            initialReviewPreview ? (
              <MeetingReviewsPreviewSection
                meetingId={meeting.meetingId}
                reviewResponse={initialReviewPreview}
              />
            ) : null
          }
        />
        <MeetingBooksByRoundSection sectionRef={assignSectionRef("books")} rounds={rounds} />
        <MeetingDetailInfoSection
          sectionRef={assignSectionRef("info")}
          rounds={rounds}
          recruitmentDeadline={meeting.recruitmentDeadline}
          meetingWeekday={meetingWeekday}
          startTime={meeting.time.startTime}
        />
        <MeetingMemberStatusSection
          sectionRef={assignSectionRef("members")}
          currentCount={participantTotalCount ?? meeting.currentCount}
          capacity={meeting.capacity}
          profileImages={participantProfileImages}
        />
      </div>

      <MeetingDetailActionBar
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
        isBookmarkPending={isBookmarkPending}
        isJoining={isJoining}
        actionLabel={action.label}
        actionTone={action.tone}
        actionDisabled={action.disabled}
        onJoin={handleJoin}
      />

      {modalConfig ? (
        <Modal
          isOpen={!isClosing}
          isClosing={isClosing}
          title={modalConfig.title}
          description={modalConfig.description}
          confirmLabel={modalConfig.confirmLabel}
          cancelLabel={modalConfig.cancelLabel}
          onClose={closeModal}
          onConfirm={handleConfirmModal}
        />
      ) : null}
    </div>
  );
}
