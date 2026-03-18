import CreateMeetingReview from "@/features/create-meeting-review/ui/CreateMeetingReview";
import PageHeader from "@/components/layout/PageHeader";

type CreateMeetingReviewPageProps = {
  roundId: number;
  meetingId?: number | null;
};

export default function CreateMeetingReviewPage({
  roundId,
  meetingId,
}: CreateMeetingReviewPageProps) {
  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="후기 작성" />
      </div>
      <CreateMeetingReview roundId={roundId} meetingId={meetingId} />
    </div>
  );
}
