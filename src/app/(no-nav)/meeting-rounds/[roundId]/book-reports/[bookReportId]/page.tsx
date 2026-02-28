import MemberBookReportPage from "@/views/member-book-report/ui/Page";

type PageProps = {
  params: Promise<{ roundId: string; bookReportId: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const roundId = Number(resolvedParams.roundId);
  const bookReportId = Number(resolvedParams.bookReportId);

  return <MemberBookReportPage roundId={roundId} bookReportId={bookReportId} />;
}
