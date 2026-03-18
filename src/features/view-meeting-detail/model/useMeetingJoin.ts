import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authStore } from "@/shared/store/authStore";
import participateMeeting from "@/features/participate-meeting/api/participateMeeting";
import type { MeetingDetailModalType } from "./modalConfig";

type UseMeetingJoinParams = {
  meetingId: number | null;
  joinDisabled: boolean;
};

export default function useMeetingJoin({ meetingId, joinDisabled }: UseMeetingJoinParams) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isJoining, setIsJoining] = useState(false);
  const [modalType, setModalType] = useState<MeetingDetailModalType>(null);
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      setModalType(null);
    }, 200);
  };

  const handleJoin = async () => {
    if (!meetingId) return;
    const accessToken = authStore.getAccessToken();
    if (!accessToken) {
      setModalType("login");
      return;
    }
    if (joinDisabled) return;

    setIsJoining(true);
    try {
      await participateMeeting({ meetingId });
      await queryClient.invalidateQueries({ queryKey: ["meetingDetail", meetingId] });
      await queryClient.invalidateQueries({ queryKey: ["meetingParticipationStatus", meetingId] });
      router.refresh();
    } catch (error) {
      const apiError = error as { code?: string; status?: number };
      if (apiError.status === 401 || apiError.code === "AUTH_UNAUTHORIZED") {
        setModalType("login");
        return;
      }
      if (apiError.code === "MEETING_NOT_FOUND") {
        setModalType("notFound");
        return;
      }
      if (apiError.code === "JOIN_REQUEST_ALREADY_EXISTS") {
        setModalType("pending");
        return;
      }
      if (apiError.code === "JOIN_REQUEST_BLOCKED") {
        setModalType("blocked");
        return;
      }
    } finally {
      setIsJoining(false);
    }
  };

  return { isJoining, modalType, isClosing, closeModal, handleJoin };
}
