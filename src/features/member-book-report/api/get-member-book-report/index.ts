"use client";

import { apiFetch } from "@/lib/api/apiFetch";
import { GetMemberBookReportRequest, GetMemberBookReportResponse } from "./types";

export default async function getMemberBookReport({
  roundId,
  bookReportId,
}: GetMemberBookReportRequest): Promise<GetMemberBookReportResponse> {
  const requestUrl = `/meeting-rounds/${roundId}/book-reports/${bookReportId}`;
  return apiFetch<GetMemberBookReportResponse>(requestUrl, {
    method: "GET",
  });
}
