import z from "zod";

const ALLOWED_CHARS = /^[a-zA-Z0-9가-힣\s]+$/;

export const textSchema = (min: number, max: number, label: string) =>
  z
    .string({ message: `${label}은(는) 필수입니다.` })
    .min(min, { message: `${label}은(는) 최소 ${min}자 이상 입력해야 합니다.` })
    .max(max, { message: `${label}은(는) 최대 ${max}자까지 입력 가능합니다.` })
    .refine((v) => v.trim().length >= min, { message: "공백만 입력할 수 없습니다." })
    .regex(ALLOWED_CHARS, { message: "한글을 제외한 문자/이모지는 사용할 수 없습니다." });

export const isbnSchema = z
  .string({ message: "토론 도서는 필수 입력값입니다." })
  .regex(/^(\d{10}|\d{13})$/, { message: "ISBN은 10자리 또는 13자리 숫자여야 합니다." });

export const positionSchema = z.enum(["AGREE", "DISAGREE"] as const, {
  message: "포지션 값이 올바르지 않습니다.",
});

export const capacitySchema = z
  .number({ message: "유효한 토론 정원 값이 아닙니다." })
  .int({ message: "유효한 토론 정원 값이 아닙니다." })
  .positive({ message: "유효한 토론 정원 값이 아닙니다." })
  .min(2, { message: "토론 정원은 2명 이상이여야 합니다." })
  .max(6, { message: "토론 정원은 6명 이하여야 합니다." });

export const choiceNumberSchema = z
  .number({ message: "유효한 선택지 값이 아닙니다." })
  .int({ message: "유효한 선택지 값이 아닙니다." })
  .positive({ message: "유효한 선택지 값이 아닙니다." })
  .min(1, { message: "선택지 번호는 1~4 사이여야 합니다." })
  .max(8, { message: "선택지 번호는 1~4 사이여야 합니다." });

export const quizChoiceSchema = z.object({
  choiceNumber: choiceNumberSchema,
  text: textSchema(2, 100, "입장 퀴즈 선지"),
});

export const quizSchema = z.object({
  question: textSchema(2, 50, "입장 퀴즈"),
  choices: z.array(quizChoiceSchema).length(4, { message: "선택지는 4개여야 합니다." }),
  correctChoiceNumber: choiceNumberSchema,
});
