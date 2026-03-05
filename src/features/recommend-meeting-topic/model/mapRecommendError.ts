import { RECOMMEND_ERROR_CODES, type RecommendErrorCode } from "./types";

const RECOMMEND_ERROR_MESSAGE: Record<RecommendErrorCode, string> = {
  NO_BOOK_REPORTS_FOR_TOPIC: "제출된 독후감이 없어 AI 추천이 불가능합니다.",
  TOPIC_RECOMMENDATION_LIMIT_EXCEEDED: "일일 최대 추천 횟수를 초과하여 AI 추천이 불가능합니다.",
  INTERNAL_SERVER_ERROR: "AI 주제 추천 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

export function isRecommendErrorCode(code?: string): code is RecommendErrorCode {
  return !!code && (RECOMMEND_ERROR_CODES as readonly string[]).includes(code);
}

export function mapRecommendError(code?: string) {
  if (!isRecommendErrorCode(code)) {
    return "AI 주제 추천 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
  return RECOMMEND_ERROR_MESSAGE[code];
}

export function isRecommendModalClosableError(code?: string) {
  return code === "NO_BOOK_REPORTS_FOR_TOPIC" || code === "TOPIC_RECOMMENDATION_LIMIT_EXCEEDED";
}
