import CreateMeetingReviewPage from "@/views/create-meeting-review/ui/Page";

type PageProps = {
  params: Promise<{ roundId: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  const parsedRoundId = Number(resolvedParams.roundId);
  const roundId = Number.isFinite(parsedRoundId) ? parsedRoundId : NaN;

  return <CreateMeetingReviewPage roundId={roundId} />;
}
