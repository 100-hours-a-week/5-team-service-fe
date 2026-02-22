import { detectImageMime } from "@/shared/lib/detectImageMime";
import z from "zod";

const CONTROL_CHARS = /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/;
const ALLOWED_CHARS = /^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 ?!,.\(\)\[\]&+\-\n\r]+$/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const textSchema = z
  .string()
  .min(2, { message: "최소 2자 이상 입력해야 합니다." })
  .max(20, { message: "최대 20자까지 입력 가능합니다." })
  .refine((v) => v.trim().length >= 2, { message: "공백만 입력할 수 없습니다." })
  .refine((v) => !CONTROL_CHARS.test(v), { message: "이모지나 특수문자는 사용할 수 없습니다." })
  .refine((v) => ALLOWED_CHARS.test(v), {
    message: "허용되지 않는 특수문자가 포함되어 있습니다. (허용: ? ! , . ( ) [ ] & + -)",
  });

export const contentSchema = z
  .string()
  .max(300, { message: "최대 300자까지 입력 가능합니다." })
  .refine((v) => v === "" || v.trim().length >= 1, { message: "공백만 입력할 수 없습니다." })
  .refine((v) => v === "" || !CONTROL_CHARS.test(v), {
    message: "이모지나 특수문자는 사용할 수 없습니다.",
  })
  .refine((v) => v === "" || ALLOWED_CHARS.test(v), {
    message: "이모지나 특수문자는 사용할 수 없습니다.",
  });

export const imageSchema = z
  .instanceof(File)
  .optional()
  .superRefine(async (file, ctx) => {
    if (!file) return;

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
