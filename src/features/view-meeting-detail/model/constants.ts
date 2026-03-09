export type MeetingDetailTabKey = "intro" | "leader" | "books" | "members" | "info";

export const TAB_ITEMS: Array<{ key: MeetingDetailTabKey; label: string }> = [
  { key: "intro", label: "모임 소개" },
  { key: "leader", label: "모임장 소개" },
  { key: "books", label: "모임 도서" },
  { key: "info", label: "상세 안내" },
  { key: "members", label: "신청 현황" },
];
