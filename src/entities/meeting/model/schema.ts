import toYmd from "@/lib/toYmd";
import { detectImageMime } from "@/shared/lib/detectImageMime";
import { z } from "zod";

const CONTROL_CHARS = /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/;
const ALLOWED_CHARS = /^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 ?!,.\(\)\[\]&+\-\n\r]+$/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const textSchema = z
  .string()
  .min(2, { message: "최소 2자 이상 입력해야 합니다." })
  .max(50, { message: "최대 50자까지 입력 가능합니다." })
  .refine((v) => v.trim().length >= 2, { message: "공백만 입력할 수 없습니다." })
  .refine((v) => !CONTROL_CHARS.test(v), { message: "이모지나 특수문자는 사용할 수 없습니다." })
  .refine((v) => ALLOWED_CHARS.test(v), {
    message: "허용되지 않는 특수문자가 포함되어 있습니다. (허용: ? ! , . ( ) [ ] & + -)",
  });

export const contentSchema = z
  .string()
  .min(2, { message: "최소 2자 이상 입력해야 합니다." })
  .max(300, { message: "최대 300자까지 입력 가능합니다." })
  .refine((v) => v.trim().length >= 2, { message: "공백만 입력할 수 없습니다." })
  .refine((v) => !CONTROL_CHARS.test(v), { message: "탭이나 특수 공백은 사용할 수 없습니다." })
  .refine((v) => ALLOWED_CHARS.test(v), {
    message: "허용되지 않는 특수문자가 포함되어 있습니다. (허용: ? ! , . ( ) [ ] & + -)",
  });

export const timeStringSchema = z
  .string()
  .min(1, { message: "시간을 입력해주세요." })
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "시간 형식은 HH:MM 이어야 합니다.");

export const dateStringSchema = z
  .string()
  .min(1, { message: "날짜를 입력해주세요." })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜는 YYYY-MM-DD 형식이어야 합니다.")
  .refine((v) => v >= toYmd(new Date()), "과거 날짜는 선택할 수 없습니다.");

export const imageSchema = z
  .instanceof(File, { message: "이미지를 업로드 해주세요." })
  .optional()
  .superRefine(async (file, ctx) => {
    if (!file) {
      ctx.addIssue({
        code: "custom",
        message: "이미지를 업로드해주세요",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      ctx.addIssue({
        code: "custom",
        message: "이미지는 최대 5MB까지 업로드할 수 있습니다.",
      });
      return;
    }

    const magicMime = await detectImageMime(file);
    if (!magicMime || !ALLOWED_MIME_TYPES.includes(magicMime)) {
      ctx.addIssue({
        code: "custom",
        message: "이미지는 JPG, PNG, WEBP 형식만 업로드 할 수 있습니다.",
      });
      return;
    }
  });

export const bookSchema = z.object({
  isbn: z.string().regex(/^\d{13}$/, "isbn 형식과 맞지 않습니다."),
  title: z.string().min(1, { message: "책 제목이 정상적으로 입력되지 않았습니다." }),
  authors: z.string().min(1, { message: "작가명이 정상적으로 입력되지 않았습니다." }),
  publisher: z.string().min(1, { message: "출판사명이 정상적으로 입력되지 않았습니다." }),
});

export const roundSchema = z.object({
  roundNo: z
    .number()
    .min(1, { message: "모임은 1회 이상 진행해야 합니다." })
    .max(8, { message: "모임은 최대 8회까지로 제한됩니다." }),
  date: dateStringSchema,
  book: bookSchema,
});

export const roundCountSchema = z
  .number({ message: "유효한 값이 아닙니다." })
  .int({ message: "유효한 값이 아닙니다." })
  .positive({ message: "유효한 값이 아닙니다." })
  .min(1, { message: "모임 횟수는 최소 1회 이상이어야 합니다." })
  .max(8, { message: "모임 횟수는 최대 8회 이하여야 합니다." });

export const readingGenreIdSchema = z
  .number({ message: "유효한 값이 아닙니다." })
  .int({ message: "유효한 값이 아닙니다." })
  .positive({ message: "유효한 값이 아닙니다." })
  .min(1, { message: "정상 독서 장르 ID의 범위를 벗어났습니다." })
  .max(8, { message: "정상 독서 장르 ID의 범위를 벗어났습니다." });

export const capacitySchema = z
  .number({ message: "유효한 값이 아닙니다." })
  .int({ message: "유효한 값이 아닙니다." })
  .positive({ message: "유효한 값이 아닙니다." })
  .min(3, { message: "모집 인원은 최소 3명 이상이여야 합니다." })
  .max(8, { message: "모집 인원은 최대 8명 이하여야 합니다." });
