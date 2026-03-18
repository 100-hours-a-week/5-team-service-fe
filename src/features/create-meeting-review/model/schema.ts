import z from "zod";

const imageFileSchema = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
  { message: "유효한 이미지 파일이 아니에요." },
);

export const CreateMeetingReviewSchema = z.object({
  meetingRating: z
    .number()
    .min(1, "모임 별점을 선택해주세요.")
    .max(5, "모임 별점은 최대 5점까지 선택할 수 있어요."),
  leaderRating: z
    .number()
    .min(1, "모임장 별점을 선택해주세요.")
    .max(5, "모임장 별점은 최대 5점까지 선택할 수 있어요."),
  content: z
    .string()
    .min(2, "후기를 2자 이상 작성해주세요.")
    .max(200, "후기는 200자 이하로 작성해주세요.")
    .refine((v) => v.trim().length >= 2, { message: "공백만 입력할 수 없습니다." }),
  bestMemberId: z.number().int().min(1, "베스트 모임원을 선택해주세요."),
  images: z.array(imageFileSchema).max(5, "사진은 최대 5장까지 업로드할 수 있어요."),
});
