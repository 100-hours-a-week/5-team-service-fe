"use client";

import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/spinner";
import getMemberBookReport from "../api/get-member-book-report";

type MemberBookReportProps = {
  roundId: number;
  bookReportId: number;
};

export default function MemberBookReport({ roundId, bookReportId }: MemberBookReportProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["memberBookReport", roundId, bookReportId],
    queryFn: () => getMemberBookReport({ roundId, bookReportId }),
    enabled: Number.isFinite(roundId) && Number.isFinite(bookReportId),
  });

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="독후감 제출" />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="독후감 제출" />
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          독후감을 불러오지 못했어요.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <PageHeader title="독후감 제출" />
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6">
        <p className="text-sm text-gray-600">
          작성자 <span className="font-semibold text-gray-900">{data.writer.nickname}</span>
        </p>

        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-gray-200 p-4">
          <div className="h-20 w-16 overflow-hidden rounded-xl bg-gray-100">
            {data.book.thumbnailUrl ? (
              <img
                src={data.book.thumbnailUrl}
                alt={data.book.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">{data.book.publisher}</p>
            <p className="text-sm font-semibold text-gray-900">{data.book.title}</p>
            <p className="text-xs text-gray-500">{data.book.authors}</p>
            <p className="text-xs text-gray-400">{data.book.publishedAt}</p>
          </div>
        </div>

        <div className="mt-2 space-y-2">
          <div className="min-h-[400px] w-full whitespace-pre-wrap rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900">
            {data.bookReport.content}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>공백 포함 최소 400자</span>
            <span>{data.bookReport.content.length}/1000</span>
          </div>
          {data.bookReport.rejectionReason ? (
            <p className="text-label text-red-500">반려 사유: {data.bookReport.rejectionReason}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
