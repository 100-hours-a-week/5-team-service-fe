import EditMeetingPage from "@/views/meeting-edit/ui/Page";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ meetingId: string }>;
};

export default async function Page({ params }: Params) {
  const { meetingId: meetingIdParam } = await params;
  const meetingId = Number(meetingIdParam);
  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  return <EditMeetingPage meetingId={meetingId} />;
}
