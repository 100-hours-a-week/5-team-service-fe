import { serverApiFetch } from "@/shared/api/serverApiFetch";
import type { PolicyOption } from "@/entities/policy/model/types";

export default function getReadingGenresServer(revalidate: number) {
  return serverApiFetch<PolicyOption[]>("/policies/reading-genres", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate },
  });
}
