export const TOAST_DURATION_MS = 2000;

export const TOAST_MESSAGE_TYPE = {
  profile: {
    SUCCESS: { message: "프로필이 저장되었습니다." },
    ERROR: { message: "프로필 저장에 실패했습니다. 다시 시도해주세요." },
    NOOP: { message: "변경된 내용이 없습니다." },
  },
} as const;

export type ProfileToastType = keyof typeof TOAST_MESSAGE_TYPE.profile;
