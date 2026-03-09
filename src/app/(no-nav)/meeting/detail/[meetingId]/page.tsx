import { notFound } from "next/navigation";
import MeetingDetailPage from "@/views/view-meeting-detail/ui/Page";

export default async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId: meetingIdParam } = await params;
  const meetingId = Number(meetingIdParam);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  return <MeetingDetailPage meetingId={meetingId} />;
}
