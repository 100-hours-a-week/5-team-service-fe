import { PolicyOption } from "@/entities/policy/model/types";
import { apiFetch } from "@/lib/api/apiFetch";

export default function fetchReadingGenres() {
  return apiFetch<PolicyOption[]>("/policies/reading-genres", {});
}
