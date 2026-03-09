export type MeetingDetailModalType = "login" | "notFound" | "pending" | "blocked" | null;
export type MeetingDetailModalAction = "close" | "goLogin";

export type MeetingDetailModalConfig = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  action: MeetingDetailModalAction;
};

export const MEETING_DETAIL_MODAL_CONFIG: Record<
  Exclude<MeetingDetailModalType, null>,
  MeetingDetailModalConfig
> = {
  login: {
    title: "로그인이 필요해요",
    description: "모임에 가입하려면 로그인해주세요.",
    confirmLabel: "로그인하기",
    cancelLabel: "취소",
    action: "goLogin",
  },
  notFound: {
    title: "존재하지 않는 모임입니다.",
    description: "삭제되었거나 접근할 수 없는 모임이에요.",
    confirmLabel: "확인",
    action: "close",
  },
  pending: {
    title: "이미 참여 요청이 접수된 모임입니다.",
    description: "승인 결과를 기다려주세요.",
    confirmLabel: "확인",
    action: "close",
  },
  blocked: {
    title: "해당 모임에 참여할 수 없습니다.",
    description: "모임 참여가 제한된 상태입니다.",
    confirmLabel: "확인",
    action: "close",
  },
};
