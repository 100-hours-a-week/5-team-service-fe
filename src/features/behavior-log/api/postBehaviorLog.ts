import { apiFetch } from "@/lib/api/apiFetch";
import type { BehaviorLogRequest } from "../model/types";

type PostBehaviorLogOptions = {
  keepalive?: boolean;
  timeoutMs?: number;
};

export default function postBehaviorLog(
  payload: BehaviorLogRequest,
  options: PostBehaviorLogOptions = {},
) {
  return apiFetch<null>("/analytics/behavior-logs", {
    method: "POST",
    body: JSON.stringify(payload),
    keepalive: options.keepalive,
    timeoutMs: options.timeoutMs ?? 5000,
  });
}
