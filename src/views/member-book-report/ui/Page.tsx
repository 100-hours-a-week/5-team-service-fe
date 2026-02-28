import MemberBookReport from "@/features/member-book-report/ui/MemberBookReport";

type PageProps = {
  roundId: number;
  bookReportId: number;
};

export default function Page({ roundId, bookReportId }: PageProps) {
  return <MemberBookReport roundId={roundId} bookReportId={bookReportId} />;
}
