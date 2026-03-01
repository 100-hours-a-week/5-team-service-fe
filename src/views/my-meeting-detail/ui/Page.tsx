import PageHeader from "@/components/layout/PageHeader";
import MyMeetingDetail from "@/features/my-meeting-detail/ui/MyMeetingDetail";

export default function MyMeetingDetailPage({ meetingId }: { meetingId: number }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="나의 모임 상세" />
      </div>
      <MyMeetingDetail meetingId={meetingId} />
    </div>
  );
}
