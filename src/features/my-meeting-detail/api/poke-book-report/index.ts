"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import type { PokeBookReportRequest } from "./types";

export default async function pokeBookReport({ roundId, meetingMemberId }: PokeBookReportRequest) {
  const requestUrl = `/meeting-rounds/${roundId}/book-reports/poke/${meetingMemberId}`;
  return apiFetch<null>(requestUrl, {
    method: "POST",
  });
}
