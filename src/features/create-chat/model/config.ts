export const LAST_STEP = 2;
export const QUIZ_CHOICE_COUNT = 4;

export const STEP_FIELDS = {
  1: ["topic", "description", "isbn"],
  2: ["capacity", "position"],
} as const;

export const CAPACITY_OPTIONS = [
  { value: 2, label: "2명", description: "1대1 개인전" },
  { value: 4, label: "4명", description: "2대2 팀전" },
  { value: 6, label: "6명", description: "3대3 팀전" },
];

export const POSITION_OPTIONS = [
  { value: "AGREE", label: "찬성" },
  { value: "DISAGREE", label: "반대" },
];
